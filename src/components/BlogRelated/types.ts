// This file is auto-generated — do not edit manually.
import type { IkasBlogList } from "@ikas/bp-storefront";

export interface Props {
  /** Önerilen blog yazılarının üstünde görünen bölüm başlığı. Boş bırakılırsa gizlenir. */
  title?: string;
  /** Her blog kartında yazının devamına götüren bağlantının metni. */
  readMoreText?: string;
  /** Önerilecek blog yazıları; ilk üçü gösterilir, okunan yazı atlanır. Yazı yoksa bölüm gizlenir. */
  blogs?: IkasBlogList;
  /** Bölümün arka plan rengi. Boş bırakılırsa temanın varsayılan rengi kullanılır. */
  backgroundColor?: string;
}
