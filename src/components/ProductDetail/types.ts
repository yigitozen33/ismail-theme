// This file is auto-generated — do not edit manually.
import type { IkasProduct, IkasNavigationLink, IkasProductAttributeDetail } from "@ikas/bp-storefront";

export interface Props {
  /** Sayfada detayları gösterilecek ürün; ürün sayfasında otomatik olarak açılan ürüne bağlanır. */
  product?: IkasProduct | null;
  /** Sayfanın üstündeki yol satırında ilk sırada görünen ana sayfa bağlantısının metni. */
  homeText?: string;
  /** Sayfanın üstündeki yol (konum) satırının ekran okuyucu etiketi. */
  breadcrumbAriaLabel?: string;
  /** Ürün adının altında, varyantın ürün kodunun önünde görünen etiket. Ürün kodu yoksa satır gizlenir. */
  skuLabel?: string;
  /** Puan yıldızlarının yanında, sayfadaki değerlendirmeler bölümüne kaydıran bağlantının metni. Boşsa gizlenir. */
  reviewsLinkText?: string;
  /** Puan yıldızlarının ekran okuyucu etiketi; {n} yerine ürünün ortalama puanı yazılır. */
  ratingAriaLabel?: string;
  /** Stoku biten üründe ürün adının üstünde gösterilen rozetin metni. */
  soldOutBadgeText?: string;
  /** Kademeli indirimli üründe adet kartlarının üstünde görünen başlık. Boş bırakılırsa gizlenir. */
  tiersTitle?: string;
  /** Kademeli indirimde adet başına fiyat metni; {price} yerine birim fiyat yazılır. */
  tierUnitPriceText?: string;
  /** Ürün grubundaki ilk seçim satırının başında, seçili değerin önünde görünen etiket. */
  groupLabel?: string;
  /** Beden seçeneklerinin yanında beden rehberini açan bağlantının metni. Boşsa bağlantı gizlenir. */
  sizeGuideText?: string;
  /** Ana satın alma düğmesinin ve mobildeki sabit alt çubuğun düğmesinin varsayılan metni. */
  addToCartText?: string;
  /** Ürün sepete eklenirken satın alma düğmesinde kısa süre görünen metin. */
  addingText?: string;
  /** Ürün sepete eklendikten hemen sonra satın alma düğmesinde görünen onay metni. */
  addedText?: string;
  /** Seçili varyantın stoku bittiğinde satın alma düğmesinde görünen metin. */
  outOfStockText?: string;
  /** Ürün sepetten düzenlenmek üzere açıldığında satın alma düğmesinde görünen metin. */
  updateCartText?: string;
  /** Sepetteki ürün güncellenirken satın alma düğmesinde görünen metin. */
  updatingCartText?: string;
  /** Sepete ekleme başarısız olursa düğmenin altında gösterilen hata mesajı. Boşsa mesaj gösterilmez. */
  addToCartErrorText?: string;
  /** Satın alma düğmesinin yanındaki kalp (favori) düğmesinin ekran okuyucu etiketi. */
  favoriteAriaLabel?: string;
  /** Adet seçicide gösterilen sayının ekran okuyucu etiketi. */
  quantityAriaLabel?: string;
  /** Adet seçicideki ve set ürünlerindeki eksi (azalt) düğmesinin ekran okuyucu etiketi. */
  decreaseAriaLabel?: string;
  /** Adet seçicideki ve set ürünlerindeki artı (artır) düğmesinin ekran okuyucu etiketi. */
  increaseAriaLabel?: string;
  /** Ürünün kişiselleştirme seçenekleri (yazı, dosya, seçim vb.) varsa üstlerinde görünen başlık. */
  optionsTitle?: string;
  /** Zorunlu kişiselleştirme seçenekleri doldurulmadan sepete eklenmek istendiğinde gösterilen uyarı. */
  optionSetErrorText?: string;
  /** Zorunlu bir kişiselleştirme alanı boş bırakıldığında alanın altında gösterilen uyarı. */
  optionRequiredText?: string;
  /** Zorunlu olmayan kişiselleştirme seçeneklerinin adının yanına eklenen ek. */
  optionOptionalText?: string;
  /** Açılır liste tipindeki kişiselleştirme seçeneğinde henüz seçim yapılmadığında görünen metin. */
  optionSelectPlaceholder?: string;
  /** Çoklu seçimli seçeneklerde gösterilen sınır notu; {max} en fazla seçim, {count} yapılan seçim sayısıdır. */
  optionLimitText?: string;
  /** En az birden fazla seçim isteyen seçeneklerde gösterilen not; {min} yerine en az seçim sayısı yazılır. */
  optionMinText?: string;
  /** Dosya yükleme seçeneğinde, yükleme alanının içinde görünen yönlendirme metni. */
  fileUploadText?: string;
  /** Kişiselleştirme için seçilen dosya yüklenirken alanda görünen metin. */
  fileUploadingText?: string;
  /** Kişiselleştirme dosyası yüklenemediğinde gösterilen hata mesajı. */
  fileUploadErrorText?: string;
  /** Yüklenen kişiselleştirme dosyasını kaldıran düğmenin ekran okuyucu etiketi. */
  fileRemoveAriaLabel?: string;
  /** Set ürünlerde, setteki ürün listesinin üstünde görünen başlık. */
  bundleTitle?: string;
  /** Set içeriği başlığının yanındaki parça sayısı; {n} yerine setteki ürün sayısı yazılır. */
  bundleCountText?: string;
  /** Set içindeki, adedi değiştirilemeyen ürünlerin yanında görünen not. */
  bundleIncludedText?: string;
  /** Birlikte al teklifindeki ürün zaten sepetteyse teklif kartında görünen etiket. */
  offerInCartText?: string;
  /** Birlikte al teklifinde veya set içinde stoku biten ürünün kartında görünen etiket. */
  offerSoldOutText?: string;
  /** Birlikte al teklif kartındaki varyant seçim listesinin ekran okuyucu etiketi. */
  offerVariantAriaLabel?: string;
  /** Birlikte al tekliflerinin altındaki düğmenin metni; {n} yerine sepete eklenecek ürün sayısı yazılır. */
  offersAddText?: string;
  /** Birlikte al tekliflerinde toplam fiyatın yanındaki kazanç rozeti; {amount} yerine indirim tutarı yazılır. */
  offersSavingText?: string;
  /** Stok, az stok eşiğinin altına indiğinde düğmenin altında görünen not; {n} kalan adettir. Boşsa gizlenir. */
  lowStockText?: string;
  /** Ürün stokta ve stoku az değilken düğmenin altında görünen not. Boş bırakılırsa gösterilmez. */
  inStockText?: string;
  /** Seçili varyantın stoku bittiğinde düğmenin altında görünen stok notu. Boşsa gizlenir. */
  outOfStockNoteText?: string;
  /** Stoku biten varyantta, gelince haber ver formunun üstünde görünen başlık. Boşsa gizlenir. */
  backInStockTitle?: string;
  /** Gelince haber ver formundaki e-posta alanının içinde görünen ipucu metni. */
  backInStockPlaceholder?: string;
  /** Gelince haber ver formunda e-posta adresini kaydeden düğmenin metni. */
  backInStockButtonText?: string;
  /** Gelince haber ver isteği kaydedilirken düğmede görünen metin. */
  backInStockSendingText?: string;
  /** Gelince haber ver isteği kaydedildikten sonra formun yerine gösterilen onay mesajı. */
  backInStockSuccessText?: string;
  /** Gelince haber ver formunda geçersiz e-posta girildiğinde veya kayıt başarısız olduğunda gösterilen uyarı. */
  backInStockErrorText?: string;
  /** Hatırlatma için üyelik gerekiyorsa, giriş yapmamış ziyaretçiye formun yerine gösterilen metin. */
  backInStockLoginText?: string;
  /** Gelince haber ver için giriş gerektiğinde ziyaretçiyi giriş sayfasına götüren bağlantının metni. */
  backInStockLoginLinkText?: string;
  /** Ürünün mağazalardaki stok listesinin üstünde görünen başlık. Boşsa gizlenir. */
  stockLocationsTitle?: string;
  /** Mağaza stok listesinde her mağazanın yanındaki adet; {n} yerine o mağazadaki stok sayısı yazılır. */
  stockCountText?: string;
  /** Mağazada tek ürün kaldığında adet yerine gösterilen not; {n} yerine kalan adet yazılır. */
  stockLastText?: string;
  /** Mağaza stok listesinin altında görünen mağazadan teslim notu. Boş bırakılırsa gizlenir. */
  pickupText?: string;
  /** Ürün açıklamasını gösteren, varsayılan olarak açık gelen akordiyonun başlığı. */
  descriptionTitle?: string;
  /** Kargo ve iade bilgisini gösteren akordiyonun başlığı. */
  shippingTitle?: string;
  /** Malzeme ve bakım bilgisini gösteren akordiyonun başlığı. */
  careTitle?: string;
  /** Kargo ve iade akordiyonunda tüm ürünler için gösterilen metin. Boş bırakılırsa akordiyon gizlenir. */
  shippingText?: string;
  /** Büyütülmüş görsel önizlemesini ve beden rehberini kapatan düğmenin ekran okuyucu etiketi. */
  closeAriaLabel?: string;
  /** Görsel önizlemesindeki önceki görsel okunun ekran okuyucu etiketi. */
  prevAriaLabel?: string;
  /** Görsel önizlemesindeki sonraki görsel okunun ekran okuyucu etiketi. */
  nextAriaLabel?: string;
  /** Ürün görseline tıklayınca açılan büyütme düğmesinin ekran okuyucu etiketi; sonuna görsel sırası eklenir. */
  zoomAriaLabel?: string;
  /** Galerideki ürün videosunun oynat düğmesinin ekran okuyucu etiketi. */
  playVideoAriaLabel?: string;
  /** Galerideki küçük görsellerin ve mobil noktaların ekran okuyucu etiketi; {n} görselin sırasıdır. */
  galleryDotAriaLabel?: string;
  /** Ürüne özel ya da genel beden tablosu yoksa beden rehberi bağlantısının açacağı sayfa. */
  sizeGuideLink?: IkasNavigationLink | null;
  /** Açıkken, satın alma düğmesinin altında hızlı ödeme düğmesi gösterilir; ürün tükendiğinde görünmez. */
  showPayWithIkas?: boolean;
  /** Açıkken, birlikte al teklifindeki ürünler sayfa açıldığında seçili gelir ve ana ürünle birlikte eklenir. */
  preselectOffers?: boolean;
  /** Stok bu sayıya veya altına indiğinde az stok notu gösterilir. */
  lowStockThreshold?: number;
  /** Ürün bilgilerinin altında, akordiyonlardan önce sıralanan hizmet öğeleri (kargo, iade vb.). Boşsa gizlenir. */
  highlights?: any;
  /** Ürün detay bölümünün arka plan rengi. Boş bırakılırsa temanın varsayılan rengi kullanılır. */
  backgroundColor?: string;
  /** Henüz yorumu olmayan üründe boş yıldızların yanında gösterilen metin. */
  noReviewsText?: string;
  /** Ürüne özel malzeme ve bakım metnini tutan özel alan; doluysa genel metnin yerine gösterilir. */
  careAttribute?: IkasProductAttributeDetail | null;
  /** Ürünün kendi malzeme ve bakım alanı boşsa akordiyonda gösterilen genel metin. */
  careText?: string;
  /** Tablo tipindeki ürün özel alanı. İlk sütun bedendir; seçili bedenin satırı vurgulanır. */
  sizeGuideAttribute?: IkasProductAttributeDetail | null;
  /** Ürünün beden tablosu yoksa çekmecede bu metin gösterilir. */
  sizeGuideFallbackText?: string;
  /** Beden rehberi açılır penceresinin en üstünde görünen başlık. */
  sizeGuideTitle?: string;
  /** Beden rehberi penceresinde başlığın altında görünen kısa açıklama notu. */
  sizeGuideNote?: string;
  /** Beden rehberi penceresinde ölçü alma talimatlarının üstünde görünen başlık. */
  howToMeasureTitle?: string;
  /** Beden rehberi penceresinde gösterilen, ölçülerin nasıl alınacağını anlatan metin. */
  howToMeasureText?: string;
  /** Beden tablosunda satır başlıklarının (bedenlerin) sütun başlığı. */
  sizeColumnLabel?: string;
  /** Mobil galeride 5'ten fazla görsel varken noktaların yerine görünen sayaç; {current} sıradaki, {total} toplam görsel. */
  galleryCounterText?: string;
  /** Kademeli indirim kartlarındaki adet metni; {n} yerine kartın adedi yazılır. */
  tierCardQtyText?: string;
  /** Kademeli indirim kartındaki tasarruf rozeti; {n} yerine indirim yüzdesi yazılır. Boşsa gizlenir. */
  tierSavingText?: string;
  /** En yüksek tasarrufu sağlayan kademe kartında görünen rozet. Boşsa gizlenir. */
  tierBestText?: string;
  /** Kademe kartlarının altında, adet seçiciyi açan bağlantının metni. Boşsa gizlenir. */
  tierCustomQtyText?: string;
  /** Kademeli indirimde satın alma düğmesinin metni; {n} seçilen adet, {total} toplam tutardır. */
  tierAddText?: string;
  /** Ürün videosundaki durdur düğmesinin ekran okuyucu etiketi. */
  videoPauseAriaLabel?: string;
  /** Ürün videosundaki sesi kapatma düğmesinin ekran okuyucu etiketi. */
  videoMuteAriaLabel?: string;
  /** Ürün videosundaki sesi açma düğmesinin ekran okuyucu etiketi. */
  videoUnmuteAriaLabel?: string;
  /** Ürün videosundaki tam ekran düğmesinin ekran okuyucu etiketi. */
  videoFullscreenAriaLabel?: string;
  /** Ürün videosundaki ilerleme çubuğunun ekran okuyucu etiketi. */
  videoSeekAriaLabel?: string;
}
