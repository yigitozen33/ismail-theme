// This file is auto-generated — do not edit manually.
import type { IkasBlogList, IkasBlogCategoryList } from "@ikas/bp-storefront";

export interface Props {
  /** Blog listesinin en üstünde görünen sayfa başlığı. */
  title?: string;
  /** Başlığın altında görünen kısa açıklama metni. */
  subtitle?: string;
  /** Kategori sekmelerinin başında, tüm yazıları listeleyen sekmenin yazısı. */
  allTabText?: string;
  /** Blog kategori sekmelerinin ekran okuyucu etiketi. */
  tabsAriaLabel?: string;
  /** Her blog kartının altında yazının detayına götüren bağlantının yazısı. */
  readMoreText?: string;
  /** Listenin altında sonraki yazıları yükleyen düğmenin yazısı. */
  loadMoreText?: string;
  /** Yeni yazılar yüklenirken daha fazla düğmesinde görünen yazı. */
  loadingMoreText?: string;
  /** Seçilen kategoride hiç yazı yoksa gösterilen mesaj; boş bırakılırsa gizlenir. */
  emptyText?: string;
  /** Listede gösterilecek blog yazıları; ilk yazı geniş kart olarak öne çıkarılır. */
  blogs: IkasBlogList;
  /** Listenin üstünde sekme olarak gösterilen blog kategorileri; boşsa sekmeler gizlenir. */
  categories?: IkasBlogCategoryList;
  /** Bölümün arka plan rengi; boş bırakılırsa temanın varsayılan rengi kullanılır. */
  backgroundColor?: string;
}
