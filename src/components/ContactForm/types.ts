// This file is auto-generated — do not edit manually.
export interface Props {
  /** Bölümün en üstündeki büyük başlık; satır atlamak için alt satıra geçebilirsiniz, boşsa gizlenir. */
  title?: string;
  /** Başlığın yanında görünen tanıtım açıklaması; boş bırakılırsa gizlenir. */
  intro?: string;
  /** Açıklamanın altında yeşil noktalı kutucukta görünen yanıt süresi bilgisi; boşsa gizlenir. */
  responseText?: string;
  /** İletişim formunun en üstünde görünen başlık; boş bırakılırsa gizlenir. */
  formTitle?: string;
  /** Formdaki konu seçeneklerinin üstünde görünen soru; konu bileşeni yoksa gösterilmez. */
  topicLabel?: string;
  /** Formdaki ad alanının üstünde görünen etiket. */
  firstNameLabel?: string;
  /** Ad alanı boşken içinde görünen ipucu metni. */
  firstNamePlaceholder?: string;
  /** Formdaki soyad alanının üstünde görünen etiket. */
  lastNameLabel?: string;
  /** Soyad alanı boşken içinde görünen ipucu metni. */
  lastNamePlaceholder?: string;
  /** Formdaki e-posta alanının üstünde görünen etiket. */
  emailLabel?: string;
  /** E-posta alanı boşken içinde görünen örnek adres. */
  emailPlaceholder?: string;
  /** Formdaki isteğe bağlı telefon alanının üstünde görünen etiket. */
  phoneLabel?: string;
  /** Telefon alanı boşken içinde görünen örnek numara. */
  phonePlaceholder?: string;
  /** Formdaki isteğe bağlı sipariş numarası alanının üstünde görünen etiket. */
  orderLabel?: string;
  /** Sipariş numarası alanı boşken içinde görünen örnek değer. */
  orderPlaceholder?: string;
  /** Formdaki mesaj alanının üstünde görünen etiket. */
  messageLabel?: string;
  /** Mesaj alanı boşken içinde görünen yönlendirici ipucu. */
  messagePlaceholder?: string;
  /** Gönder düğmesinin yanındaki onay kutusunun metni; işaretlenmeden form gönderilmez. */
  consentText?: string;
  /** Onay kutusu işaretlenmeden form gönderilmeye çalışıldığında kutunun altında çıkan uyarı. */
  consentErrorText?: string;
  /** Ad, soyad veya e-posta gibi zorunlu bir alan boş bırakıldığında alanın altında çıkan uyarı. */
  requiredErrorText?: string;
  /** E-posta alanına geçersiz bir adres yazıldığında alanın altında çıkan uyarı. */
  emailErrorText?: string;
  /** Formu gönderen düğmenin yazısı. */
  submitText?: string;
  /** Form gönderilirken gönder düğmesinde görünen yazı. */
  submittingText?: string;
  /** Mesaj başarıyla gönderildiğinde düğmenin altında gösterilen onay mesajı. */
  successText?: string;
  /** Formda hatalı ya da eksik alan olduğunda düğmenin altında gösterilen genel uyarı. */
  errorText?: string;
  /** Mesaj teknik bir sorun nedeniyle gönderilemediğinde gösterilen hata mesajı. */
  failureText?: string;
  /** İletişim kanallarının altında, sosyal medya bağlantılarının üstünde görünen başlık. */
  socialTitle?: string;
  /** Seçilen konunun mağazaya ulaşan mesajın başına eklenirken önüne yazılan ifade. */
  topicPrefix?: string;
  /** Girilen sipariş numarasının mağazaya ulaşan mesaja eklenirken önüne yazılan ifade. */
  orderPrefix?: string;
  /** Formun üstünde ziyaretçinin seçebileceği konu seçenekleri; eklenmezse konu alanı gizlenir. */
  topics?: any;
  /** Formun yanında listelenen e-posta, telefon gibi iletişim kanalı kartları. */
  channels?: any;
  /** İletişim kanallarının altında gösterilen sosyal medya bağlantıları; boşsa alan gizlenir. */
  socialLinks?: any;
  /** Bölümün arka plan rengi; boş bırakılırsa temanın varsayılan rengi kullanılır. */
  backgroundColor?: string;
  /** Mesaj alanı boş bırakılarak form gönderilmeye çalışıldığında alanın altında çıkan uyarı. */
  messageErrorText?: string;
}
