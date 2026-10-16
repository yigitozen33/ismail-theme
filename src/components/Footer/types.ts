// This file is auto-generated — do not edit manually.
import type { IkasImage, IkasNavigationLink, IkasImageList } from "@ikas/bp-storefront";

export interface Props {
  /** Footer'ın üstündeki geniş hero görseli; alt kısmına etiket biner. */
  ctaImage?: IkasImage | null;
  /** Hero'nun sol altındaki başlık; satır sonu ile iki satıra bölünebilir. Boş bırakılırsa gizlenir. */
  ctaTitle?: string;
  /** Hero başlığının altındaki düğmenin metni. Boş bırakılırsa düğme gizlenir. */
  ctaButtonText?: string;
  /** Hero düğmesinin yönlendireceği sayfa veya adres. */
  ctaButtonLink?: IkasNavigationLink | null;
  /** Etiketteki e-posta bülteni alanının başlığı. Boş bırakılırsa gizlenir. */
  notifyTitle?: string;
  /** Bülten kutusunda başlığın altında görünen kısa açıklama. Boş bırakılırsa gizlenir. */
  notifyText?: string;
  /** Bülten e-posta alanı boşken içinde görünen ipucu; ekran okuyucu etiketi olarak da kullanılır. */
  notifyPlaceholder?: string;
  /** Bülten alanında e-posta adresini kaydeden oklu düğmenin metni. */
  notifyButtonText?: string;
  /** E-posta kaydı gönderilirken kaydol düğmesinde görünen metin. */
  notifySubmittingText?: string;
  /** E-posta bültene başarıyla kaydedildiğinde formun altında gösterilen mesaj. */
  notifySuccessText?: string;
  /** Girilen e-posta adresi geçersiz olduğunda formun altında gösterilen uyarı. */
  notifyErrorText?: string;
  /** Bülten kaydı beklenmeyen bir nedenle başarısız olduğunda gösterilen hata mesajı. */
  notifyFailureText?: string;
  /** Etikette yan yana dizilen bağlantı sütunları; mobilde açılır kapanır başlıklara dönüşür. Sütun sayısı sınırsızdır, sığmayanlar alt satıra geçer. */
  columns?: any;
  /** Footer'ın en alt satırının ortasında görünen sosyal medya hesap bağlantıları. Eklenmezse alan gizlenir. */
  socialLinks?: any;
  /** Hero'nun sağ altında görünen iletişim bilgisi (ör. telefon ve saatler). Boş bırakılırsa gizlenir. */
  contactText?: string;
  /** İletişim metnine tıklanınca gidilecek adres, örneğin telefon veya iletişim sayfası. Boşsa metin bağlantısız görünür. */
  contactLink?: IkasNavigationLink | null;
  /** En alt satırın sağındaki dil ve para birimi düğmesinde, mağazada seçim yoksa görünen yedek metin. */
  localeText?: string;
  /** Dil ve para birimi panelinde ülke ve para birimi seçeneklerinin başlığı. */
  localeTitle?: string;
  /** Dil ve para birimi panelinde dil seçeneklerinin başlığı. */
  languageTitle?: string;
  /** Footer'ın en alt satırının sağında görünen telif hakkı metni. Boş bırakılırsa gizlenir. */
  copyrightText?: string;
  /** Alt bilgi bölümünün arka plan rengi. Boş bırakılırsa temanın koyu arka planı kullanılır. */
  backgroundColor?: string;
  /** Etiketin sol koçanında harf harf alt alta dizilip yukarıdan aşağı kayan soluk marka adı (mobilde yatay kayar). Boş bırakılırsa alan boş kalır. */
  marqueeText?: string;
  /** Fare kayan marka adının üzerindeyken imleci izleyen kutuda sırayla değişen görseller. Boş bırakılırsa kutu çıkmaz; dokunmatik cihazlarda gösterilmez. */
  marqueeImages?: IkasImageList;
  /** Etiketin üst satırında yan yana dizilen hizmet öğeleri (kargo, iade, teslim, ödeme); mobilde ikişerli sıralanır. */
  services?: any;
  /** Etiketin sol altında görünen destek satırı (ör. telefon numarası). Boş bırakılırsa gizlenir. */
  supportText?: string;
  /** Destek satırının yanındaki oklu bağlantının metni. Boş bırakılırsa bağlantı gizlenir. */
  supportLinkText?: string;
  /** Destek satırındaki oklu bağlantının gideceği sayfa, örneğin iletişim sayfası. */
  supportLink?: IkasNavigationLink | null;
  /** ETBİS kaydından aldığınız karekod görseli; etiketin sağ altında bir kez gösterilir. Boş bırakılırsa gizlenir. */
  etbisImage?: IkasImage | null;
  /** ETBİS kod bloğundaki site doğrulama adresi (etbis.eticaret.gov.tr/sitedogrulama/…). Karekoda tıklanınca yeni sekmede açılır. */
  etbisLink?: IkasNavigationLink | null;
  /** ETBİS karekodunun ekran okuyucu açıklaması. */
  etbisAltText?: string;
  /** Footer'ın en alt satırının solunda görünen kısa bilgi (ör. mağaza çalışma durumu). Boş bırakılırsa gizlenir. */
  statusText?: string;
}
