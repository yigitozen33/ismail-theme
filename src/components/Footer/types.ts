// This file is auto-generated — do not edit manually.
import type { IkasImage, IkasNavigationLink } from "@ikas/bp-storefront";

export interface Props {
  /** Alt bilginin üst bandında, iletişim kartı ve bülten kutusunun arkasında görünen geniş görsel. */
  ctaImage?: IkasImage | null;
  /** Üst banttaki iletişim kartının başlığı; satır sonu ile iki satıra bölünebilir. Boş bırakılırsa gizlenir. */
  ctaTitle?: string;
  /** Üst banttaki iletişim kartında yer alan düğmenin metni. Boş bırakılırsa düğme gizlenir. */
  ctaButtonText?: string;
  /** İletişim kartındaki düğmenin yönlendireceği sayfa veya adres. */
  ctaButtonLink?: IkasNavigationLink | null;
  /** E-posta bülteni kayıt kutusunun başlığı. Boş bırakılırsa gizlenir. */
  notifyTitle?: string;
  /** Bülten kutusunda başlığın altında görünen kısa açıklama. Boş bırakılırsa gizlenir. */
  notifyText?: string;
  /** Bülten e-posta alanı boşken içinde görünen ipucu; ekran okuyucu etiketi olarak da kullanılır. */
  notifyPlaceholder?: string;
  /** Bülten kutusunda e-posta adresini kaydeden düğmenin metni. */
  notifyButtonText?: string;
  /** E-posta kaydı gönderilirken kaydol düğmesinde görünen metin. */
  notifySubmittingText?: string;
  /** E-posta bültene başarıyla kaydedildiğinde formun altında gösterilen mesaj. */
  notifySuccessText?: string;
  /** Girilen e-posta adresi geçersiz olduğunda formun altında gösterilen uyarı. */
  notifyErrorText?: string;
  /** Bülten kaydı beklenmeyen bir nedenle başarısız olduğunda gösterilen hata mesajı. */
  notifyFailureText?: string;
  /** Alt bilginin sol tarafında, marka metninin üstünde görünen SVG logo. Boş bırakılırsa logo gizlenir. */
  logo?: string;
  /** Logonun altında markayı kısaca tanıtan metin. Boş bırakılırsa gizlenir. */
  aboutText?: string;
  /** Alt bilgide yan yana dizilen bağlantı sütunları; mobilde açılır kapanır başlıklara dönüşür. */
  columns?: any;
  /** Marka metninin altında görünen sosyal medya hesap bağlantıları. Eklenmezse alan gizlenir. */
  socialLinks?: any;
  /** Alt bilginin en alt satırında görünen iletişim bilgisi. Boş bırakılırsa gizlenir. */
  contactText?: string;
  /** İletişim metnine tıklanınca gidilecek adres, örneğin telefon veya iletişim sayfası. Boşsa metin bağlantısız görünür. */
  contactLink?: IkasNavigationLink | null;
  /** En alt satırdaki dil ve para birimi düğmesinde, mağazada seçim yoksa görünen yedek metin. */
  localeText?: string;
  /** Dil ve para birimi panelinde ülke ve para birimi seçeneklerinin başlığı. */
  localeTitle?: string;
  /** Dil ve para birimi panelinde dil seçeneklerinin başlığı. */
  languageTitle?: string;
  /** Alt bilginin en alt satırında görünen telif hakkı metni. Boş bırakılırsa gizlenir. */
  copyrightText?: string;
  /** Alt bilginin en alt satırında küçük harflerle görünen konum bilgisi. Boş bırakılırsa gizlenir. */
  coordinateText?: string;
  /** Alt bilgi bölümünün arka plan rengi. Boş bırakılırsa temanın koyu arka planı kullanılır. */
  backgroundColor?: string;
}
