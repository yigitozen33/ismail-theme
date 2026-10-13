// This file is auto-generated — do not edit manually.
import type { IkasImage, IkasNavigationLink } from "@ikas/bp-storefront";

export interface Props {
  /** Aktivite kartının arka planını dolduran görsel. */
  image?: IkasImage | null;
  /** Kartın alt kısmında, görselin üzerinde görünen aktivite adı. Boş bırakılırsa gizlenir. */
  title?: string;
  /** Kart açıldığında başlığın altında beliren kısa açıklama. Boş bırakılırsa gizlenir. */
  text?: string;
  /** Kartta başlığın altında görünen ürün sayısı gibi kısa bilgi. Boş bırakılırsa gizlenir. */
  countText?: string;
  /** Kart açıldığında görünen, oklu bağlantı metni. Boş bırakılırsa gizlenir. */
  buttonText?: string;
  /** Karta tıklanınca gidilecek sayfa. Boş bırakılırsa kart tıklanamaz. */
  link?: IkasNavigationLink | null;
}
