// This file is auto-generated — do not edit manually.
import type { IkasNavigationLink } from "@ikas/bp-storefront";

export interface Props {
  /** Bölümün sol üstünde sekmelerin yanında görünen başlık. */
  title?: string;
  /** Başlığın altında görünen kısa açıklama metni. Boş bırakılırsa gizlenir. */
  subtitle?: string;
  /** Ürün listesinin altındaki tümünü gör bağlantısının metni; bağlantı seçili değilse görünmez. */
  linkText?: string;
  /** Kategori sekmeleri çubuğunun ekran okuyucu etiketi. */
  tabsAriaLabel?: string;
  /** Listenin altındaki bağlantıya tıklayınca açılacak sayfa. Boş bırakılırsa bağlantı gizlenir. */
  link?: IkasNavigationLink | null;
  /** Her biri ayrı bir ürün listesi olan sekmeler; birden fazla sekme eklenince üstte sekme çubuğu görünür. */
  tabs?: any;
  /** Her sekmede sıralı olarak gösterilecek en fazla ürün sayısı; 1 ile 10 arasında bir değer girin. */
  maxItems?: number;
  /** Bölümün arka plan rengi. Boş bırakılırsa temanın varsayılan arka planı kullanılır. */
  backgroundColor?: string;
}
