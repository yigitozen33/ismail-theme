// This file is auto-generated — do not edit manually.
import type { IkasNavigationLink } from "@ikas/bp-storefront";

export interface Props {
  /** Sayfa bulunamadı ekranında rakamları dönerek beliren büyük hata kodu. */
  codeText?: string;
  /** Hata kodunun altında görünen sayfa bulunamadı başlığı. Boşsa gizlenir. */
  title?: string;
  /** Başlığın altında görünen açıklama metni. Boş bırakılırsa gizlenir. */
  text?: string;
  /** Ziyaretçiyi yönlendiren düğmenin metni. Boş bırakılırsa düğme gizlenir. */
  buttonText?: string;
  /** Düğmenin açacağı sayfa. Boş bırakılırsa ana sayfaya yönlendirir. */
  buttonLink?: IkasNavigationLink | null;
  /** Sayfa bulunamadı bölümünün arka plan rengi. Boşsa temanın varsayılan rengi kullanılır. */
  backgroundColor?: string;
}
