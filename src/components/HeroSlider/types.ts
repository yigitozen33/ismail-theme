// This file is auto-generated — do not edit manually.
import type { HeroHeightMode } from "../../global-types";

export interface Props {
  /** Slayt alanının ekran okuyucular için erişilebilirlik adı; sayfada görünmez. */
  ariaLabel?: string;
  /** Ana görsel alanında sırayla geçiş yapan slaytlar; her slaytın görseli ve metinleri ayrı ayrı düzenlenir. */
  slides?: any;
  /** Slaytların otomatik olarak değişme süresi (saniye). 0 girilirse otomatik geçiş kapanır. */
  autoplaySeconds?: number;
  /** Metinlerin okunması için görsellerin üzerine eklenen karartmanın yoğunluğu (0–100). 0 karartmayı kaldırır. */
  overlayOpacity?: number;
  /** Slayt alanının yüksekliği: temanın varsayılan yüksekliği, tam ekran veya daha kısa bir yükseklik. */
  heightMode?: HeroHeightMode;
  /** Görseller yüklenmeden önce slayt alanında görünen arka plan rengi. Boşsa temanın koyu rengi kullanılır. */
  backgroundColor?: string;
}
