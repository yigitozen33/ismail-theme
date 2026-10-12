import { useEffect, useRef, useState } from "preact/hooks";
import {
  IkasComponentRenderer,
  IkasImage,
  IkasProductStockLocations,
  IkasStorefrontConfig,
  PayWithIkas,
  Router,
  acceptProductOffer,
  addIkasProductToFavorites,
  createMediaSrcset,
  customerStore,
  formatCurrency,
  getBundleProductsOfVariant,
  getDefaultSrc,
  getDisplayedProductGroups,
  getIkasCategoryPathItemHref,
  getProductAvailableStockLocations,
  getProductCampaigns,
  getProductCategoryPath,
  getProductVariantFinalPriceWithCampaignOffers,
  getProductVariantFormattedFinalPriceWithCampaignOffers,
  getProductVariantFinalPrice,
  getProductVariantFormattedSellPriceWithCampaignOffers,
  getProductVariantIsBackInStockCustomerLoginRequired,
  getProductVariantIsBackInStockEnabled,
  getProductVariantPrice,
  getProductVariantSellPriceWithCampaignOffers,
  getProductVariantTieredDiscountProducts,
  getSelectedProductVariant,
  getThumbnailSrc,
  hasCustomer,
  initBundleProducts,
  isAcceptedProductOffer,
  isCustomerReviewEnabled,
  isFavoriteIkasProduct,
  rejectProductOffer,
  removeIkasProductFromFavorites,
  saveProductVariantBackInStockReminder,
  withRoutePrefix,
  getAttributeDetailValues,
  getDisplayedProductVariantTypes,
  isIkasVariantTypeColorSelection,
} from "@ikas/bp-storefront";
import AccordionItem from "../../sub-components/AccordionItem";
import ArrowLink from "../../sub-components/ArrowLink";
import Badge from "../../sub-components/Badge";
import Breadcrumbs from "../../sub-components/Breadcrumbs";
import BundleItem from "../../sub-components/BundleItem";
import Button, { type ButtonState } from "../../sub-components/Button";
import FavoriteButton from "../../sub-components/FavoriteButton";
import FormField from "../../sub-components/FormField";
import Icon from "../../sub-components/Icon";
import ImagePreview from "../../sub-components/ImagePreview";
import VideoPlayer from "../../sub-components/VideoPlayer";
import OfferCard from "../../sub-components/OfferCard";
import ProductOptions from "../../sub-components/ProductOptions";
import QuantitySelector from "../../sub-components/QuantitySelector";
import RatingStars from "../../sub-components/RatingStars";
import SizeGuide, { getAttributeSizeTable } from "../../sub-components/SizeGuide";
import Skeleton from "../../sub-components/Skeleton";
import VariantPicker from "../../sub-components/VariantPicker";
import { cx } from "../../utils/cx";
import { prefersReducedMotion, useMounted } from "../../utils/hooks";
import {
  adjustBundleProductQuantity,
  canPayWithIkas,
  fill,
  getEditLineId,
  getPriceInfo,
  getProductCartLimits,
  getVariantMedia,
  isSoldOut,
  useAddToCart,
} from "../../utils/productBuy";
import { TEXT, upperTr } from "../../utils/tokens";
import { UI_EVENT, emitUi } from "../../utils/ui";
import { Props } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * I/Section/ProductDetail — gallery (≥768: vertical thumb rail + one 4:5 main media ·
 * mobile: horizontal track + dots, or a "1 / N" counter above 5 media) beside a 452 sticky
 * info column (I-PDP-01 · M-13).
 * Every merchant block (campaign, tiers, product group, options, bundle, offers, stock
 * locations, back-in-stock) renders only when the product carries that data.
 * States: yükleniyor (skeleton), ekleniyor, eklendi, stok yok, sepeti güncelle / sepet
 * güncelleniyor (?editLineID), haber ver (form · kaydedildi · giriş gerekli).
 */
export function ProductDetail(props: Props) {
  const {
    product,
    homeText = "Ana sayfa",
    breadcrumbAriaLabel = "Sayfa konumu",
    skuLabel = "ÜRÜN KODU",
    reviewsLinkText = "Değerlendirmeleri gör",
    ratingAriaLabel = "5 üzerinden {n} puan",
    noReviewsText = "Henüz yorum yok",
    soldOutBadgeText = "Tükendi",
    tiersTitle = "ÇOK AL, AZ ÖDE",
    tierUnitPriceText = "{price} / adet",
    tierCardQtyText = "{n} adet",
    tierSavingText = "%{n} tasarruf",
    tierBestText = "En avantajlı",
    tierCustomQtyText = "Farklı adet seç",
    tierAddText = "{n} adet sepete ekle · {total}",
    groupLabel = "MODEL ·",
    sizeGuideText = "Beden rehberi",
    addToCartText = "Sepete ekle",
    addingText = "Ekleniyor…",
    addedText = "Sepete eklendi",
    outOfStockText = "Stokta yok",
    updateCartText = "Sepeti güncelle",
    updatingCartText = "Güncelleniyor…",
    addToCartErrorText = "Sepete eklenemedi, tekrar dene.",
    favoriteAriaLabel = "Favorilere ekle",
    quantityAriaLabel = "Adet",
    decreaseAriaLabel = "Azalt",
    increaseAriaLabel = "Artır",
    optionsTitle = "KİŞİSELLEŞTİR",
    optionSetErrorText = "Devam etmek için seçenekleri tamamla.",
    optionRequiredText = "Bu alanı doldurmalısın.",
    optionOptionalText = "(isteğe bağlı)",
    optionSelectPlaceholder = "Seç",
    optionLimitText = "EN FAZLA {max} SEÇİM · {count}/{max}",
    optionMinText = "EN AZ {min} SEÇİM",
    fileUploadText = "Dosya seç ya da sürükle (PNG, en fazla 5 MB)",
    fileUploadingText = "Yükleniyor…",
    fileUploadErrorText = "Dosya yüklenemedi.",
    fileRemoveAriaLabel = "Dosyayı kaldır",
    bundleTitle = "SET İÇERİĞİ ·",
    bundleCountText = "{n} PARÇA",
    bundleIncludedText = "Sete dahil",
    offerInCartText = "Sepette",
    offerSoldOutText = "Tükendi",
    offerVariantAriaLabel = "Seçenek",
    offersAddText = "Birlikte sepete ekle ({n})",
    offersSavingText = "{amount} KAZANÇ",
    lowStockText = "SON {n} ÜRÜN · 2 İŞ GÜNÜNDE KARGODA",
    inStockText,
    outOfStockNoteText = "STOKTA YOK",
    backInStockTitle = "Bu beden tükendi. Gelince haber verelim.",
    backInStockPlaceholder = "E-posta adresin",
    backInStockButtonText = "Haber ver",
    backInStockSendingText = "Kaydediliyor…",
    backInStockSuccessText = "Kaydettik. Stoka girince e-posta göndereceğiz.",
    backInStockErrorText = "Geçerli bir e-posta adresi gir.",
    backInStockLoginText = "Hatırlatma için giriş yapmalısın.",
    backInStockLoginLinkText = "Giriş yap",
    stockLocationsTitle = "MAĞAZADA STOK",
    stockCountText = "{n} ADET",
    stockLastText = "SON {n}",
    pickupText = "Bugün mağazadan teslim alabilirsin.",
    descriptionTitle = "Ürün detayı",
    shippingTitle = "Kargo ve iade",
    careTitle = "Malzeme ve bakım",
    shippingText,
    careAttribute,
    careText: careFallbackText = "<p>Malzeme bilgisi ve bakım talimatı ürünün etiketinde yer alır. Yıkamadan önce etiketi kontrol et; yumuşatıcı ve çamaşır suyu kullanma, düşük ısıda kurut.</p>",
    closeAriaLabel = "Kapat",
    prevAriaLabel = "Önceki görsel",
    nextAriaLabel = "Sonraki görsel",
    zoomAriaLabel = "Görseli büyüt",
    playVideoAriaLabel = "Videoyu oynat",
    videoPauseAriaLabel = "Videoyu durdur",
    videoMuteAriaLabel = "Sesi kapat",
    videoUnmuteAriaLabel = "Sesi aç",
    videoFullscreenAriaLabel = "Tam ekran",
    videoSeekAriaLabel = "Video ilerlemesi",
    galleryDotAriaLabel = "{n}. görsele git",
    galleryCounterText = "{current} / {total}",
    sizeGuideLink,
    sizeGuideAttribute,
    sizeGuideFallbackText = "<table><thead><tr><th>Beden</th><th>Göğüs</th><th>Bel</th><th>Boy</th></tr></thead><tbody><tr><td>S</td><td>92–96</td><td>78–82</td><td>68</td></tr><tr><td>M</td><td>97–101</td><td>83–87</td><td>70</td></tr><tr><td>L</td><td>102–106</td><td>88–92</td><td>72</td></tr><tr><td>XL</td><td>107–111</td><td>93–97</td><td>74</td></tr></tbody></table>",
    sizeGuideTitle = "Beden rehberi",
    sizeGuideNote = "Ölçüler santimetredir. İki beden arasındaysan büyüğü seç.",
    sizeColumnLabel = "Beden",
    howToMeasureTitle = "Nasıl ölçülür?",
    howToMeasureText = "<p><strong>Göğüs</strong> Kolların altından, göğsün en geniş yerinden ölç.</p><p><strong>Bel</strong> Belin en ince yerinden ölç.</p><p><strong>Boy</strong> Omuzdan etek ucuna kadar ölç.</p>",
    showPayWithIkas = true,
    preselectOffers = false,
    lowStockThreshold = 5,
    highlights,
    backgroundColor,
  } = props;

  const mounted = useMounted();
  const cart = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [showOptionErrors, setShowOptionErrors] = useState(false);
  const [preview, setPreview] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [switched, setSwitched] = useState(false);
  const [railFade, setRailFade] = useState(false);
  // index of the media whose player has started (its controls take the slide's bottom corners)
  const [videoOn, setVideoOn] = useState<number | null>(null);
  const [locations, setLocations] = useState<IkasProductStockLocations[]>([]);
  const [, setTick] = useState(0);
  const [bisEmail, setBisEmail] = useState("");
  const [bisStatus, setBisStatus] = useState<"idle" | "sending" | "saved" | "error">("idle");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [customQty, setCustomQty] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const scrollRaf = useRef(0);

  // ≥768 rail: a soft fade at the bottom while more thumbs sit below the fold.
  const updateRailFade = () => {
    const rail = railRef.current;
    const fade = !!rail && rail.scrollTop + rail.clientHeight < rail.scrollHeight - 1;
    setRailFade((f) => (f === fade ? f : fade));
  };
  const optionsRef = useRef<HTMLDivElement>(null);
  const tierQtyRef = useRef<HTMLDivElement>(null);

  // "Farklı adet seç" swaps itself for the stepper; focus follows to the stepper's first live button.
  useEffect(() => {
    if (customQty) tierQtyRef.current?.querySelector<HTMLElement>("button:not(:disabled)")?.focus();
  }, [customQty]);

  const variant = product ? getSelectedProductVariant(product) : null;
  const variantId = variant?.id;
  const media: IkasImage[] = getVariantMedia(variant);
  const mediaKey = media.map((m) => m.id).join("|");
  const limits = product ? getProductCartLimits(product, variant) : { min: 1, max: undefined };

  useEffect(() => {
    setQuantity((q) => Math.min(Math.max(q, limits.min), limits.max ?? Number.MAX_SAFE_INTEGER));
  }, [product?.id, variantId, limits.min, limits.max]);

  // Campaign data (pdp-campaign, pdp-tiers) is attached to the variants by getProductCampaigns.
  useEffect(() => {
    if (!product || product.campaigns !== undefined) return;
    let alive = true;
    getProductCampaigns(product)
      .then(() => alive && setTick((t) => t + 1))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [product?.id]);

  // pdp-stock-locations: hidden when the merchant has no pickup locations / no data.
  useEffect(() => {
    if (!product) return;
    let alive = true;
    getProductAvailableStockLocations(product)
      .then((res) => alive && setLocations(res ?? []))
      .catch(() => alive && setLocations([]));
    return () => {
      alive = false;
    };
  }, [product?.id]);

  useEffect(() => {
    product?.offers?.forEach((offer) => {
      if (isAcceptedProductOffer(offer)) return;
      if (preselectOffers) acceptProductOffer(offer);
      else rejectProductOffer(offer);
    });
  }, [product?.id, preselectOffers]);

  // Set ürün: load bundle products for the selected variant, clamp quantities to stock.
  useEffect(() => {
    if (!product || !variant?.bundleSettings) return;
    let alive = true;
    (async () => {
      try {
        await getBundleProductsOfVariant(product, variant);
        await initBundleProducts(product);
        if (alive) variant.bundleSettings?.products.forEach(adjustBundleProductQuantity);
      } catch {
        /* bundle list stays empty */
      } finally {
        if (alive) setTick((t) => t + 1);
      }
    })();
    return () => {
      alive = false;
    };
  }, [product?.id, variantId]);

  useEffect(() => {
    setBisStatus(variant?.isBackInStockReminderSaved ? "saved" : "idle");
    setShowOptionErrors(false);
  }, [variantId]);

  // I-PDP-02 · M-19: a new media list (variant change) starts again from the first media.
  useEffect(() => {
    setActiveIndex(0);
    setVideoOn(null);
    setSwitched(false);
    if (trackRef.current) trackRef.current.scrollLeft = 0;
    if (railRef.current) railRef.current.scrollTop = 0;
    updateRailFade();
    const rail = railRef.current;
    if (!rail || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(updateRailFade);
    ro.observe(rail);
    return () => ro.disconnect();
  }, [mediaKey]);

  // Keep the active thumb inside the rail viewport (VideoPlayer pauses itself when inactive).
  useEffect(() => {
    const rail = railRef.current;
    const thumb = rail?.querySelector<HTMLElement>(`[data-thumb-index="${activeIndex}"]`);
    if (rail && thumb && rail.scrollHeight > rail.clientHeight + 1) {
      const fadeRoom = 32;
      const top = thumb.offsetTop;
      const bottom = top + thumb.offsetHeight;
      let next = rail.scrollTop;
      if (top < rail.scrollTop) next = top;
      else if (bottom > rail.scrollTop + rail.clientHeight - fadeRoom) next = bottom - rail.clientHeight + fadeRoom;
      if (next !== rail.scrollTop) rail.scrollTo({ top: next, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
  }, [activeIndex]);

  useEffect(() => () => cancelAnimationFrame(scrollRaf.current), []);

  /* ---------- yükleniyor ---------- */
  if (!product || !variant) {
    return (
      <section className="pdp pdp--loading" style={backgroundColor ? { backgroundColor } : undefined} aria-busy="true">
        <div className="pdp__crumbs">
          <Breadcrumbs items={[{ label: homeText, href: withRoutePrefix("/") }]} ariaLabel={breadcrumbAriaLabel} />
        </div>
        {/* pdp-skeleton: 876×700 gallery block + I/Sub/Skeleton (media 120 · title 260×24 · 2 lines · button 48) */}
        <div className="pdp__main">
          <div className="pdp__skel-gallery" />
          <div className="pdp__details pdp__skel">
            <Skeleton height={120} className="pdp__skel-media" />
            <Skeleton width={260} height={24} />
            <Skeleton height={12} />
            <Skeleton height={12} />
            <Skeleton height={48} />
          </div>
        </div>
      </section>
    );
  }

  const editMode = mounted && !!getEditLineId();
  const soldOut = isSoldOut(product, variant);
  const price = getPriceInfo(variant);
  // Care text: the product's own custom field (careAttribute) when set, otherwise the shared careText.
  const careText =
    (careAttribute?.attributePropValue?.attributeId
      ? getAttributeDetailValues(careAttribute)
          .map((v) => v.value ?? "")
          .filter(Boolean)
          .join("")
      : "") || careFallbackText;
  // Size guide: the product's TABLE custom field, else the shared rich text, else the sizeGuideLink page.
  const sizeTable = getAttributeSizeTable(sizeGuideAttribute, sizeColumnLabel);
  const sizeGuideHtml = sizeGuideFallbackText?.replace(/<[^>]*>|&nbsp;/g, "").trim() ? sizeGuideFallbackText : "";
  const hasSizeGuide = !!sizeTable || !!sizeGuideHtml;
  // Selected size = selected value of the first non-colour variant type (the row the guide link sits on).
  const sizeType = getDisplayedProductVariantTypes(product).find(
    (t) => t.displayedVariantValues.length > 0 && !isIkasVariantTypeColorSelection(t.variantType),
  );
  const selectedSize = sizeType?.displayedVariantValues.find((v) => v.isSelected)?.variantValue.name ?? null;
  const isFavorite = isFavoriteIkasProduct(product);
  const loggedIn = hasCustomer(customerStore);

  /* ---------- breadcrumbs ---------- */
  const crumbs = [
    { label: homeText, href: withRoutePrefix("/") },
    ...getProductCategoryPath(product).map((c) => ({ label: c.name, href: getIkasCategoryPathItemHref(c) })),
  ];

  /* ---------- badges ---------- */
  const badges: { text: string; tone: "default" | "new" | "sale" | "soldout" }[] = [];
  if (soldOut) badges.push({ text: soldOutBadgeText, tone: "soldout" });
  else if (price.discount > 0) badges.push({ text: `%${price.discount}`, tone: "sale" });
  (product.tags ?? []).slice(0, 2).forEach((t) => t?.name && badges.push({ text: t.name, tone: "new" }));

  /* ---------- campaign + tiers ---------- */
  const tiers = getProductVariantTieredDiscountProducts(variant)
    .filter((t) => !t.salesChannelIds?.length || t.salesChannelIds.includes(IkasStorefrontConfig.salesChannelId ?? ""))
    .sort((a, b) => a.lineItemQuantityRange.min - b.lineItemQuantityRange.min);
  const campaignTitle = (variant.campaigns ?? product.campaigns ?? [])
    .map((c) => c.campaign)
    .find((c) => c && !c.deleted && !c.tieredDiscount && c.title)?.title;

  /* ---------- groups, bundle, offers, stock ---------- */
  const groups = getDisplayedProductGroups(product).filter((g) => g.items.length > 0);
  const bundle = variant.bundleSettings ? [...variant.bundleSettings.products].sort((a, b) => a.order - b.order) : [];
  const offers = product.offers ?? [];
  const selectedOffers = offers.filter((o) => o.isSelected && !isAcceptedProductOffer(o)).length;
  const currency = getProductVariantPrice(variant);
  const money = (n: number) => formatCurrency(n, currency.currency ?? "", currency.currencySymbol ?? null);

  /* ---------- tier cards (gDR5Y) ---------- */
  // Prices come resolved per tier: `finalPrice` is per unit, `finalPriceWithQuantity` the total at the
  // tier minimum. A FIXED_AMOUNT tier discounts only that total, so the gap between the two is kept as
  // a flat discount when the quantity grows inside the tier.
  const singlePrice = getProductVariantFinalPrice(variant);
  const tierOf = (q: number) =>
    tiers.find((t) => q >= t.lineItemQuantityRange.min && (t.lineItemQuantityRange.max === 0 || q <= t.lineItemQuantityRange.max));
  const totalFor = (q: number) => {
    const t = tierOf(q);
    if (!t) return singlePrice * q;
    const flat = t.finalPrice * t.lineItemQuantityRange.min - t.finalPriceWithQuantity;
    return Math.max(0, t.finalPrice * q - flat);
  };
  const tierCards = tiers.length
    ? [
        ...(tiers[0].lineItemQuantityRange.min > 1 ? [{ n: 1, min: 1, max: tiers[0].lineItemQuantityRange.min - 1 }] : []),
        ...tiers.map((t) => ({ n: t.lineItemQuantityRange.min, min: t.lineItemQuantityRange.min, max: t.lineItemQuantityRange.max })),
      ].map((c) => {
        const total = totalFor(c.n);
        const compare = singlePrice * c.n;
        const saving = compare > 0 ? Math.round((1 - total / compare) * 100) : 0;
        return { ...c, total, compare, saving: saving > 0 ? saving : 0 };
      })
    : [];
  const bestSaving = Math.max(0, ...tierCards.map((c) => c.saving));
  const bestIndex = bestSaving > 0 ? tierCards.findIndex((c) => c.saving === bestSaving) : -1;
  const selectedCard = tierCards.findIndex((c) => quantity >= c.min && (c.max === 0 || quantity <= c.max));
  const clampQty = (n: number) => Math.min(Math.max(n, limits.min), limits.max ?? Number.MAX_SAFE_INTEGER);
  const quantityTotal = totalFor(quantity);
  const quantityUnit = quantity > 0 ? quantityTotal / quantity : singlePrice;
  const tierPriceActive = tiers.length > 0 && money(quantityUnit) !== money(singlePrice);
  const offersSaving = offers.length
    ? getProductVariantSellPriceWithCampaignOffers(variant) - getProductVariantFinalPriceWithCampaignOffers(variant)
    : 0;
  const offersTotal = offers.length ? getProductVariantFormattedFinalPriceWithCampaignOffers(variant) : "";
  const offersCompare = offersSaving > 0 ? getProductVariantFormattedSellPriceWithCampaignOffers(variant) : "";
  const stores = locations.filter(
    (l) => l.variantId === variant.id && l.stockCount > 0 && l.stockLocation?.type !== "VIRTUAL",
  );
  const tracked = !variant.sellIfOutOfStock && !variant.bundleSettings;
  let stockNote: { text: string; tone: "low" | "out" | "in" } | null = null;
  if (soldOut) stockNote = outOfStockNoteText ? { text: outOfStockNoteText, tone: "low" } : null;
  else if (tracked && variant.stock > 0 && variant.stock <= lowStockThreshold && lowStockText)
    stockNote = { text: fill(lowStockText, { n: variant.stock }), tone: "low" };
  else if (inStockText) stockNote = { text: inStockText, tone: "in" };

  /* ---------- back in stock ---------- */
  const bisEnabled = soldOut && getProductVariantIsBackInStockEnabled(variant);
  const bisLoginRequired = !!getProductVariantIsBackInStockCustomerLoginRequired(variant);
  const bisNeedsLogin = bisLoginRequired && !loggedIn;
  const onBackInStock = async (e: Event) => {
    e.preventDefault();
    if (bisStatus === "sending") return;
    const email = (bisEmail || customerStore.customer?.email || "").trim();
    if (!EMAIL_RE.test(email)) {
      setBisStatus("error");
      return;
    }
    setBisStatus("sending");
    const ok = await saveProductVariantBackInStockReminder(variant, email).catch(() => false);
    setBisStatus(ok ? "saved" : "error");
  };

  /* ---------- cart ---------- */
  const buttonState: ButtonState = soldOut ? "soldout" : cart.busy ? "loading" : cart.added ? "added" : "idle";
  const buttonLabel = soldOut
    ? outOfStockText
    : cart.busy
      ? editMode
        ? updatingCartText
        : addingText
      : cart.added
        ? addedText
        : editMode
          ? updateCartText
          : addToCartText;
  const mainButtonLabel =
    tiers.length > 0 && !soldOut && !cart.busy && !cart.added && !editMode && tierAddText
      ? fill(tierAddText, { n: quantity, total: money(quantityTotal) })
      : buttonLabel;

  const onAdd = async () => {
    if (soldOut || cart.busy) return;
    const result = await cart.add(product, variant, quantity);
    if (result === "options") {
      setShowOptionErrors(true);
      optionsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (result === "ok") {
      setShowOptionErrors(false);
      // options reset after a successful add; the quantity goes back to the cart minimum with them
      setQuantity(limits.min);
      emitUi(UI_EVENT.openCart);
    }
  };

  const onFavorite = async () => {
    if (!loggedIn) {
      Router.navigateToPage("LOGIN");
      return;
    }
    if (isFavorite) await removeIkasProductFromFavorites(product);
    else await addIkasProductToFavorites(product);
  };

  /* ---------- gallery ---------- */
  const multi = media.length > 1;
  const showCounter = media.length > 5;

  // ≥768: a thumb swaps the main media.
  const selectMedia = (i: number) => {
    setSwitched(true);
    setActiveIndex(i);
  };

  const onRailKey = (e: KeyboardEvent) => {
    const step = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (activeIndex + step + media.length) % media.length;
    selectMedia(next);
    railRef.current?.querySelector<HTMLElement>(`[data-thumb-index="${next}"]`)?.focus({ preventScroll: true });
  };

  // mobile: the slide snapped to the start of the track drives the dots / counter.
  const onTrackScroll = () => {
    if (scrollRaf.current) return;
    scrollRaf.current = requestAnimationFrame(() => {
      scrollRaf.current = 0;
      const track = trackRef.current;
      const slides = track ? Array.from(track.querySelectorAll<HTMLElement>("[data-media-index]")) : [];
      if (!track || slides.length < 2) return;
      const base = slides[0].offsetLeft;
      let best = 0;
      if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) best = slides.length - 1;
      else {
        let bestDist = Infinity;
        slides.forEach((el, i) => {
          const d = Math.abs(el.offsetLeft - base - track.scrollLeft);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
      }
      setActiveIndex(best);
    });
  };

  const goToSlide = (i: number) => {
    const track = trackRef.current;
    const slides = track?.querySelectorAll<HTMLElement>("[data-media-index]");
    if (!track || !slides?.[i]) return;
    track.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const videoTexts = {
    playAriaLabel: playVideoAriaLabel,
    pauseAriaLabel: videoPauseAriaLabel,
    muteAriaLabel: videoMuteAriaLabel,
    unmuteAriaLabel: videoUnmuteAriaLabel,
    fullscreenAriaLabel: videoFullscreenAriaLabel,
    seekAriaLabel: videoSeekAriaLabel,
  };

  const renderMedia = (img: IkasImage, i: number) => {
    if (img.isVideo) {
      return (
        <div key={img.id || i} className={cx("pdp__media pdp__media--video", i === activeIndex && "pdp__media--on")} data-media-index={i}>
          <VideoPlayer
            src={getDefaultSrc(img)}
            texts={videoTexts}
            videoClassName="pdp__img"
            active={i === activeIndex}
            onStartedChange={(on) => setVideoOn((v) => (on ? i : v === i ? null : v))}
          />
        </div>
      );
    }
    return (
      <button
        key={img.id || i}
        type="button"
        className={cx("pdp__media", i === activeIndex && "pdp__media--on")}
        data-media-index={i}
        aria-label={`${zoomAriaLabel} ${i + 1}`}
        onClick={() => setPreview(i)}
      >
        <img
          className="pdp__img"
          src={getDefaultSrc(img)}
          srcSet={createMediaSrcset(img)}
          sizes="(max-width: 767px) 82vw, (max-width: 991px) 560px, (max-width: 1199px) 54vw, 800px"
          alt={img.altText || `${product.name} ${i + 1}`}
          loading={i < 2 ? "eager" : "lazy"}
          decoding={i === 0 ? "sync" : "async"}
          {...({ fetchpriority: i === 0 ? "high" : undefined } as any)}
        />
      </button>
    );
  };

  const optionTexts = {
    optionsTitle,
    optionSetErrorText,
    optionRequiredText,
    optionOptionalText,
    optionSelectPlaceholder,
    optionLimitText,
    optionMinText,
    fileUploadText,
    fileUploadingText,
    fileUploadErrorText,
    fileRemoveAriaLabel,
  };

  const highlightList = (highlights as any[]) ?? [];

  return (
    <section className="pdp" style={backgroundColor ? { backgroundColor } : undefined}>
      <div className="pdp__crumbs">
        <Breadcrumbs items={crumbs} ariaLabel={breadcrumbAriaLabel} />
      </div>

      <div className="pdp__main">
        {/* I-PDP-02 · M-19 */}
        <div className={cx("pdp__gallery-wrap", multi ? "pdp__gallery-wrap--rail" : "pdp__gallery-wrap--single")}>
          {multi && (
            <div className="pdp__rail-box">
              <div
                ref={railRef}
                className={cx("pdp__rail", railFade && "pdp__rail--fade")}
                onScroll={updateRailFade}
                onKeyDown={onRailKey as any}
              >
                {media.map((img, i) => (
                  <button
                    key={img.id || i}
                    type="button"
                    className={cx("pdp__thumb", i === activeIndex && "pdp__thumb--on")}
                    data-thumb-index={i}
                    aria-label={fill(galleryDotAriaLabel, { n: i + 1 })}
                    aria-current={i === activeIndex ? "true" : undefined}
                    onClick={() => selectMedia(i)}
                  >
                    {img.isVideo ? (
                      <span className="pdp__thumb-video">
                        {/* first frame as the poster; #t nudges Safari to paint it */}
                        <video className="pdp__thumb-video-frame" src={`${getDefaultSrc(img)}#t=0.1`} muted playsInline preload="metadata" aria-hidden="true" tabIndex={-1} />
                        <span className="pdp__thumb-video-play">
                          <Icon name="play" size={12} />
                        </span>
                      </span>
                    ) : (
                      <img className="pdp__thumb-img" src={getThumbnailSrc(img)} alt="" loading="lazy" decoding="async" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="pdp__stage">
            <div ref={trackRef} className={cx("pdp__gallery", switched && "pdp__gallery--switched")} onScroll={onTrackScroll}>
              {media.length ? (
                media.map(renderMedia)
              ) : (
                <div className="pdp__media pdp__media--empty pdp__media--on" data-media-index={0}>
                  <Icon name="mountain" size={40} />
                </div>
              )}
            </div>
            {multi && !showCounter && (
              <div className="pdp__dots">
                {media.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={cx("pdp__dot", i === activeIndex && "pdp__dot--on")}
                    aria-label={fill(galleryDotAriaLabel, { n: i + 1 })}
                    aria-current={i === activeIndex ? "true" : undefined}
                    onClick={() => goToSlide(i)}
                  />
                ))}
              </div>
            )}
            {showCounter && videoOn !== activeIndex && (
              <span className={cx("pdp__duration", "pdp__counter", TEXT.label, "tabular")}>
                {fill(galleryCounterText, { current: activeIndex + 1, total: media.length })}
              </span>
            )}
          </div>
        </div>

        {/* I-PDP-01 · M-13 */}
        <div className="pdp__details">
          {badges.length > 0 && (
            <div className="pdp__badges">
              {badges.map((b, i) => (
                <Badge key={i} text={b.text} tone={b.tone} />
              ))}
            </div>
          )}

          <div className="pdp__title-block">
            <h1 className={cx("pdp__title", TEXT.h3)}>{product.name}</h1>
            {variant.sku && (
              <p className={cx("pdp__sku", TEXT.label)}>
                <span>{skuLabel}</span> <span className="tabular">{variant.sku}</span>
              </p>
            )}
          </div>

          {((product.reviewCount ?? 0) > 0 || isCustomerReviewEnabled(product)) && (
            <div className="pdp__rating">
              {/* RatingStars — yorumsuz: line stars + noReviewsText */}
              <RatingStars
                rating={product.averageRating}
                count={product.reviewCount ?? 0}
                emptyText={noReviewsText}
                ariaLabel={(product.reviewCount ?? 0) > 0 ? fill(ratingAriaLabel, { n: (product.averageRating ?? 0).toFixed(1).replace(".", ",") }) : undefined}
              />
              {reviewsLinkText && (
                <a className={cx("pdp__rating-link", TEXT.uiSm)} href="#product-reviews">
                  {reviewsLinkText}
                </a>
              )}
            </div>
          )}

          <div className="pdp__price">
            {tierPriceActive ? (
              <>
                <span className={cx("pdp__price-value", TEXT.priceLg, "tabular")}>
                  {fill(tierUnitPriceText, { price: money(quantityUnit) })}
                </span>
                <s className={cx("pdp__price-compare", TEXT.priceLg, "tabular")}>{price.price}</s>
              </>
            ) : (
              <>
                <span className={cx("pdp__price-value", TEXT.priceLg, "tabular")}>{price.price}</span>
                {price.compare && <s className={cx("pdp__price-compare", TEXT.priceLg, "tabular")}>{price.compare}</s>}
              </>
            )}
          </div>

          {campaignTitle && tiers.length === 0 && (
            <div className="pdp__campaign">
              <Icon name="tag" size={16} className="pdp__campaign-icon" />
              <span className={TEXT.uiSm}>{campaignTitle}</span>
            </div>
          )}

          {tierCards.length > 0 && (
            <div className="pdp__tiers">
              {/* tier cards (gDR5Y): native radios, a card per tier minimum (+ a single-unit card when the first tier starts above 1) */}
              <fieldset className="pdp__tier-set">
                {tiersTitle && <legend className={cx("pdp__block-title", "pdp__tier-legend", TEXT.label)}>{tiersTitle}</legend>}
                {tierCards.map((c, i) => {
                  const on = i === selectedCard;
                  return (
                    <label key={i} className={cx("pdp__tier", on && "pdp__tier--on")}>
                      <input
                        type="radio"
                        className="pdp__tier-input"
                        name={`pdp-tier-${product.id}`}
                        value={c.n}
                        checked={on}
                        onChange={() => setQuantity(clampQty(c.n))}
                      />
                      <span className="pdp__tier-dot" aria-hidden="true" />
                      <span className="pdp__tier-body">
                        <span className="pdp__tier-head">
                          <span className={cx("pdp__tier-qty", TEXT.ui, "tabular")}>{fill(tierCardQtyText, { n: c.n })}</span>
                          {(c.saving > 0 || i === bestIndex) && (
                            <span className="pdp__tier-badges">
                              {c.saving > 0 && tierSavingText && <Badge text={fill(tierSavingText, { n: c.saving })} tone="sale" />}
                              {i === bestIndex && tierBestText && <Badge text={tierBestText} tone="new" />}
                            </span>
                          )}
                        </span>
                        <span className={cx("pdp__tier-unit", TEXT.uiSm, "tabular")}>
                          {fill(tierUnitPriceText, { price: money(c.total / c.n) })}
                        </span>
                      </span>
                      <span className="pdp__tier-prices">
                        <span className={cx("pdp__tier-total", TEXT.price, "tabular")}>{money(c.total)}</span>
                        {money(c.compare) !== money(c.total) && (
                          <s className={cx("pdp__tier-compare", TEXT.priceSm, "tabular")}>{money(c.compare)}</s>
                        )}
                      </span>
                    </label>
                  );
                })}
              </fieldset>
              {customQty ? (
                <div ref={tierQtyRef} className="pdp__quantity">
                  <QuantitySelector
                    value={quantity}
                    min={limits.min}
                    max={limits.max}
                    onChange={setQuantity}
                    valueAriaLabel={quantityAriaLabel}
                    decreaseAriaLabel={decreaseAriaLabel}
                    increaseAriaLabel={increaseAriaLabel}
                  />
                </div>
              ) : (
                tierCustomQtyText && (
                  <button
                    type="button"
                    className={cx("pdp__tier-custom", TEXT.uiSm)}
                    aria-expanded="false"
                    onClick={() => setCustomQty(true)}
                  >
                    {tierCustomQtyText}
                    <Icon name="chevron-down" size={16} />
                  </button>
                )
              )}
            </div>
          )}

          {groups.map((g, gi) => {
            const current = g.items.find((it) => it.isSelected);
            return (
              <div key={g.name || gi} className="pdp__group">
                <span className={cx("pdp__block-title", TEXT.label)}>
                  {gi === 0 && groupLabel ? groupLabel : `${upperTr(g.name)} ·`} {upperTr(current?.value)}
                </span>
                <div className="pdp__group-row">
                  {g.items.map((it) => (
                    <a
                      key={it.href}
                      href={it.href}
                      className={cx("pdp__group-item", it.isSelected && "pdp__group-item--on")}
                      aria-label={it.value}
                      title={it.value}
                      aria-current={it.isSelected ? "page" : undefined}
                    >
                      {it.image ? (
                        <img src={getThumbnailSrc(it.image)} alt="" loading="lazy" decoding="async" />
                      ) : (
                        <span className={TEXT.badge}>{it.value}</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}

          {/* I-PDP-03 · M-28 via VariantChip / VariantSwatch */}
          <VariantPicker
            product={product}
            sizeGuideText={sizeGuideText}
            sizeGuideHref={sizeGuideLink?.href}
            onSizeGuide={hasSizeGuide ? () => setSizeGuideOpen(true) : undefined}
          />

          <div ref={optionsRef} className="pdp__options-anchor">
            <ProductOptions product={product} showError={showOptionErrors} texts={optionTexts} />
          </div>

          {bundle.length > 0 && (
            <div className="pdp__bundle">
              <span className={cx("pdp__block-title", TEXT.label)}>
                {bundleTitle} {fill(bundleCountText, { n: bundle.length })}
              </span>
              {bundle.map((bp) => (
                <BundleItem
                  key={bp.id}
                  bundleProduct={bp}
                  outOfStockText={offerSoldOutText}
                  includedText={bundleIncludedText}
                  decreaseAriaLabel={decreaseAriaLabel}
                  increaseAriaLabel={increaseAriaLabel}
                />
              ))}
            </div>
          )}

          {tierCards.length === 0 && (
            <div className="pdp__quantity">
              <QuantitySelector
                value={quantity}
                min={limits.min}
                max={limits.max}
                onChange={setQuantity}
                valueAriaLabel={quantityAriaLabel}
                decreaseAriaLabel={decreaseAriaLabel}
                increaseAriaLabel={increaseAriaLabel}
              />
            </div>
          )}

          {/* I-PDP-04 · M-11 via Button */}
          <div className="pdp__actions">
            <Button label={mainButtonLabel} state={buttonState} fullWidth className="pdp__cart-btn" onClick={onAdd} />
            <span className="pdp__fav">
              <FavoriteButton active={isFavorite} ariaLabel={favoriteAriaLabel} size="md" onToggle={onFavorite} />
            </span>
          </div>
          {cart.error && addToCartErrorText && (
            <p className={cx("pdp__error", TEXT.uiSm)} role="alert">
              {addToCartErrorText}
            </p>
          )}

          {showPayWithIkas && mounted && !soldOut && canPayWithIkas() && (
            <div className="pdp__pay">
              <PayWithIkas product={product} quantity={quantity} />
            </div>
          )}

          {bisEnabled && (
            <div className="pdp__bis">
              {backInStockTitle && <p className={cx("pdp__bis-title", TEXT.ui)}>{backInStockTitle}</p>}
              {bisStatus === "saved" ? (
                <p className={cx("pdp__bis-success", TEXT.uiSm)} role="status">
                  <Icon name="circle-check" size={16} className="pdp__bis-icon" />
                  {backInStockSuccessText}
                </p>
              ) : bisNeedsLogin ? (
                <div className="pdp__bis-login">
                  <span className={TEXT.uiSm}>{backInStockLoginText}</span>
                  <ArrowLink label={backInStockLoginLinkText} onClick={() => Router.navigateToPage("LOGIN")} />
                </div>
              ) : (
                <form className="pdp__bis-form" onSubmit={onBackInStock as any} noValidate>
                  <FormField
                    className="pdp__bis-field"
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    ariaLabel={backInStockPlaceholder}
                    placeholder={backInStockPlaceholder}
                    value={bisEmail || customerStore.customer?.email || ""}
                    error={bisStatus === "error" ? backInStockErrorText : null}
                    onInput={(v) => {
                      setBisEmail(v);
                      if (bisStatus === "error") setBisStatus("idle");
                    }}
                  />
                  <Button
                    type="submit"
                    className="pdp__bis-btn"
                    label={bisStatus === "sending" ? backInStockSendingText : backInStockButtonText}
                    state={bisStatus === "sending" ? "loading" : "idle"}
                  />
                </form>
              )}
            </div>
          )}

          {stockNote && (
            <p className={cx("pdp__stock", `pdp__stock--${stockNote.tone}`, TEXT.label)}>
              <span className="pdp__stock-dot" aria-hidden="true" />
              {stockNote.text}
            </p>
          )}

          {stores.length > 0 && (
            <div className="pdp__stores">
              {stockLocationsTitle && <span className={cx("pdp__block-title", TEXT.label)}>{stockLocationsTitle}</span>}
              {stores.map((s) => {
                const last = s.stockCount <= 1;
                return (
                  <div key={s.stockLocation.id} className="pdp__store">
                    <span className={TEXT.uiSm}>{s.stockLocation.name}</span>
                    <span className={cx("pdp__store-count", last && "pdp__store-count--last", TEXT.label, "tabular")}>
                      <span className="pdp__stock-dot" aria-hidden="true" />
                      {fill(last ? stockLastText : stockCountText, { n: s.stockCount })}
                    </span>
                  </div>
                );
              })}
              {pickupText && <p className={cx("pdp__pickup", TEXT.uiSm)}>{pickupText}</p>}
            </div>
          )}

          {offers.length > 0 && (
            <div className="pdp__offers">
              {(product.appliedCampaignOffer?.title || product.appliedCampaignOffer?.description) && (
                <div className="pdp__offers-head">
                  {product.appliedCampaignOffer?.title && <h2 className={cx("pdp__offers-title", TEXT.h4)}>{product.appliedCampaignOffer.title}</h2>}
                  {product.appliedCampaignOffer?.description && (
                    <p className={cx("pdp__offers-text", TEXT.uiSm)}>{product.appliedCampaignOffer.description}</p>
                  )}
                </div>
              )}
              {/* I-PDP-06 · M-28 via OfferCard */}
              <div className="pdp__offers-list">
                {offers.map((offer) => (
                  <OfferCard
                    key={offer.campaignOfferProductId}
                    offer={offer}
                    offerInCartText={offerInCartText}
                    soldOutText={offerSoldOutText}
                    variantAriaLabel={offerVariantAriaLabel}
                  />
                ))}
              </div>
              <div className="pdp__offers-summary">
                <div className="pdp__offers-total-row">
                  <div className="pdp__offers-total">
                    {offersCompare && <s className={cx("pdp__offers-compare", TEXT.priceSm, "tabular")}>{offersCompare}</s>}
                    <span className={cx("pdp__offers-total-value", TEXT.priceLg, "tabular")}>{offersTotal}</span>
                  </div>
                  {offersSaving > 0 && offersSavingText && (
                    <span className={cx("pdp__offers-saving", TEXT.badge, "tabular")}>
                      {fill(offersSavingText, { amount: formatCurrency(offersSaving, currency.currency ?? "", currency.currencySymbol ?? null) })}
                    </span>
                  )}
                </div>
                {/* I-PDP-07 · M-11 via Button */}
                <Button
                  label={fill(offersAddText, { n: 1 + selectedOffers })}
                  state={soldOut ? "soldout" : cart.busy ? "loading" : "idle"}
                  fullWidth
                  onClick={onAdd}
                />
              </div>
            </div>
          )}

          {highlightList.length > 0 && (
            <div className="pdp__highlights">
              <IkasComponentRenderer id="pdp-highlights" className="pdp__highlights-list" components={highlightList} parentProps={props} />
            </div>
          )}

          {/* I-PDP-05 · M-22 via AccordionItem */}
          <div className="pdp__accordions">
            {product.description && <AccordionItem title={descriptionTitle} body={product.description} defaultOpen headingLevel={2} />}
            {shippingText && <AccordionItem title={shippingTitle} body={shippingText} headingLevel={2} />}
            {careText && <AccordionItem title={careTitle} body={careText} headingLevel={2} />}
          </div>
        </div>
      </div>

      {/* mobile sticky buy bar — same button state as the main CTA */}
      <div className="pdp__buybar">
        <div className="pdp__buybar-info">
          <span className={cx("pdp__buybar-title", TEXT.uiSm)}>{product.name}</span>
          <span className={cx("pdp__buybar-price", TEXT.price, "tabular")}>{price.price}</span>
        </div>
        <Button label={buttonLabel} state={buttonState} fullWidth className="pdp__buybar-btn" onClick={onAdd} />
      </div>

      {/* I/Overlay/SizeGuide · M-20 */}
      {hasSizeGuide && (
        <SizeGuide
          open={sizeGuideOpen}
          onClose={() => setSizeGuideOpen(false)}
          table={sizeTable}
          fallbackHtml={sizeGuideHtml}
          selectedSize={selectedSize}
          texts={{ title: sizeGuideTitle, note: sizeGuideNote, closeAriaLabel, howToMeasureTitle, howToMeasureText }}
        />
      )}

      <ImagePreview
        open={preview !== null}
        images={media}
        index={preview ?? 0}
        altText={product.name}
        onClose={() => setPreview(null)}
        closeAriaLabel={closeAriaLabel}
        prevAriaLabel={prevAriaLabel}
        nextAriaLabel={nextAriaLabel}
        zoomAriaLabel={zoomAriaLabel}
        videoTexts={videoTexts}
      />
    </section>
  );
}

export default ProductDetail;
