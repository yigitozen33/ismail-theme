// This file is auto-generated — do not edit manually.
import type { IkasNavigationLink } from "@ikas/bp-storefront";

export interface Props {
  /** Bölümün üstünde görünen başlık; boş bırakılırsa gizlenir. */
  title?: string;
  /** Başlığın altında görünen kısa açıklama; boş bırakılırsa gizlenir. */
  text?: string;
  /** Başlığın yanındaki tüm mağazalar düğmesinin yazısı; bağlantı seçilmemişse düğme gizlenir. */
  allStoresText?: string;
  /** Tüm mağazalar düğmesine tıklandığında açılacak sayfa; boşsa düğme gösterilmez. */
  allStoresLink?: IkasNavigationLink | null;
  /** Seçili mağaza kartında harita yol tarifini açan düğmenin yazısı; boşsa düğme gizlenir. */
  directionsText?: string;
  /** Mağaza çalışma saatleri içindeyken kartta ve listede görünen durum rozeti. */
  openNowText?: string;
  /** Mağaza çalışma saatleri dışındayken kartta ve listede görünen durum yazısı. */
  closedText?: string;
  /** Listedeki mağaza satırlarını seçip büyük kartta gösteren düğmenin ekran okuyucu etiketi. */
  selectStoreAriaLabel?: string;
  /** Listede gösterilecek mağazalar; seçilen mağazanın görseli ve bilgileri solda büyük kartta görünür. */
  stores?: any;
  /** Bölümün arka plan rengi; boş bırakılırsa temanın varsayılan rengi kullanılır. */
  backgroundColor?: string;
}
