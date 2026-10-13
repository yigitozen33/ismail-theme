// This file is auto-generated — do not edit manually.
import type { IkasBlog, IkasNavigationLink } from "@ikas/bp-storefront";

export interface Props {
  /** Bu bölümde gösterilecek blog yazısı; başlık, kapak görseli ve içerik buradan gelir. Seçilmezse bölüm görünmez. */
  blog: IkasBlog | null;
  /** Yazının üstünde blog listesine geri dönen bağlantının metni. Boş bırakılırsa gizlenir. */
  backLinkText?: string;
  /** Yazı bilgilerine eklenen okuma süresi; {min} yerine tahmini dakika yazılır. Boş bırakılırsa gizlenir. */
  readingTimeText?: string;
  /** Yazının altındaki paylaşım düğmelerinin yanında görünen etiket. Boş bırakılırsa paylaşım alanı gizlenir. */
  shareText?: string;
  /** Yazı bağlantısını panoya kopyalayan simge düğmesinin ekran okuyucu etiketi. */
  copyLinkAriaLabel?: string;
  /** Yazı bağlantısı kopyalandıktan sonra paylaşım alanında kısa süre görünen onay metni. */
  copiedText?: string;
  /** Yazıyı X üzerinde paylaşan simge düğmesinin ekran okuyucu etiketi. */
  shareXAriaLabel?: string;
  /** Yazıyı Facebook üzerinde paylaşan simge düğmesinin ekran okuyucu etiketi. */
  shareFacebookAriaLabel?: string;
  /** Geri bağlantısının gideceği sayfa. Boş bırakılırsa blog ana sayfasına yönlendirir. */
  backLink?: IkasNavigationLink | null;
  /** Blog yazısı bölümünün arka plan rengi. Boş bırakılırsa temanın varsayılan arka planı kullanılır. */
  backgroundColor?: string;
}
