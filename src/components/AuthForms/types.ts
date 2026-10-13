// This file is auto-generated — do not edit manually.
import type { IkasImage, IkasNavigationLink } from "@ikas/bp-storefront";
import type { AuthFormVariant } from "../../global-types";

export interface Props {
  /** Bölümün hangi formu göstereceğini seçer: giriş, kayıt, şifremi unuttum veya şifre yenileme. */
  variant?: AuthFormVariant;
  /** Giriş ve kayıt formunun altında Google ile devam et düğmesini gösterir. Kapalıyken düğme gizlenir. */
  showGoogle?: boolean;
  /** Giriş ve kayıt formunun altında Facebook ile devam et düğmesini gösterir. Kapalıyken düğme gizlenir. */
  showFacebook?: boolean;
  /** Giriş ve kayıt formunun altında telefon numarasıyla giriş bağlantısını gösterir. Kapalıyken gizlenir. */
  showSmsLogin?: boolean;
  /** Masaüstünde formun yanında yarım ekran gösterilen görsel. Boş bırakılırsa form tek sütun olarak ortalanır. */
  image?: IkasImage | null;
  /** Giriş formunun en üstünde görünen başlık. Boş bırakılırsa başlık gizlenir. */
  loginTitle?: string;
  /** Kayıt formunun en üstünde görünen başlık. Boş bırakılırsa başlık gizlenir. */
  registerTitle?: string;
  /** Şifremi unuttum formunun en üstünde görünen başlık. Boş bırakılırsa başlık gizlenir. */
  forgotTitle?: string;
  /** E-postadaki bağlantıyla açılan yeni şifre belirleme formunun başlığı. Boş bırakılırsa gizlenir. */
  recoverTitle?: string;
  /** Telefon numarasıyla giriş adımlarında formun üstünde görünen başlık. Boş bırakılırsa gizlenir. */
  smsTitle?: string;
  /** Giriş formunda başlığın altında görünen kısa açıklama. Boş bırakılırsa gizlenir. */
  loginText?: string;
  /** Kayıt formunda başlığın altında görünen kısa açıklama. Boş bırakılırsa gizlenir. */
  registerText?: string;
  /** Şifremi unuttum formunda başlığın altında görünen yönlendirme metni. Boş bırakılırsa gizlenir. */
  forgotText?: string;
  /** Yeni şifre formunda başlığın altında görünen açıklama; şifre kurallarını yazmak için uygundur. */
  recoverText?: string;
  /** Telefonla girişte numara ve kod adımlarında başlığın altında görünen açıklama. Boş bırakılırsa gizlenir. */
  smsText?: string;
  /** Telefonla ilk kez giriş yapan müşteriden ad ve soyad istenen son adımda görünen açıklama. */
  smsProfileText?: string;
  /** Giriş formunun gönder düğmesindeki metin; telefonla girişte kod doğrulama adımında da kullanılır. */
  submitText?: string;
  /** Kayıt formunun gönder düğmesindeki metin; telefonla kayıtta profil adımında da kullanılır. */
  registerSubmitText?: string;
  /** Şifremi unuttum formunda şifre yenileme bağlantısını e-postayla gönderen düğmenin metni. */
  forgotSubmitText?: string;
  /** Yeni şifre belirleme formunda yeni şifreyi kaydeden düğmenin metni. */
  recoverSubmitText?: string;
  /** Telefonla girişte numara girildikten sonra doğrulama kodunu gönderen düğmenin metni. */
  sendCodeText?: string;
  /** Form gönderilirken tüm form düğmelerinde geçici olarak görünen bekleme metni. */
  submittingText?: string;
  /** Kayıt formunda ve telefonla kayıtta ad alanının üstündeki etiket. */
  firstNameLabel?: string;
  /** Kayıt formunda ve telefonla kayıtta soyad alanının üstündeki etiket. */
  lastNameLabel?: string;
  /** Giriş, kayıt ve şifremi unuttum formlarındaki e-posta alanının üstündeki etiket. */
  emailLabel?: string;
  /** E-posta alanı boşken içinde soluk olarak görünen örnek metin. */
  emailPlaceholder?: string;
  /** Giriş ve kayıt formlarındaki şifre alanının üstündeki etiket. */
  passwordLabel?: string;
  /** Yeni şifre belirleme formundaki yeni şifre alanının üstündeki etiket. */
  newPasswordLabel?: string;
  /** Yeni şifre belirleme formunda şifrenin tekrar girildiği alanın etiketi. */
  passwordAgainLabel?: string;
  /** Telefonla giriş formundaki telefon numarası alanının üstündeki etiket. */
  phoneLabel?: string;
  /** Telefon alanı boşken içinde soluk olarak görünen örnek numara. */
  phonePlaceholder?: string;
  /** Telefonla girişte SMS ile gelen doğrulama kodunun girildiği alanın etiketi. */
  codeLabel?: string;
  /** Kod gönderildikten sonra alanın altında görünen not; {phone} yerine müşterinin maskeli numarası yazılır. */
  codeSentText?: string;
  /** Kod doğrulama adımında yeni kod isteyen düğmenin metni; bekleme süresi yanında gösterilir. */
  resendCodeText?: string;
  /** Kayıt formunda kampanya e-postası ve SMS izni onay kutusunun metni. Boş bırakılırsa kutu gizlenir. */
  marketingConsentText?: string;
  /** Kayıt formunda üyelik sözleşmesini kabul etmek için işaretlenmesi zorunlu kutunun metni. */
  agreementConsentText?: string;
  /** Giriş formunda şifre alanının altında şifremi unuttum sayfasını açan bağlantı. Boş bırakılırsa gizlenir. */
  forgotLinkText?: string;
  /** Form ile sosyal giriş düğmeleri arasındaki çizgi ayracın ortasında görünen kısa metin. */
  socialDividerText?: string;
  /** Google ile giriş düğmesinin üzerindeki metin. */
  googleText?: string;
  /** Facebook ile giriş düğmesinin üzerindeki metin. */
  facebookText?: string;
  /** Giriş ve kayıt formunun altında telefonla girişi açan bağlantı metni. Boş bırakılırsa gizlenir. */
  smsLoginText?: string;
  /** Telefonla giriş ekranından e-posta ile girişe dönen bağlantının metni. Boş bırakılırsa gizlenir. */
  emailLoginText?: string;
  /** Şifremi unuttum formu gönderildikten sonra görünen, bağlantının e-postaya iletildiğini bildiren mesaj. */
  successText?: string;
  /** Yeni şifre kaydedildikten sonra, giriş sayfasına yönlendirme öncesinde görünen başarı mesajı. */
  recoverSuccessText?: string;
  /** Kayıt sonrası e-posta doğrulaması gerekiyorsa formun altında görünen bilgilendirme mesajı. */
  registerSuccessText?: string;
  /** Giriş başarısız olduğunda, örneğin e-posta veya şifre yanlışsa formun altında görünen hata mesajı. */
  errorText?: string;
  /** Şifre yenileme bağlantısı geçersiz ya da süresi dolmuşsa yeni şifre formunda görünen hata mesajı. */
  invalidTokenText?: string;
  /** Giriş formunun en altında kayıt bağlantısının önünde görünen soru metni. Boş bırakılırsa gizlenir. */
  switchText?: string;
  /** Giriş formunun en altında kayıt sayfasına götüren bağlantının metni. */
  registerLinkText?: string;
  /** Kayıt formunun en altında giriş bağlantısının önünde görünen soru metni. Boş bırakılırsa gizlenir. */
  registerSwitchText?: string;
  /** Şifremi unuttum formunun altında giriş bağlantısının önünde görünen metin. Boş bırakılırsa gizlenir. */
  forgotSwitchText?: string;
  /** Kayıt ve şifremi unuttum formlarının en altında giriş sayfasına götüren bağlantının metni. */
  loginLinkText?: string;
  /** Şifre yenileme bağlantısı geçersizse görünen, yeni bağlantı istemek için şifremi unuttum sayfasına götüren metin. */
  newLinkText?: string;
  /** Üyelik sözleşmesi onay metnini bu sayfaya bağlar. Boş bırakılırsa varsayılan sözleşme metni pencerede açılır. */
  agreementLink?: IkasNavigationLink | null;
  /** Kampanya izni onay metnini bu sayfaya bağlar. Boş bırakılırsa metin bağlantısız düz yazı olarak görünür. */
  marketingLink?: IkasNavigationLink | null;
  /** Bölümün arka plan rengi. Boş bırakılırsa temanın varsayılan arka planı kullanılır. */
  backgroundColor?: string;
  /** Ad alanı boşken içinde soluk olarak görünen örnek isim. */
  firstNamePlaceholder?: string;
  /** Soyad alanı boşken içinde soluk olarak görünen örnek soyisim. */
  lastNamePlaceholder?: string;
  /** Şifre alanları boşken içinde soluk olarak görünen örnek işaretler. */
  passwordPlaceholder?: string;
  /** Doğrulama kodu alanı boşken içinde soluk olarak görünen örnek gösterim. */
  codePlaceholder?: string;
  /** Onay metnine tıklanınca açılan sözleşme penceresinin başlığı. */
  agreementTitle?: string;
  /** Üyelik sözleşmesi bağlantısı boşsa onay metni bu metni pencerede açar. Kendi sözleşmenle değiştir. */
  agreementContent?: string;
  /** Sözleşme penceresindeki kapat düğmesinin ekran okuyucu etiketi. */
  closeAriaLabel?: string;
}
