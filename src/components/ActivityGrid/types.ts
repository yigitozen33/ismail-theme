// This file is auto-generated — do not edit manually.
import type { IkasNavigationLink } from "@ikas/bp-storefront";

export interface Props {
  /** Aktivite kartlarının üstünde görünen bölüm başlığı. */
  title?: string;
  /** Başlığın altında görünen kısa açıklama metni. Boş bırakılırsa gizlenir. */
  subtitle?: string;
  /** Başlığın yanında görünen tümünü gör bağlantısının metni; bağlantı seçili değilse görünmez. */
  linkText?: string;
  /** Başlığın yanındaki bağlantıya tıklayınca açılacak sayfa. Boş bırakılırsa bağlantı gizlenir. */
  link?: IkasNavigationLink | null;
  /** Yan yana dizilen, üzerine gelince genişleyen aktivite kartları; her kart kendi görsel ve bağlantısını taşır. */
  activities?: any;
  /** Bölümün arka plan rengi. Boş bırakılırsa temanın varsayılan arka planı kullanılır. */
  backgroundColor?: string;
}
