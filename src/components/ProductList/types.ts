// This file is auto-generated — do not edit manually.
import type { IkasProductList, IkasNavigationLink, IkasImage } from "@ikas/bp-storefront";
import type { ProductListPageMode } from "../../global-types";

export interface Props {
  /** Bu bölümde listelenecek ürünler; kategori, marka veya arama sayfasında sayfanın ürünleriyle otomatik dolar. */
  productList?: IkasProductList;
  /** Listenin kategori, arama veya favoriler sayfası olarak davranacağını seçer; başlık ve boş durum buna göre değişir. */
  pageMode?: ProductListPageMode;
  /** Masaüstü sütun sayısı (filtre paneli kapalıyken; açıkken bir eksik) */
  columns?: number;
  /** Sayfa konumunu gösteren yol satırında ana sayfaya götüren ilk adımın metni. */
  breadcrumbHomeText?: string;
  /** Başlığın üstündeki sayfa konumu yol satırının ekran okuyucu etiketi. */
  breadcrumbAriaLabel?: string;
  /** Arama sonuçları sayfasının başlığı; {query} yerine müşterinin aradığı kelime yazılır. */
  searchTitle?: string;
  /** Favoriler modunda listenin üstünde görünen sayfa başlığı. */
  favoritesTitle?: string;
  /** Araç çubuğunda ürün sayısının yanında görünen birim, örneğin "24 ÜRÜN". */
  resultsLabel?: string;
  /** Arama sayfasında sonuç sayısının yanında görünen birim, örneğin "12 SONUÇ". */
  searchResultsLabel?: string;
  /** Mobil ve tablette filtre panelini açan düğmenin metni; seçili filtre sayısı yanında görünür. */
  filterButtonText?: string;
  /** Masaüstünde açık filtre panelini daraltan düğmenin ekran okuyucu etiketi. */
  hideFiltersText?: string;
  /** Masaüstünde kapalı filtre şeridini açan düğmenin ekran okuyucu etiketi. */
  showFiltersText?: string;
  /** Araç çubuğundaki sıralama düğmesinin metni. */
  sortLabel?: string;
  /** Masaüstü filtre panelinde seçili tüm filtreleri kaldıran düğmenin metni. */
  clearFiltersText?: string;
  /** Seçili filtre etiketlerindeki kaldır (×) düğmesinin ekran okuyucu etiketi. */
  removeFilterAriaLabel?: string;
  /** Filtre panelinde alt kategorileri listeleyen filtre grubunun başlığı. */
  categoryFilterTitle?: string;
  /** Fiyat filtresindeki en düşük fiyat alanının ekran okuyucu etiketi. */
  priceMinAriaLabel?: string;
  /** Fiyat filtresindeki en yüksek fiyat alanının ekran okuyucu etiketi. */
  priceMaxAriaLabel?: string;
  /** Ürün listesinin altında sonraki ürünleri yükleyen düğmenin metni. */
  loadMoreText?: string;
  /** Ürünler yüklenirken düğmelerde ve filtre panelinde geçici olarak görünen metin. */
  loadingMoreText?: string;
  /** Liste ortadan bir sayfadan açıldığında en üstte önceki ürünleri yükleyen düğmenin metni. */
  loadPreviousText?: string;
  /** Kategoride veya seçili filtrelerle hiç ürün bulunamadığında görünen başlık. */
  emptyTitle?: string;
  /** Kategoride veya seçili filtrelerle ürün bulunamadığında başlığın altında görünen açıklama. */
  emptyText?: string;
  /** Liste boşken veya favoriler boşken görünen, müşteriyi başka ürünlere yönlendiren düğmenin metni. */
  emptyButtonText?: string;
  /** Aramada sonuç çıkmadığında görünen başlık; {query} yerine aranan kelime yazılır. */
  searchEmptyTitle?: string;
  /** Aramada sonuç çıkmadığında başlığın altında görünen öneri metni. */
  searchEmptyText?: string;
  /** Giriş yapmış müşterinin favori listesi boşken başlığın altında görünen açıklama. */
  favoritesEmptyText?: string;
  /** Favoriler sayfasını giriş yapmadan açan müşteriye gösterilen başlık. */
  favoritesLoginText?: string;
  /** Favoriler sayfasında giriş yapmamış müşteriye başlığın altında gösterilen açıklama. */
  favoritesLoginSubtext?: string;
  /** Favoriler sayfasında giriş yapmamış müşteriyi giriş sayfasına götüren düğmenin metni. */
  favoritesLoginButtonText?: string;
  /** Ürün kartlarındaki sepete ekle düğmesinin ekran okuyucu etiketi. */
  addToCartAriaLabel?: string;
  /** Ürün kartlarındaki kalp (favorilere ekle) düğmesinin ekran okuyucu etiketi. */
  favoriteAriaLabel?: string;
  /** Stokta olmayan ürünlerin kartında görünen rozet metni. */
  soldOutText?: string;
  /** Filtre panelinin ve mobil filtre penceresinin üstünde görünen başlık. */
  filterTitle?: string;
  /** Mobil filtre ve sıralama pencerelerindeki kapat düğmesinin ekran okuyucu etiketi. */
  closeAriaLabel?: string;
  /** Mobil filtre penceresinin altında tüm seçimleri sıfırlayan düğmenin metni. */
  drawerClearText?: string;
  /** Mobil filtre penceresini kapatıp sonuçları gösteren düğme; {count} yerine ürün sayısı yazılır. */
  applyFiltersText?: string;
  /** Liste veya favoriler boşken görünen düğmenin götüreceği sayfa. */
  emptyButtonLink?: IkasNavigationLink | null;
  /** Bölümün arka plan rengi. Boş bırakılırsa temanın varsayılan arka planı kullanılır. */
  backgroundColor?: string;
  /** Liste bir kategoriye veya markaya bağlı değilse ya da aranan kelime yoksa görünen başlık. */
  allProductsTitle?: string;
  /** Sayfa başlığını yol satırının altında gösterir; üstte başlıklı bir kapak bölümü varsa kapatın. */
  showTitle?: boolean;
  /** Stok durumu filtresinde stokta olan ürünleri seçen seçeneğin metni. */
  inStockText?: string;
  /** Stok durumu filtresinde stokta olmayan ürünleri seçen seçeneğin metni. */
  outOfStockText?: string;
  /** Favoriler sayfasındaki sıralama menüsünde varsayılan (önerilen) sıra seçeneğinin metni. */
  favoritesSortDefaultText?: string;
  /** Favoriler sayfasındaki sıralama menüsünde fiyata göre artan sıra seçeneğinin metni. */
  favoritesSortPriceAscText?: string;
  /** Favoriler sayfasındaki sıralama menüsünde fiyata göre azalan sıra seçeneğinin metni. */
  favoritesSortPriceDescText?: string;
  /** Masaüstünde ürünlerin solundaki dar filtre şeridinde dikey olarak görünen etiket. */
  filterRailText?: string;
  /** Filtre panelinde seçili filtrelerin listelendiği alanın başlığı. */
  selectedFiltersTitle?: string;
  /** Filtre panelinin altında, sonuçların seçimle birlikte güncellendiğini belirten kısa not. Boşsa gizlenir. */
  liveUpdateText?: string;
  /** Mobil ve tablette açılan sıralama penceresinin üstünde görünen başlık. */
  sortTitle?: string;
  /** Kategori listesinde ürünlerin arasına görselli editoryal bir kutu ekler. Görsel seçilmezse kutu görünmez. */
  showEditorial?: boolean;
  /** Ürünlerin arasındaki editoryal kutunun görseli. Boş bırakılırsa kutu gösterilmez. */
  editorialImage?: IkasImage | null;
  /** Ürünlerin arasındaki editoryal kutuda görselin üzerinde görünen başlık. */
  editorialTitle?: string;
  /** Ürünlerin arasındaki editoryal kutuda başlığın altında görünen kısa metin. */
  editorialText?: string;
  /** Editoryal kutunun altındaki bağlantının metni; bağlantı seçili değilse görünmez. */
  editorialLinkText?: string;
  /** Editoryal kutuya tıklayınca açılacak sayfa, örneğin bir blog yazısı veya rehber. */
  editorialLink?: IkasNavigationLink | null;
  /** Editoryal kutunun listede kaçıncı üründen sonra yer alacağını belirler; o kadar ürün yoksa gösterilmez. */
  editorialPosition?: number;
  /** Zorunlu kişiselleştirmesi olan ürünlerin kartında sepet düğmesinin yerine gelen, ürün sayfasına götüren düğmenin ekran okuyucu etiketi. */
  customizeAriaLabel?: string;
}
