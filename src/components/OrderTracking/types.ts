// This file is auto-generated — do not edit manually.
export interface Props {
  /** Sipariş sorgulama bölümünün formun üstünde görünen ana başlığı. Boş bırakılırsa gizlenir. */
  title?: string;
  /** Başlığın altında sorgulamanın nasıl yapılacağını anlatan açıklama. Boş bırakılırsa gizlenir. */
  text?: string;
  /** Sorgulama formundaki e-posta alanının üstünde görünen etiket. */
  emailLabel?: string;
  /** E-posta alanı boşken içinde soluk olarak görünen örnek metin. */
  emailPlaceholder?: string;
  /** Sorgulama formundaki sipariş numarası alanının üstünde görünen etiket. */
  orderNumberLabel?: string;
  /** Sipariş sorgusunu başlatan düğmenin metni. */
  submitText?: string;
  /** Sorgu sürerken düğmede geçici olarak görünen bekleme metni. */
  submittingText?: string;
  /** Henüz sorgu yapılmadığında sonuç alanında görünen bilgilendirme metni. Boş bırakılırsa gizlenir. */
  placeholderText?: string;
  /** Girilen e-posta ve sipariş numarasıyla eşleşen sipariş bulunamadığında görünen uyarı. */
  notFoundText?: string;
  /** Sorgu sonucunda sipariş numarasının önünde görünen başlık, örneğin "Sipariş #1234". */
  statusTitle?: string;
  /** Sipariş durum çizelgesinin ilk adımı olan siparişin alındığını belirten etiket. */
  stepReceivedText?: string;
  /** Sipariş durum çizelgesinde siparişin hazırlandığını belirten ikinci adımın etiketi. */
  stepPreparingText?: string;
  /** Sipariş durum çizelgesinde siparişin kargoya verildiğini belirten üçüncü adımın etiketi. */
  stepShippedText?: string;
  /** Sipariş durum çizelgesinde siparişin teslim edildiğini belirten son adımın etiketi. */
  stepDeliveredText?: string;
  /** Sipariş iptal edildiyse durum rozetinde gösterilen metin. */
  cancelledText?: string;
  /** Kargo bilgilerinde kargo firmasının adının önünde görünen etiket. */
  cargoCompanyLabel?: string;
  /** Kargo bilgilerinde kargo takip numarasının önünde görünen etiket. */
  trackingNumberLabel?: string;
  /** Takip numarasının üzerine gelince görünen ipucu; numara kargo firmasının takip sayfasını açar. */
  trackingLinkText?: string;
  /** Bölümün arka plan rengi. Boş bırakılırsa temanın varsayılan arka planı kullanılır. */
  backgroundColor?: string;
}
