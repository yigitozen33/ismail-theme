// This file is auto-generated — do not edit manually.
import type { IkasProductList, IkasNavigationLink } from "@ikas/bp-storefront";

export interface Props {
  /** Sepet sayfasının en üstünde görünen ana başlık. */
  title?: string;
  /** Başlığın yanında görünen ürün sayısı; {count} yerine sepetteki toplam adet yazılır. Boş bırakılırsa gizlenir. */
  itemCountText?: string;
  /** Sepet boşken simgenin altında görünen başlık. Boş bırakılırsa gizlenir. */
  emptyTitle?: string;
  /** Sepet boşken başlığın altında görünen kısa açıklama. Boş bırakılırsa gizlenir. */
  emptyText?: string;
  /** Sepet boşken alışverişe yönlendiren düğmenin metni. Boş bırakılırsa düğme gizlenir. */
  emptyButtonText?: string;
  /** Sepet yüklenirken ekran okuyucular için okunan metin; sayfada görünmez. */
  loadingText?: string;
  /** Her sepet satırında ürünü sepetten çıkaran bağlantının metni. Boş bırakılırsa gizlenir. */
  removeText?: string;
  /** Kişiselleştirilmiş ürün satırlarında seçimleri yeniden düzenleten bağlantının metni. Boş bırakılırsa gizlenir. */
  editText?: string;
  /** Ürün adedi stok veya satış sınırına ulaştığında satırda görünen uyarı; {max} yerine izin verilen adet yazılır. */
  maxQuantityText?: string;
  /** Hediye olarak eklenen ürün satırlarında görünen rozet metni. Boş bırakılırsa rozet gizlenir. */
  giftText?: string;
  /** Set ürün satırlarında varyant yerine görünen bilgi; {count} yerine setteki parça sayısı yazılır. */
  bundlePartsText?: string;
  /** Sepet satırındaki adet azaltma düğmesinin ekran okuyucu etiketi. */
  decreaseAriaLabel?: string;
  /** Sepet satırındaki adet artırma düğmesinin ekran okuyucu etiketi. */
  increaseAriaLabel?: string;
  /** Sağdaki sipariş özeti kutusunun başlığı. Boş bırakılırsa gizlenir. */
  summaryTitle?: string;
  /** Sipariş özetindeki indirim kodu alanının üstünde görünen etiket. */
  couponLabel?: string;
  /** İndirim kodu alanı boşken içinde görünen yönlendirici metin. */
  couponPlaceholder?: string;
  /** Girilen indirim kodunu sepete uygulayan düğmenin metni. */
  couponButtonText?: string;
  /** İndirim kodu kontrol edilirken uygula düğmesinde görünen metin. */
  couponApplyingText?: string;
  /** Girilen indirim kodu geçersiz olduğunda alanın altında gösterilen hata mesajı. */
  couponErrorText?: string;
  /** İndirim kodu başarıyla uygulandığında alanın altında gösterilen mesaj. */
  couponSuccessText?: string;
  /** Uygulanmış indirim kodunu sepetten kaldıran bağlantının metni. Boş bırakılırsa gizlenir. */
  couponRemoveText?: string;
  /** Sipariş özetinde indirimler ve kargo öncesi ara toplam satırının etiketi. */
  subtotalLabel?: string;
  /** Sipariş özetinde kargo ücreti satırının etiketi. */
  shippingLabel?: string;
  /** Kargo ücretsiz olduğunda kargo satırında tutar yerine görünen metin. */
  shippingFreeText?: string;
  /** Kargo ücreti henüz hesaplanmamışsa kargo satırında tutar yerine görünen metin. */
  shippingPendingText?: string;
  /** Sepete hediye çeki uygulandığında sipariş özetinde görünen satırın etiketi. */
  giftCardText?: string;
  /** Sipariş özetinde ödenecek genel toplam satırının etiketi. */
  totalLabel?: string;
  /** Sipariş özetinde müşteriyi ödeme sayfasına götüren düğmenin metni. */
  checkoutText?: string;
  /** Ödeme sayfasına yönlendirme sürerken ödeme düğmesinde görünen metin. */
  checkoutLoadingText?: string;
  /** Sipariş özetinin en altında küçük harflerle görünen güven notu. Boş bırakılırsa gizlenir. */
  summaryNote?: string;
  /** Sepetin altındaki önerilen ürünler alanının başlığı. Boş bırakılırsa gizlenir. */
  recommendTitle?: string;
  /** Sepetin altında öneri olarak gösterilecek ürünler; en fazla 4 ürün görünür. Boş bırakılırsa alan gizlenir. */
  recommendProducts?: IkasProductList;
  /** Sepet boşken görünen düğmenin gideceği sayfa. Boş bırakılırsa ana sayfaya yönlendirir. */
  emptyButtonLink?: IkasNavigationLink | null;
  /** Sepet sayfası bölümünün arka plan rengi. Boş bırakılırsa temanın varsayılan arka planı kullanılır. */
  backgroundColor?: string;
}
