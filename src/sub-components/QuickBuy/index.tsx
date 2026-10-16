import { useEffect, useRef, useState } from "preact/hooks";
import {
  IkasProduct,
  PayWithIkas,
  Router,
  createMediaSrcset,
  getBundleProductsOfVariant,
  getDefaultSrc,
  getDisplayedProductVariantTypes,
  getSelectedProductVariant,
  hasValidProductOptionSetValues,
  initBundleProducts,
  isFavoriteIkasProduct,
  isIkasVariantTypeColorSelection,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { cx } from "../../utils/cx";
import { toggleFavorite } from "../../utils/favorites";
import { prefersReducedMotion, useEscape, useScrollLock } from "../../utils/hooks";
import {
  adjustBundleProductQuantity,
  canPayWithIkas,
  fill,
  getPriceInfo,
  getProductCartLimits,
  getVariantMedia,
  isSoldOut,
  useAddToCart,
} from "../../utils/productBuy";
import { loadProductOptionSet, productCardHref } from "../../utils/productVariants";
import { TEXT } from "../../utils/tokens";
import { UI_EVENT, emitUi, onUi } from "../../utils/ui";
import ArrowLink from "../ArrowLink";
import Badge from "../Badge";
import Button, { type ButtonState } from "../Button";
import FavoriteButton from "../FavoriteButton";
import Icon from "../Icon";
import QuantitySelector from "../QuantitySelector";
import VariantPicker from "../VariantPicker";

export interface QuickBuyTexts {
  closeAriaLabel: string;
  /** qb-variant-error — shown when a required variant type (e.g. beden) is not picked. */
  chooseOptionText: string;
  addText: string;
  addingText: string;
  addedText: string;
  soldOutText: string;
  addErrorText: string;
  detailLinkText: string;
  /** "{n}" placeholder → remaining stock. */
  lowStockText: string;
  prevAriaLabel: string;
  nextAriaLabel: string;
  favoriteAriaLabel: string;
  quantityAriaLabel: string;
  decreaseAriaLabel: string;
  increaseAriaLabel: string;
  /** Muted note above the actions when a required personalisation sends the shopper to the PDP. */
  personalizeNoteText: string;
}

/** Canvas copy (I/Overlay/QuickBuy) — the coordinator can mirror these as Header TEXT defaults. */
export const QUICK_BUY_DEFAULT_TEXTS: QuickBuyTexts = {
  closeAriaLabel: "Kapat",
  chooseOptionText: "Önce beden seç.",
  addText: "Sepete ekle",
  addingText: "Ekleniyor…",
  addedText: "Sepete eklendi",
  soldOutText: "Stokta yok",
  addErrorText: "Sepete eklenemedi, tekrar dene.",
  detailLinkText: "Ürün detayına git",
  lowStockText: "SON {n} ÜRÜN",
  prevAriaLabel: "Önceki görsel",
  nextAriaLabel: "Sonraki görsel",
  favoriteAriaLabel: "Favorilere ekle",
  quantityAriaLabel: "Adet",
  decreaseAriaLabel: "Azalt",
  increaseAriaLabel: "Artır",
  personalizeNoteText: "Bu ürün kişiselleştirme içeriyor; seçimlerini ürün sayfasında tamamlarsın.",
};

interface Props {
  texts?: Partial<QuickBuyTexts>;
  /** Hızlı Öde (Pay with ikas) slot. */
  showPayWithIkas?: boolean;
  /** Stock at or below this shows the low-stock note. */
  lowStockThreshold?: number;
}

/** Variant types that need an explicit pick: every non-colour type with more than one value. */
function initialChosen(product: IkasProduct) {
  const set = new Set<string>();
  getDisplayedProductVariantTypes(product).forEach((t) => {
    if (isIkasVariantTypeColorSelection(t.variantType) || t.displayedVariantValues.length <= 1) set.add(t.variantType.id);
  });
  return set;
}

/**
 * Loads what product-list data leaves out: the option set (kişiselleştirme) and the bundle
 * parts of the selected variant. Without them `addItemToCart` rejects the product
 * (INVALID_PRODUCT_OPTION_VALUES) or sends an empty bundle. Resolves false when the option set
 * could not be loaded. Idempotent — loaded data is kept on the product.
 */
async function prepareProduct(product: IkasProduct) {
  try {
    if (product.productOptionSetId && !product.productOptionSet) await loadProductOptionSet(product);
    const variant = getSelectedProductVariant(product);
    if (variant?.bundleSettings?.products.some((bp) => !bp.product)) {
      await getBundleProductsOfVariant(product, variant);
      await initBundleProducts(product);
      variant.bundleSettings?.products.forEach(adjustBundleProductQuantity);
    }
    return !product.productOptionSetId || !!product.productOptionSet;
  } catch {
    return false;
  }
}

/**
 * I/Overlay/QuickBuy — opened by UI_EVENT.openQuickBuy ({ product }), e.g. from ProductCard.
 * 960 window (880 laptop · 640 + 280 image tablet · bottom sheet mobile), I-QB-01 · M-20.
 * Gallery with counter + arrows (desktop only), VariantSwatch / VariantChip (I-QB-03),
 * quantity, add to cart (I-QB-04) → closes and emits UI_EVENT.openCart. States: açık,
 * seçim eksik (chooseOptionText), ekleniyor. Bundles and products whose option set is all
 * optional add from here; only a required personalisation (or an option set that failed to load)
 * turns the button into the PDP link (detailLinkText).
 */
const QuickBuy = observer(function QuickBuy({ texts: textOverrides, showPayWithIkas = true, lowStockThreshold = 5 }: Props) {
  const t = { ...QUICK_BUY_DEFAULT_TEXTS } as QuickBuyTexts;
  for (const [k, v] of Object.entries(textOverrides ?? {})) if (v != null) (t as any)[k] = v;
  const [product, setProduct] = useState<IkasProduct | null>(null);
  const [visible, setVisible] = useState(false);
  const [chosen, setChosen] = useState<Set<string>>(new Set());
  const [missing, setMissing] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  /** prepareProduct: loading → ready | failed (option set missing → PDP). */
  const [prep, setPrep] = useState<"loading" | "ready" | "failed">("loading");
  const [waiting, setWaiting] = useState(false);
  const prepRun = useRef<Promise<boolean> | null>(null);
  const cart = useAddToCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = () => {
    setVisible(false);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setProduct(null), prefersReducedMotion() ? 0 : 350);
    returnFocus.current?.focus?.();
  };

  const prepare = (p: IkasProduct) => {
    const run = prepareProduct(p);
    prepRun.current = run;
    run.then((ok) => {
      if (prepRun.current === run) setPrep(ok ? "ready" : "failed");
    });
    return run;
  };

  useEffect(() => {
    const offOpen = onUi<{ product?: IkasProduct }>(UI_EVENT.openQuickBuy, (detail) => {
      const p = detail?.product;
      if (!p) return;
      setPrep("loading");
      setWaiting(false);
      prepare(p);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      returnFocus.current = document.activeElement as HTMLElement | null;
      setProduct(p);
      setChosen(initialChosen(p));
      setMissing(null);
      setImageIndex(0);
      setQuantity(getProductCartLimits(p, getSelectedProductVariant(p)).min);
      cart.clearError();
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    });
    const offAll = onUi(UI_EVENT.closeAll, () => close());
    return () => {
      offOpen();
      offAll();
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  useEffect(() => {
    if (visible) requestAnimationFrame(() => closeRef.current?.focus());
  }, [visible]);

  useScrollLock(!!product);
  useEscape(!!product, close);

  if (!product) return null;

  const variant = getSelectedProductVariant(product);
  const media = getVariantMedia(variant);
  const img = media[Math.min(imageIndex, Math.max(media.length - 1, 0))] ?? null;
  const price = getPriceInfo(variant);
  const soldOut = isSoldOut(product, variant);
  const limits = getProductCartLimits(product, variant);
  // the colour picked on the card (or here) travels to the PDP
  const href = productCardHref(product);
  const isFavorite = isFavoriteIkasProduct(product);
  const optionSet = product.productOptionSet;
  // Required personalisation can only be filled on the PDP; an all-optional set adds as is.
  const needsDetail = prep === "failed" || (!!optionSet && !hasValidProductOptionSetValues(optionSet));
  const busy = cart.busy || waiting;
  const stock = variant && !variant.sellIfOutOfStock && variant.stock > 0 && variant.stock <= lowStockThreshold ? variant.stock : 0;

  const toDetail = needsDetail && !!t.detailLinkText;
  const buttonState: ButtonState = soldOut ? "soldout" : busy ? "loading" : cart.added ? "added" : "idle";
  const buttonLabel = soldOut
    ? t.soldOutText
    : busy
      ? t.addingText
      : cart.added
        ? t.addedText
        : toDetail
          ? t.detailLinkText
          : t.addText;

  const onAdd = async () => {
    if (soldOut || busy || !variant) return;
    const unchosen = getDisplayedProductVariantTypes(product).find((vt) => !chosen.has(vt.variantType.id));
    if (unchosen) {
      setMissing(unchosen.variantType.id);
      return;
    }
    // Option set / bundle parts may still be loading (or were never loaded for this variant).
    setWaiting(true);
    if (prepRun.current) await prepRun.current;
    const ready = await prepare(product);
    setWaiting(false);
    const set = product.productOptionSet;
    if (!ready || (set && !hasValidProductOptionSetValues(set))) {
      goToDetail();
      return;
    }
    const current = getSelectedProductVariant(product);
    if (!current) return;
    const result = await cart.add(product, current, quantity);
    if (result === "ok") {
      close();
      emitUi(UI_EVENT.openCart);
    } else if (result === "options") {
      goToDetail();
    }
  };

  /** The picked variant travels in the href (?beden=m…); the sheet closes so it does not cover the PDP. */
  const goToDetail = () => {
    const to = productCardHref(product);
    close();
    Router.navigate(to);
  };

  const onFavorite = () => toggleFavorite(product);

  const step = (d: number) => media.length > 1 && setImageIndex((i) => (i + d + media.length) % media.length);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const nodes = (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), select, [tabindex="0"]',
    );
    const list = Array.from(nodes).filter((n) => n.offsetParent !== null);
    if (!list.length) return;
    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const badge = soldOut ? null : price.discount > 0 ? `%${price.discount}` : null;
  const picture = (sizes: string, cls: string) =>
    img ? (
      img.isVideo ? (
        <video key={img.id} className={cls} src={getDefaultSrc(img)} muted loop autoPlay playsInline>
          <track kind="captions" />
        </video>
      ) : (
        <img
          key={img.id}
          className={cls}
          src={getDefaultSrc(img)}
          srcSet={createMediaSrcset(img)}
          sizes={sizes}
          alt={img.altText || product.name}
          decoding="async"
        />
      )
    ) : (
      <span className="qb__placeholder">
        <Icon name="mountain" size={32} />
      </span>
    );

  return (
    <div className={cx("qb", visible && "qb--open")} role="dialog" aria-modal="true" aria-label={product.name} onKeyDown={onKeyDown as any}>
      <div className="qb__scrim" aria-hidden="true" onClick={close} />
      {/* I-QB-01 · M-20 */}
      <div className="qb__panel">
        <span className="qb__grabber" aria-hidden="true" />

        {/* desktop/tablet media column — I-QB-02 · M-02 */}
        <div className="qb__media">
          {picture("(max-width: 991px) 280px, (max-width: 1199px) 440px, 480px", "qb__img")}
          {badge && <Badge className="qb__badge" text={badge} tone="sale" />}
          {media.length > 1 && (
            <div className="qb__media-nav">
              <span className={cx("qb__count", TEXT.label, "tabular")}>
                {Math.min(imageIndex, media.length - 1) + 1} / {media.length}
              </span>
              <span className="qb__arrows">
                <button type="button" className="qb__arrow" aria-label={t.prevAriaLabel} onClick={() => step(-1)}>
                  <Icon name="chevron-left" size={18} />
                </button>
                <button type="button" className="qb__arrow" aria-label={t.nextAriaLabel} onClick={() => step(1)}>
                  <Icon name="chevron-right" size={18} />
                </button>
              </span>
            </div>
          )}
        </div>

        <div className="qb__details">
          {/* mobile header: 96×120 image + title + price */}
          <div className="qb__top">
            <a className="qb__thumb" href={href} tabIndex={-1} aria-hidden="true">
              {picture("96px", "qb__img")}
            </a>
            <div className="qb__top-text">
              <span className={cx("qb__title", TEXT.h4)}>{product.name}</span>
              <span className="qb__price">
                <span className={cx("qb__price-value", TEXT.price, "tabular")}>{price.price}</span>
                {price.compare && <s className={cx("qb__compare", TEXT.price, "tabular")}>{price.compare}</s>}
              </span>
              {badge && <Badge text={badge} tone="sale" />}
            </div>
          </div>

          <div className="qb__head">
            <h2 className={cx("qb__title", TEXT.h3)}>{product.name}</h2>
          </div>
          <div className="qb__price qb__price--desktop">
            <span className={cx("qb__price-value", TEXT.priceLg, "tabular")}>{price.price}</span>
            {price.compare && <s className={cx("qb__compare", TEXT.priceLg, "tabular")}>{price.compare}</s>}
          </div>
          <span className="qb__rule" aria-hidden="true" />

          {/* I-QB-03 · M-28 via VariantSwatch / VariantChip */}
          <VariantPicker
            product={product}
            disableRoute
            chosen={chosen}
            missingTypeId={missing}
            missingText={t.chooseOptionText}
            onSelect={(vt) => {
              setChosen((s) => new Set(s).add(vt.variantType.id));
              setMissing(null);
              setImageIndex(0);
              prepare(product);
            }}
          />

          <span className="qb__spacer" aria-hidden="true" />

          {/* required personalisation: say why the button leads to the PDP instead of the cart */}
          {toDetail && !soldOut && t.personalizeNoteText && (
            <p className={cx("qb__note", TEXT.uiSm)}>
              <Icon name="info" size={16} />
              {t.personalizeNoteText}
            </p>
          )}

          {/* I-QB-04 · M-11 via Button */}
          <div className="qb__actions">
            {!soldOut && (
              <QuantitySelector
                className="qb__qty"
                value={quantity}
                min={limits.min}
                max={limits.max}
                onChange={setQuantity}
                valueAriaLabel={t.quantityAriaLabel}
                decreaseAriaLabel={t.decreaseAriaLabel}
                increaseAriaLabel={t.increaseAriaLabel}
              />
            )}
            {/* PDP fallback is drawn as the outline button with a trailing arrow so it never reads as "Sepete ekle" */}
            <Button
              label={buttonLabel}
              state={buttonState}
              variant={toDetail && !soldOut ? "outline" : "solid"}
              iconEnd={toDetail && !soldOut && !busy ? <Icon name="arrow-right" size={16} /> : undefined}
              fullWidth
              className="qb__add"
              onClick={onAdd}
            />
            <span className="qb__fav">
              <FavoriteButton active={isFavorite} ariaLabel={t.favoriteAriaLabel} size="md" onToggle={onFavorite} />
            </span>
          </div>
          {cart.error && t.addErrorText && (
            <p className={cx("qb__error", TEXT.uiSm)} role="alert">
              {t.addErrorText}
            </p>
          )}

          {showPayWithIkas && !soldOut && prep === "ready" && !needsDetail && !variant?.bundleSettings && canPayWithIkas() && (
            <div className="qb__pay">
              <PayWithIkas product={product} quantity={quantity} />
            </div>
          )}

          <div className="qb__foot">
            {stock > 0 && t.lowStockText ? (
              <span className={cx("qb__stock", TEXT.label, "tabular")}>
                <span className="qb__stock-dot" aria-hidden="true" />
                {fill(t.lowStockText, { n: stock })}
              </span>
            ) : (
              <span />
            )}
            {/* I-QB-05 · M-10 via ArrowLink */}
            {t.detailLinkText && !toDetail && <ArrowLink label={t.detailLinkText} href={href} />}
          </div>
        </div>

        <button ref={closeRef} type="button" className="qb__close" aria-label={t.closeAriaLabel} onClick={close}>
          <Icon name="x" size={20} />
        </button>
      </div>
    </div>
  );
});

export default QuickBuy;
