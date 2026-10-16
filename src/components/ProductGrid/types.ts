// This file is auto-generated — do not edit manually.
import type { IkasProductList, IkasNavigationLink } from "@ikas/bp-storefront";

export interface Props {
  /** Ürün listesinin üstünde görünen bölüm başlığı. */
  title?: string;
  /** Bölüm başlığının altında görünen kısa açıklama metni. */
  subtitle?: string;
  /** Ürünlerin altındaki düğmenin metni. Boşsa veya bağlantı seçilmemişse düğme gizlenir. */
  buttonText?: string;
  /** Ürün kartlarındaki hızlı sepete ekle düğmesinin ekran okuyucu etiketi. */
  addToCartAriaLabel?: string;
  /** Ürün kartlarındaki kalp (favori) düğmesinin ekran okuyucu etiketi. */
  favoriteAriaLabel?: string;
  /** Stoku biten ürünlerin kartında görünen rozetin metni. */
  soldOutText?: string;
  /** Bölümde gösterilecek ürünler; bir ürün listesi seçin. Ürün yoksa liste gizlenir. */
  products?: IkasProductList;
  /** Ürünlerin altındaki düğmenin açacağı sayfa. Boş bırakılırsa düğme gizlenir. */
  buttonLink?: IkasNavigationLink | null;
  /** Masaüstü ve tablette gösterilecek en fazla ürün sayısı. */
  maxItems?: number;
  /** Mobilde gösterilecek en fazla ürün sayısı; fazlası yalnızca büyük ekranlarda görünür. */
  mobileMaxItems?: number;
  /** Masaüstünde bir satırdaki ürün sayısı; 2 ile 6 arasında bir değer girin. */
  columns?: number;
  /** Bölümün arka plan rengi. Boş bırakılırsa temanın varsayılan rengi kullanılır. */
  backgroundColor?: string;
  /** Kapatılırsa başlığın altındaki açıklama metni gizlenir. */
  showSubtitle?: boolean;
  /** Kapatılırsa ürünlerin altındaki düğme gizlenir. */
  showButton?: boolean;
  /** Zorunlu kişiselleştirmesi olan ürünlerin kartında sepet düğmesinin yerine gelen, ürün sayfasına götüren düğmenin ekran okuyucu etiketi. */
  customizeAriaLabel?: string;
}
