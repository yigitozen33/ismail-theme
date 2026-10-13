// This file is auto-generated — do not edit manually.
import type { IkasImage, IkasNavigationLink } from "@ikas/bp-storefront";

export interface Props {
  /** Koleksiyon kutusunun arka planını dolduran görsel. */
  image?: IkasImage | null;
  /** Kutunun sol alt köşesinde görünen koleksiyon adı; bağlantı varsa tıklanabilir. Boş bırakılırsa gizlenir. */
  title?: string;
  /** Öne çıkan veya üzerine gelinen kutuda başlığın altında beliren açıklama. Boş bırakılırsa gizlenir. */
  text?: string;
  /** Açıklamanın altında görünen küçük düğmenin metni; yalnızca bağlantı seçiliyse görünür. */
  buttonText?: string;
  /** Başlığa ve düğmeye tıklanınca gidilecek sayfa. Boş bırakılırsa düğme gizlenir ve başlık tıklanamaz. */
  link?: IkasNavigationLink | null;
}
