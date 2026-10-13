// This file is auto-generated — do not edit manually.
import type { IkasNavigationLink } from "@ikas/bp-storefront";

export interface Props {
  /** Kartın solundaki yuvarlak alanda görünen SVG ikon; boş bırakılırsa ikon gösterilmez. */
  icon?: string;
  /** Kartta büyük yazıyla görünen iletişim bilgisi, örneğin e-posta adresi veya telefon numarası. */
  value?: string;
  /** İletişim bilgisinin altında küçük yazıyla görünen açıklama; boş bırakılırsa gizlenir. */
  hint?: string;
  /** Karta tıklandığında açılacak bağlantı, örneğin e-posta veya telefon; boşsa kart tıklanamaz. */
  link?: IkasNavigationLink | null;
  /** Açıkken kart koyu zeminli ve açık yazılı olarak gösterilir, öne çıkarmak için kullanılır. */
  dark?: boolean;
}
