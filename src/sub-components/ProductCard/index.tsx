import { useEffect, useRef, useState } from "preact/hooks";
import {
  IkasDisplayedVariantValue,
  IkasProduct,
  addSelectedtedVariantToCart,
  createMediaSrcset,
  getDefaultSrc,
  getDisplayedProductVariantTypes,
  getProductVariantDiscountPercentage,
  getProductVariantFormattedFinalPrice,
  getProductVariantFormattedSellPrice,
  getSelectedProductVariant,
  hasProductVariantDiscount,
  hasProductVariantStock,
  hasProductVariant,
  isAddToCartEnabled,
  isColorVariantValue,
  isFavoriteIkasProduct,
  selectVariantValue,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { cx } from "../../utils/cx";
import { toggleFavorite } from "../../utils/favorites";
import { isSplitByVariantType, loadProductOptionSet, needsPersonalization, productCardHref } from "../../utils/productVariants";
import { TEXT } from "../../utils/tokens";
import { UI_EVENT, emitUi } from "../../utils/ui";
import Badge from "../Badge";
import FavoriteButton from "../FavoriteButton";
import Icon from "../Icon";
import Spinner from "../Spinner";

export interface ProductCardTexts {
  addToCartAriaLabel: string;
  favoriteAriaLabel: string;
  soldOutText: string;
  /** Cart ring of a product with required personalisation (links to the PDP instead of QuickBuy). */
  customizeAriaLabel?: string;
  newText?: string;
}

interface Props extends ProductCardTexts {
  product: IkasProduct;
  sizes?: string;
  priority?: boolean;
  showSwatches?: boolean;
  maxSwatches?: number;
  className?: string;
  onFavoriteRemove?: () => void;
}

/**
 * I/Sub/ProductCard — 4:5 media with front/back image (I-CMP-01, M-09), badges, favourite,
 * title/price/colour dots and a cart ring (I-CMP-02) that adds directly or opens QuickBuy.
 * Colour dots pick the card's colour (image, price, stock, links and QuickBuy follow it); a
 * product listed once per colour (split listing) has no dots. Required personalisation turns
 * the ring into a PDP link with its own glyph.
 */
const ProductCard = observer(function ProductCard({
  product,
  addToCartAriaLabel,
  favoriteAriaLabel,
  soldOutText,
  customizeAriaLabel,
  newText,
  sizes = "(max-width: 767px) 50vw, (max-width: 1199px) 33vw, 25vw",
  priority = false,
  showSwatches = true,
  maxSwatches = 3,
  className,
  onFavoriteRemove,
}: Props) {
  const [adding, setAdding] = useState(false);
  /** Hovered colour dot (mouse only) — previews its image without changing the selection. */
  const [preview, setPreview] = useState<IkasDisplayedVariantValue | null>(null);
  const [, setOptionsLoaded] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const variant = getSelectedProductVariant(product);
  const mediaVariant = preview?.variant ?? variant;
  const images = mediaVariant?.images ? [...mediaVariant.images].sort((a, b) => a.order - b.order) : [];
  const front = images[0]?.image ?? null;
  const back = images[1]?.image ?? null;
  const inStock = variant ? (hasProductVariantStock(variant) as unknown as boolean) : false;
  const hasDiscount = variant ? (hasProductVariantDiscount(variant) as unknown as boolean) : false;
  const discount = hasDiscount && variant ? (getProductVariantDiscountPercentage(variant) as unknown as number) : 0;
  const price = variant ? (getProductVariantFormattedFinalPrice(variant) as unknown as string) : "";
  const comparePrice = hasDiscount && variant ? (getProductVariantFormattedSellPrice(variant) as unknown as string) : "";
  const href = productCardHref(product);
  const isFavorite = isFavoriteIkasProduct(product);
  const tagName = product.tags?.[0]?.name;
  const customize = inStock && needsPersonalization(product);

  const colorType = getDisplayedProductVariantTypes(product).find((vt) =>
    vt.displayedVariantValues.some((dvv) => isColorVariantValue(dvv.variantValue)),
  );
  // split listing by colour: every colour already has its own card
  const splitByColor = !!colorType && isSplitByVariantType(product, colorType.variantType.id);
  const swatches = splitByColor ? [] : colorType?.displayedVariantValues ?? [];

  // Option set (kişiselleştirme) is not in list data: fetch it once the card nears the viewport.
  useEffect(() => {
    const el = rootRef.current;
    if (!product.productOptionSetId || product.productOptionSet || !el) return;
    let cancelled = false;
    const load = () => loadProductOptionSet(product).then(() => !cancelled && setOptionsLoaded(true));
    if (typeof IntersectionObserver === "undefined") {
      load();
      return () => {
        cancelled = true;
      };
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        load();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [product]);

  const onSwatch = (dvv: IkasDisplayedVariantValue) => {
    setPreview(null);
    if (!dvv.isSelected) selectVariantValue(product, dvv.variantValue, true);
  };

  const onFavorite = async () => {
    if ((await toggleFavorite(product)) === "removed") onFavoriteRemove?.();
  };

  const onCart = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding || !inStock) return;
    const needsChoice = hasProductVariant(product) || !!product.productOptionSetId || !!variant?.bundleSettings;
    if (needsChoice || !isAddToCartEnabled(product)) {
      emitUi(UI_EVENT.openQuickBuy, { product });
      return;
    }
    setAdding(true);
    try {
      const result = await addSelectedtedVariantToCart(product, 1);
      if (result?.success) emitUi(UI_EVENT.openCart);
      else emitUi(UI_EVENT.openQuickBuy, { product });
    } finally {
      setAdding(false);
    }
  };

  let badge: { text: string; tone: "default" | "new" | "sale" | "soldout" } | null = null;
  if (!inStock) badge = { text: soldOutText, tone: "soldout" };
  else if (hasDiscount && discount) badge = { text: `%${Math.round(discount)}`, tone: "sale" };
  else if (newText) badge = { text: newText, tone: "new" };
  else if (tagName) badge = { text: tagName, tone: "default" };

  return (
    <article ref={rootRef} className={cx("pcard", !inStock && "pcard--soldout", back && "pcard--has-back", className)}>
      <a className="pcard__media" href={href} aria-label={product.name}>
        {front && (
          <>
            {back && !back.isVideo && (
              <img
                className="pcard__img pcard__img--back"
                src={getDefaultSrc(back)}
                srcSet={createMediaSrcset(back)}
                sizes={sizes}
                alt=""
                loading="lazy"
                decoding="async"
              />
            )}
            <img
              className="pcard__img pcard__img--front"
              src={getDefaultSrc(front)}
              srcSet={createMediaSrcset(front)}
              sizes={sizes}
              alt={product.name}
              loading={priority ? "eager" : "lazy"}
              decoding={priority ? "sync" : "async"}
            />
          </>
        )}
      </a>
      {badge && (
        <div className="pcard__badges">
          <Badge text={badge.text} tone={badge.tone} />
        </div>
      )}
      <FavoriteButton className="pcard__fav" active={isFavorite} ariaLabel={favoriteAriaLabel} onToggle={onFavorite} />
      <div className="pcard__info">
        <div className="pcard__text">
          <a className={cx("pcard__title", TEXT.title)} href={href}>
            {product.name}
          </a>
          <div className="pcard__prices">
            <span className={cx("pcard__price", TEXT.price, "tabular")}>{price}</span>
            {comparePrice && <s className={cx("pcard__compare", TEXT.price, "tabular")}>{comparePrice}</s>}
          </div>
          {showSwatches && swatches.length > 1 && (
            <div className="pcard__swatches" onPointerLeave={() => setPreview(null)}>
              {swatches.slice(0, maxSwatches).map((dvv) => (
                <button
                  key={dvv.variantValue.id}
                  type="button"
                  className={cx("pcard__swatch", dvv.isSelected && "pcard__swatch--on")}
                  aria-label={dvv.variantValue.name}
                  aria-pressed={dvv.isSelected}
                  onClick={() => onSwatch(dvv)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setPreview(dvv.isSelected ? null : dvv)}
                >
                  <span className="pcard__swatch-dot" style={{ background: dvv.variantValue.colorCode ?? undefined }} />
                </button>
              ))}
              {swatches.length > maxSwatches && (
                <span className={cx("pcard__swatch-more", TEXT.badge, "tabular")}>+{swatches.length - maxSwatches}</span>
              )}
            </div>
          )}
        </div>
        {customize ? (
          // required personalisation can only be filled on the PDP: a plain link (the ikas Router
          // takes the click), with the selected colour in the query
          <a className="pcard__cart pcard__cart--customize" href={href} aria-label={customizeAriaLabel || addToCartAriaLabel}>
            <Icon name="pen-line" size={16} />
          </a>
        ) : (
          <button
            type="button"
            className="pcard__cart"
            aria-label={addToCartAriaLabel}
            onClick={onCart as any}
            disabled={!inStock}
            aria-busy={adding}
          >
            {adding ? <Spinner size={14} /> : <Icon name="bag" size={16} />}
          </button>
        )}
      </div>
    </article>
  );
});

export default ProductCard;
