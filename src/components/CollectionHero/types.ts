// This file is auto-generated — do not edit manually.
import type { IkasCategory, IkasImage } from "@ikas/bp-storefront";

export interface Props {
  /** Kategori seçilmemişse veya bulunamazsa görselin üzerinde gösterilen başlık. */
  title?: string;
  /** Kategorinin kendi açıklaması yoksa başlığın altında gösterilen açıklama metni. */
  description?: string;
  /** Adı, görseli ve açıklaması kapakta gösterilecek kategori; kategori sayfasında açılan kategoriye bağlanır. */
  category?: IkasCategory | null;
  /** Kategorinin kendi görseli yoksa kapakta kullanılacak yedek görsel. */
  image?: IkasImage | null;
  /** Görsel yokken veya yüklenirken kapak alanında görünen arka plan rengi. */
  backgroundColor?: string;
}
