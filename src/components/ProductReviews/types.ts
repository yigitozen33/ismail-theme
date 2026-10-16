// This file is auto-generated — do not edit manually.
import type { IkasProduct } from "@ikas/bp-storefront";

export interface Props {
  /** Değerlendirmeleri gösterilecek ürün; ürün sayfasında açılan ürüne bağlanır. */
  product?: IkasProduct | null;
  /** Değerlendirme bölümünün solundaki özet alanında görünen başlık. Boş bırakılırsa gizlenir. */
  title?: string;
  /** Ortalama puanın altında, toplam değerlendirme sayısının ardından gelen metin. */
  reviewsCountText?: string;
  /** Yorum formunu açıp kapatan düğmenin metni. Boş bırakılırsa düğme gizlenir. */
  writeReviewText?: string;
  /** Ürünü satın almış müşterilerin yorumlarında görünen doğrulanmış alıcı etiketi. */
  verifiedText?: string;
  /** Mağazanın bir yoruma verdiği yanıtın üstünde görünen etiket. */
  merchantReplyLabel?: string;
  /** Ürünün hiç yorumu yokken liste yerine gösterilen başlık. */
  emptyTitle?: string;
  /** Ürünün hiç yorumu yokken başlığın altında gösterilen açıklama metni. */
  emptyText?: string;
  /** Ortalama puan ve yorum yıldızlarının ekran okuyucu etiketi; {n} yerine puan yazılır. */
  ratingAriaLabel?: string;
  /** Puan dağılım çubuklarının ekran okuyucu etiketi; {star} yıldız sayısı, {count} yorum sayısıdır. */
  barAriaLabel?: string;
  /** Müşterilerin yorumlara eklediği görsellerin alternatif (alt) metni. */
  reviewImageAltText?: string;
  /** Yorumdaki görseli büyüten düğmenin ekran okuyucu etiketi; {n} görselin sırasıdır. */
  imageButtonAriaLabel?: string;
  /** Yorum listesinin altındaki sayfa numaralarının ekran okuyucu etiketi. */
  paginationAriaLabel?: string;
  /** Yorum sayfalamasındaki önceki sayfa okunun ekran okuyucu etiketi. */
  prevPageAriaLabel?: string;
  /** Yorum sayfalamasındaki sonraki sayfa okunun ekran okuyucu etiketi. */
  nextPageAriaLabel?: string;
  /** Yorum görseli önizlemesini kapatan düğmenin ekran okuyucu etiketi. */
  closeAriaLabel?: string;
  /** Yorum görseli önizlemesindeki önceki görsel okunun ekran okuyucu etiketi. */
  prevImageAriaLabel?: string;
  /** Yorum görseli önizlemesindeki sonraki görsel okunun ekran okuyucu etiketi. */
  nextImageAriaLabel?: string;
  /** Yorum yaz düğmesiyle açılan formun en üstünde görünen başlık. Boşsa gizlenir. */
  formTitle?: string;
  /** Yorum formunda yıldız puan seçiminin üstünde görünen etiket. */
  ratingLabel?: string;
  /** Yorum formundaki her yıldızın ekran okuyucu etiketi; {n} yerine yıldız sayısı yazılır. */
  starAriaLabel?: string;
  /** Yorum formundaki yorum başlığı alanının üstünde görünen etiket. */
  reviewTitleLabel?: string;
  /** Yorum formundaki başlık alanı boşken içinde görünen ipucu metni. */
  reviewTitlePlaceholder?: string;
  /** Yorum formundaki yorum metni alanının üstünde görünen etiket. */
  reviewTextLabel?: string;
  /** Yorum formundaki yorum metni alanı boşken içinde görünen ipucu metni. */
  reviewTextPlaceholder?: string;
  /** Yorum formunu gönderen düğmenin metni. */
  submitText?: string;
  /** Yorum gönderilirken gönder düğmesinde görünen metin. */
  submittingText?: string;
  /** Mağaza yorumları onaydan sonra yayınlıyorsa, formda gönder düğmesinin yanında ve yorum gönderildikten sonra gösterilen not. */
  successText?: string;
  /** Yorum formu puan seçilmeden gönderildiğinde yıldızların altında gösterilen uyarı. */
  starRequiredText?: string;
  /** Yorum gönderilemediğinde formda gösterilen hata mesajı. */
  formErrorText?: string;
  /** Yorum için üyelik gerekiyorsa, giriş yapmamış ziyaretçiye form yerine gösterilen metin. */
  loginRequiredText?: string;
  /** Yorum listesinde bir sayfada gösterilecek yorum sayısı; fazlası sayfalara bölünür. */
  reviewsPerPage?: number;
  /** Değerlendirme bölümünün arka plan rengi. Boş bırakılırsa temanın varsayılan rengi kullanılır. */
  backgroundColor?: string;
  /** Mağaza yorumları onaysız yayınlıyorsa, yorum gönderildikten sonra gösterilen not. Onay gerekiyorsa bunun yerine Onay notu gösterilir. */
  publishedSuccessText?: string;
}
