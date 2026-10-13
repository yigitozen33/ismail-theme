// This file is auto-generated — do not edit manually.
import type { IkasImage, IkasNavigationLink } from "@ikas/bp-storefront";
import type { SpotlightImagePosition } from "../../global-types";

export interface Props {
  /** Bölümün bir yanında geniş olarak gösterilen mağaza görseli. Boş bırakılırsa görsel alanı boş kalır. */
  image?: IkasImage | null;
  /** Metin sütununun üstünde görünen başlık. Boş bırakılırsa gizlenir. */
  title?: string;
  /** Başlığın altında mağazayı veya duyuruyu anlatan paragraf. Boş bırakılırsa gizlenir. */
  text?: string;
  /** Teklif alanında büyük değerin üstünde görünen küçük etiket. Boş bırakılırsa gizlenir. */
  offerLabel?: string;
  /** Teklif alanında büyük harflerle gösterilen değer, örneğin indirim oranı; rakamlar ekrana girince sayarak gelir. */
  offerValue?: string;
  /** Teklif değerinin altında görünen kısa not, örneğin geçerlilik tarihi. Boş bırakılırsa gizlenir. */
  offerNote?: string;
  /** Teklif alanının altındaki düğmenin metni; bağlantı seçili değilse düğme görünmez. */
  buttonText?: string;
  /** Düğmeye tıklayınca açılacak sayfa, örneğin mağazanın harita konumu. Boş bırakılırsa düğme gizlenir. */
  buttonLink?: IkasNavigationLink | null;
  /** Görselin metin sütununun solunda mı sağında mı duracağını seçer. */
  imagePosition?: SpotlightImagePosition;
  /** Bölümün arka plan rengi. Boş bırakılırsa temanın varsayılan arka planı kullanılır. */
  backgroundColor?: string;
}
