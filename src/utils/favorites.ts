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
 * the login page. The action follows the heart as it was drawn at the tap: favourites can finish
 * loading during the wait, and an empty heart must still add rather than remove.
 * Returns "added" / "removed", or "login" when it redirected a guest.
 */
export async function toggleFavorite(product: IkasProduct): Promise<"added" | "removed" | "login"> {
  const add = !isFavoriteIkasProduct(product);
  await waitForCustomerStoreInit(customerStore);
  if (!hasCustomer(customerStore)) {
    Router.navigateToPage("LOGIN");
    return "login";
  }
  const isFavorite = isFavoriteIkasProduct(product);
  if (add) {
    if (!isFavorite) await addIkasProductToFavorites(product);
    return "added";
  }
  if (isFavorite) await removeIkasProductFromFavorites(product);
  return "removed";
}
