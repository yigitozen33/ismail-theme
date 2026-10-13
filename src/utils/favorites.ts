// Shared heart toggle for product cards, QuickBuy, ProductDetail and BestsellerTab.
import {
  IkasProduct,
  Router,
  addIkasProductToFavorites,
  customerStore,
  hasCustomer,
  isFavoriteIkasProduct,
  removeIkasProductFromFavorites,
  waitForCustomerStoreInit,
} from "@ikas/bp-storefront";

/**
 * Adds or removes the product (its selected variant's listing) from the favourites. Waits for the
 * customer store first, so a tap right after the page loads does not send a signed-in customer to
 * the login page. Returns "added" / "removed", or "login" when it redirected a guest.
 */
export async function toggleFavorite(product: IkasProduct): Promise<"added" | "removed" | "login"> {
  await waitForCustomerStoreInit(customerStore);
  if (!hasCustomer(customerStore)) {
    Router.navigateToPage("LOGIN");
    return "login";
  }
  if (isFavoriteIkasProduct(product)) {
    await removeIkasProductFromFavorites(product);
    return "removed";
  }
  await addIkasProductToFavorites(product);
  return "added";
}
