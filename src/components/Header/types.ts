// This file is auto-generated — do not edit manually.
import type { IkasNavigationLink, IkasNavigationLinkList, IkasImage, IkasProductList } from "@ikas/bp-storefront";

export interface Props {
  /** Başlık çubuğunda ve mobil menü panelinde görünen SVG logo; boş bırakılırsa yerine alternatif metin yazılır. */
  logo?: string;
  /** Logonun ekran okuyucu etiketi; SVG logo yüklenmemişse başlıkta bu metin logo olarak gösterilir. */
  logoAltText?: string;
  /** Açıkken logo, başlığın metin rengine boyanır ve şeffaf ya da koyu zeminde otomatik uyum sağlar. */
  logoMonochrome?: boolean;
  /** Başlığın üstündeki duyuru bandını açar veya kapatır; kapalıyken duyurular ve geri sayım gösterilmez. */
  showAnnouncement?: boolean;
  /** Başlığın hemen altında hero bölümü varsa başlık şeffaf görünür, sayfa kaydırılınca opaklaşır. */
  transparentOnHero?: boolean;
  /** Açıkken başlık çubuğu sayfa kaydırıldığında ekranın üstüne sabitlenir. */
  stickyEnabled?: boolean;
  /** Duyuru bandındaki geri sayımın biteceği tarih ve saat; boşsa veya birden fazla duyuru varsa sayaç gizlenir. */
  countdownTarget?: Date | string;
  /** Birden fazla duyuru eklendiğinde her duyurunun ekranda kalma süresi (saniye, en az 2). */
  announcementInterval?: number;
  /** Duyuru bileşeni eklenmediğinde bantta gösterilen tek satırlık duyuru metni. */
  announcementText?: string;
  /** Geri sayımın ekran okuyucu etiketi; {time} yerine kalan süre yazılır. */
  countdownAriaLabel?: string;
  /** Duyuru bandındaki önceki duyuru okunun ekran okuyucu etiketi. */
  announcementPrevAriaLabel?: string;
  /** Duyuru bandındaki sonraki duyuru okunun ekran okuyucu etiketi. */
  announcementNextAriaLabel?: string;
  /** Başlıktaki arama düğmesinin yanında görünen yazı; aynı zamanda düğmenin ekran okuyucu etiketidir. */
  searchLabel?: string;
  /** Başlıktaki sepet düğmesinin yazısı; ekran okuyucuda ürün adediyle birlikte okunur. */
  cartLabel?: string;
  /** Ziyaretçi giriş yapmamışken başlıktaki hesap düğmesinde görünen yazı. */
  accountLabel?: string;
  /** Mobil menü düğmesinin ve ana gezinme menüsünün ekran okuyucu etiketi. */
  menuAriaLabel?: string;
  /** Menü, arama, sepet, hızlı satın al ve çerez panellerindeki kapat düğmesinin ekran okuyucu etiketi. */
  closeAriaLabel?: string;
  /** Megamenünün sağındaki öne çıkan kartın başlığı; görsel ve başlık boşsa kart gizlenir. */
  menuFeatureTitle?: string;
  /** Megamenüdeki öne çıkan kartın altındaki bağlantı yazısı; bağlantı seçilmemişse gösterilmez. */
  menuFeatureLinkText?: string;
  /** Mobil menü panelinde, giriş yapmamış ziyaretçilere gösterilen giriş yap bağlantısının yazısı. */
  loginText?: string;
  /** Mobil menü panelinde, giriş yapmamış ziyaretçilere gösterilen kayıt ol bağlantısının yazısı. */
  registerText?: string;
  /** Mobil menü panelinde, giriş yapmış üyeye gösterilen çıkış yap bağlantısının yazısı. */
  logoutText?: string;
  /** Mobil menüde giriş yapmış üyeye gösterilen selamlama; {name} yerine üyenin adı yazılır. */
  menuGreetingText?: string;
  /** Giriş yapmış üyeye başlıkta ve mobil menüde gösterilen hesap bağlantısının yazısı. */
  menuAccountLabel?: string;
  /** Mobil menü panelinin altındaki favori ürünler bağlantısının yazısı. */
  favoritesLabel?: string;
  /** Mobil menünün altında görünen dil ve para birimi yazısı; başka dil varsa tıklanınca seçici açılır. */
  localeText?: string;
  /** Arama panelindeki arama kutusunda, masaüstünde görünen yönlendirici ipucu metni. */
  searchPlaceholder?: string;
  /** Arama panelinde, arama önerilerinin üstünde görünen başlık; boş bırakılırsa gizlenir. */
  searchEmptyTitle?: string;
  /** Arama panelinde bulunan sonuç sayısını gösteren metin; {count} yerine sonuç adedi yazılır. */
  searchResultCountText?: string;
  /** Aramada hiçbir ürün bulunamadığında arama panelinde gösterilen başlık. */
  searchNoResultText?: string;
  /** Arama sonuçsuz kaldığında başlığın altında gösterilen yönlendirici açıklama. */
  searchNoResultHint?: string;
  /** Arama panelinin altındaki, tüm sonuçları arama sayfasında açan bağlantının yazısı. */
  searchAllResultsText?: string;
  /** Sağdan açılan sepet panelinin en üstündeki başlık. */
  cartTitleText?: string;
  /** Sepet paneli boşken gösterilen başlık. */
  cartEmptyTitle?: string;
  /** Sepet paneli boşken başlığın altında görünen kısa açıklama. */
  cartEmptyText?: string;
  /** Sepet paneli boşken alışverişe yönlendiren düğmenin yazısı. */
  cartEmptyButtonText?: string;
  /** Sepet panelindeki önerilen ürünler alanının başlığı; boş bırakılırsa gizlenir. */
  drawerRecommendTitle?: string;
  /** Sepet panelinde indirim kodu alanını açan bağlantının yazısı. */
  couponToggleText?: string;
  /** Sepet panelindeki indirim kodu kutusunda görünen ipucu metni. */
  couponPlaceholder?: string;
  /** Sepet panelinde indirim kodunu uygulayan düğmenin yazısı. */
  couponButtonText?: string;
  /** Girilen indirim kodu geçersiz olduğunda sepet panelinde gösterilen hata mesajı. */
  couponErrorText?: string;
  /** İndirim kodu uygulandığında gösterilen bilgi; {code} yerine uygulanan kod yazılır. */
  couponAppliedText?: string;
  /** Uygulanmış indirim kodunu sepetten kaldıran bağlantının yazısı. */
  couponRemoveText?: string;
  /** Sepet panelinin altında ara toplam tutarının yanında görünen etiket. */
  cartSubtotalLabel?: string;
  /** Sepet panelinde ara toplamın altında görünen kargo notu; boş bırakılırsa gizlenir. */
  cartShippingNote?: string;
  /** Sepet panelinde ödeme sayfasına geçiren ana düğmenin yazısı. */
  checkoutButtonText?: string;
  /** Ödeme düğmesine basıldıktan sonra yönlendirme sürerken düğmede görünen yazı. */
  checkoutLoadingText?: string;
  /** Sepet panelinde sepet sayfasına götüren ikincil düğmenin yazısı. */
  cartViewButtonText?: string;
  /** Sepet panelindeki ürün satırında ürün seçeneklerini düzenleme bağlantısının yazısı; boşsa gizlenir. */
  editText?: string;
  /** Sepet panelindeki ürün satırında ürünü sepetten çıkaran bağlantının yazısı. */
  removeText?: string;
  /** Ürün adedi stok veya satış sınırına ulaştığında gösterilen uyarı; {max} yerine üst sınır yazılır. */
  maxQuantityText?: string;
  /** Sepet panelinde hediye olarak eklenen ürünlerin üzerinde görünen rozet yazısı. */
  giftText?: string;
  /** Sepet panelindeki adet azaltma düğmesinin ekran okuyucu etiketi. */
  decreaseAriaLabel?: string;
  /** Sepet panelindeki adet artırma düğmesinin ekran okuyucu etiketi. */
  increaseAriaLabel?: string;
  /** Sepetteki set ürünlerde parça sayısını gösteren metin; {count} yerine parça adedi yazılır. */
  bundlePartsText?: string;
  /** Sayfanın altında çıkan çerez bildirimi metni; boş bırakılırsa çerez bandı hiç gösterilmez. */
  cookieContent?: string;
  /** Çerez bandındaki, bildirimi kabul edip kapatan düğmenin yazısı. */
  cookieAcceptText?: string;
  /** Tek satırlık duyuru metnine tıklandığında açılacak sayfa; boşsa metin tıklanamaz. */
  announcementLink?: IkasNavigationLink | null;
  /** Başlıktaki ana menü bağlantıları; alt bağlantı eklenen öğeler açılır menü olarak gösterilir. */
  navLinks?: IkasNavigationLinkList;
  /** Megamenüdeki öne çıkan kartın görseline ve bağlantı yazısına tıklandığında açılacak sayfa. */
  menuFeatureLink?: IkasNavigationLink | null;
  /** Arama paneli açıldığında hızlı seçim olarak gösterilen öneri bağlantıları; boşsa alan gizlenir. */
  searchSuggestions?: IkasNavigationLinkList;
  /** Megamenünün sağındaki öne çıkan kartta görünen görsel; boş bırakılırsa yalnızca başlık gösterilir. */
  menuFeatureImage?: IkasImage | null;
  /** Sepet panelinde önerilen ürünler; sepette zaten olanlar hariç en fazla 2 ürün gösterilir. */
  drawerRecommendProducts?: IkasProductList;
  /** Duyuru bandında sırayla dönen duyurular; birden fazla eklenirse oklar ve sayaç çıkar. */
  announcements?: any;
  /** Ana menünün ilk öğesinin üzerine gelince açılan megamenüdeki bağlantı sütunları. */
  megamenuColumns?: any;
  /** Başlık çubuğunun arka plan rengi; boş bırakılırsa temanın renk şeması kullanılır. */
  backgroundColor?: string;
  /** Hızlı satın al panelinde seçenek seçilmeden sepete eklenmek istendiğinde gösterilen uyarı. */
  qbChooseOptionText?: string;
  /** Hızlı satın al panelindeki sepete ekle düğmesinin yazısı. */
  qbAddText?: string;
  /** Hızlı satın al panelinde ürün sepete eklenirken düğmede görünen yazı. */
  qbAddingText?: string;
  /** Hızlı satın al panelinde ürün sepete eklendiğinde düğmede kısa süre görünen yazı. */
  qbAddedText?: string;
  /** Hızlı satın al panelinde seçilen ürün tükendiğinde düğmede görünen yazı. */
  qbSoldOutText?: string;
  /** Hızlı satın al panelinde ürün sepete eklenemediğinde gösterilen hata mesajı. */
  qbAddErrorText?: string;
  /** Hızlı satın al panelinde ürün sayfasına götüren bağlantının yazısı. */
  qbDetailLinkText?: string;
  /** Hızlı satın al panelinde stok azaldığında görünen uyarı; {n} yerine kalan adet yazılır. */
  qbLowStockText?: string;
  /** Hızlı satın al panelindeki önceki görsel okunun ekran okuyucu etiketi. */
  qbPrevAriaLabel?: string;
  /** Hızlı satın al panelindeki sonraki görsel okunun ekran okuyucu etiketi. */
  qbNextAriaLabel?: string;
  /** Hızlı satın al panelindeki favorilere ekle düğmesinin ekran okuyucu etiketi. */
  qbFavoriteAriaLabel?: string;
  /** Hızlı satın al panelindeki adet seçicinin ekran okuyucu etiketi. */
  qbQuantityAriaLabel?: string;
  /** Hızlı satın al panelindeki adet azaltma düğmesinin ekran okuyucu etiketi. */
  qbDecreaseAriaLabel?: string;
  /** Hızlı satın al panelindeki adet artırma düğmesinin ekran okuyucu etiketi. */
  qbIncreaseAriaLabel?: string;
  /** Açıkken hızlı satın al panelinde, mağazada etkinse tek tıkla ödeme düğmesi de gösterilir. */
  quickBuyPayWithIkas?: boolean;
  /** Geri sayımda gün kısmının biçimi; {d} yerine kalan gün sayısı yazılır, bir günden azsa gösterilmez. */
  countdownDaysText?: string;
  /** Arama kutusunda mobil ekranlarda görünen kısa ipucu; boşsa masaüstü ipucu kullanılır. */
  searchPlaceholderMobile?: string;
}
