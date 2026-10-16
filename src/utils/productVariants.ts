// Listing helpers for "split" products and variant-aware card links.
//
// A merchant can list a product's variants separately, grouped by one variant type (usually
// Renk): `product.groupVariantsByVariantTypeId`. The list API then returns the SAME product id
// once per value of that type, each copy with that value's variants first (so its
// `selectedVariantValues` start on that colour). Cards, keys and links must tell the copies apart.
import {
  IkasProduct,
  getProductHref,
  getProductOptionSet,
  getSelectedProductVariantHref,
  hasValidProductOptionSetValues,
} from "@ikas/bp-storefront";

/** True when the product is listed once per value of this variant type. */
export function isSplitByVariantType(product: IkasProduct, variantTypeId: string | null | undefined) {
  return !!variantTypeId && product.groupVariantsByVariantTypeId === variantTypeId;
}

/**
 * The value of the split type this listed copy stands for. Read from `variants[0]` (as ikas'
 * own `hasProductStock` does), not from the current selection, so it stays the same when the
 * shopper changes the colour in QuickBuy.
 */
export function getSplitVariantValueId(product: IkasProduct): string | null {
  const typeId = product.groupVariantsByVariantTypeId;
  if (!typeId) return null;
  return product.variants?.[0]?.variantValues.find((vv) => vv.variantTypeId === typeId)?.id ?? null;
}

/** List key that stays unique when a split product appears once per colour. */
export function productListKey(product: IkasProduct) {
  const valueId = getSplitVariantValueId(product);
  return valueId ? `${product.id}:${valueId}` : product.id;
}

/** Card / QuickBuy link: the selected variant travels in the query (?renk=…&beden=…). */
export function productCardHref(product: IkasProduct) {
  return getSelectedProductVariantHref(product) || getProductHref(product);
}

const optionSetRuns = new WeakMap<IkasProduct, Promise<boolean>>();

/**
 * Loads the option set (kişiselleştirme) that list data leaves out. Card and QuickBuy share one
 * request per product object; getProductOptionSet stores the set on the product. A failed load
 * is forgotten so the next ask retries.
 */
export function loadProductOptionSet(product: IkasProduct) {
  if (!product.productOptionSetId) return Promise.resolve(false);
  if (product.productOptionSet) return Promise.resolve(true);
  let run = optionSetRuns.get(product);
  if (!run) {
    run = getProductOptionSet(product)
      .catch(() => false)
      .then((ok) => {
        if (!ok) optionSetRuns.delete(product);
        return ok;
      });
    optionSetRuns.set(product, run);
  }
  return run;
}

/** Required personalisation still empty → the product can only be bought from its page. */
export function needsPersonalization(product: IkasProduct) {
  const set = product.productOptionSet;
  return !!set && !hasValidProductOptionSetValues(set);
}
