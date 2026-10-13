// This file is auto-generated — do not edit manually.
import type { IkasImage, IkasNavigationLink } from "@ikas/bp-storefront";

export interface Props {
  /** Slaytın tam genişlikteki arka plan görseli; mobil görsel yoksa mobilde de kullanılır. */
  image?: IkasImage | null;
  /** Mobil ekranlarda arka planda gösterilecek görsel. Boş bırakılırsa ana görsel kullanılır. */
  mobileImage?: IkasImage | null;
  /** Slaytın üzerinde kelime kelime beliren büyük başlık. Boşsa gizlenir. */
  title?: string;
  /** Slayt başlığının altında görünen açıklama metni. Boşsa gizlenir. */
  text?: string;
  /** Slayttaki düğmenin metni. Boşsa veya bağlantı seçilmemişse düğme gizlenir. */
  buttonText?: string;
  /** Slaytın köşesinde görünen kısa bilgi metni (ör. koordinat). Boşsa gizlenir. */
  metaText?: string;
  /** Slayttaki düğmenin açacağı sayfa. Boş bırakılırsa düğme gizlenir. */
  buttonLink?: IkasNavigationLink | null;
}
