// This file is auto-generated — do not edit manually.
import type { IkasImage, IkasNavigationLink } from "@ikas/bp-storefront";

export interface Props {
  /** Mağaza listesinde mağaza kartının üstünde ve haritalı görünümde gösterilen mağaza görseli. */
  image?: IkasImage | null;
  /** Mağaza kartında ve mağaza listesi satırında başlık olarak görünen mağaza adı. */
  name?: string;
  /** Mağaza listesi satırında mağaza adının yanında görünen semt bilgisi. */
  district?: string;
  /** Mağaza kartında görünen tam adres; kısa adres boşsa liste satırında da kullanılır. */
  address?: string;
  /** Mağazanın çalışma saatleri (ör. 10:00–21:00); açık ya da kapalı durumu bu saate göre hesaplanır. */
  hours?: string;
  /** Doluysa mağaza listesinde açık veya kapalı bilgisi yerine bu not gösterilir (ör. Yakında). */
  statusNote?: string;
  /** Mağaza kartında çalışma saatlerinin önünde görünen etiket. Boşsa gizlenir. */
  hoursLabel?: string;
  /** Mağaza kartında haritayı yeni sekmede açan bağlantının metni. Boşsa bağlantı gizlenir. */
  mapLinkText?: string;
  /** Harita bağlantısının açacağı adres (ör. harita uygulamasındaki konum). Boşsa bağlantı gizlenir. */
  mapLink?: IkasNavigationLink | null;
  /** Mağaza listesi satırında gösterilen kısa adres. Boş bırakılırsa tam adres kullanılır. */
  shortAddress?: string;
}
