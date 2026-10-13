// This file is auto-generated — do not edit manually.
export interface Props {
  /** Hesap bölümünün arka plan rengi. Boş bırakılırsa temanın varsayılan arka planı kullanılır. */
  backgroundColor?: string;
  /** Sayfa başlığında müşterinin adından önce görünen selamlama. Boş bırakılırsa yalnızca ad gösterilir. */
  greetingText?: string;
  /** Hesap menüsündeki kişisel bilgiler sekmesinin ve panel başlığının metni. Boş bırakılırsa sekme gizlenir. */
  infoTabText?: string;
  /** Hesap menüsündeki siparişler sekmesinin ve sipariş listesi başlığının metni. Boş bırakılırsa sekme gizlenir. */
  ordersTabText?: string;
  /** Hesap menüsündeki adresler sekmesinin ve adres paneli başlığının metni. Boş bırakılırsa sekme gizlenir. */
  addressesTabText?: string;
  /** Favori ürünler sayfasına götüren menü sekmesinin metni. Boş bırakılırsa sekme gizlenir. */
  favoritesTabText?: string;
  /** Menünün altındaki hesap ayarları bağlantısının ve ayarlar paneli başlığının metni. Boş bırakılırsa gizlenir. */
  settingsTabText?: string;
  /** Menünün altındaki oturumu kapatan bağlantının metni. Boş bırakılırsa çıkış bağlantısı gizlenir. */
  logoutText?: string;
  /** Hesap menüsünün ekran okuyucular için erişilebilirlik etiketi; sayfada görünmez. */
  tabsAriaLabel?: string;
  /** Bilgilerim panelindeki ad alanının üstünde görünen etiket. */
  firstNameLabel?: string;
  /** Bilgilerim panelindeki soyad alanının üstünde görünen etiket. */
  lastNameLabel?: string;
  /** Bilgilerim panelindeki, değiştirilemeyen e-posta alanının etiketi. */
  emailLabel?: string;
  /** Bilgilerim ve hesap ayarları panellerindeki telefon alanının etiketi. */
  phoneLabel?: string;
  /** Bilgilerim panelinde değişiklikleri kaydeden düğmenin metni. */
  saveText?: string;
  /** Kaydet düğmesine basıldıktan sonra işlem sürerken düğmede görünen metin. */
  savingText?: string;
  /** Bilgiler veya hesap ayarları başarıyla kaydedildiğinde gösterilen onay mesajı. */
  savedText?: string;
  /** Sipariş tablosunun sütun başlıkları; sipariş, tarih, durum ve tutar sırasıyla virgülle ayrılarak yazılır. */
  ordersColumnLabels?: string;
  /** Müşterinin hiç siparişi yoksa siparişler panelinde gösterilen metin. */
  ordersEmptyText?: string;
  /** Sipariş listesi boşken gösterilen, ana sayfaya götüren bağlantının metni. Boş bırakılırsa gizlenir. */
  shopText?: string;
  /** Siparişler yüklenemediğinde siparişler panelinde gösterilen hata metni. */
  errorText?: string;
  /** Sipariş yükleme hatasında siparişleri yeniden çeken düğmenin metni. Boş bırakılırsa gizlenir. */
  retryText?: string;
  /** Sipariş detay sayfasında sipariş numarasının yanında görünen başlık. */
  orderDetailTitle?: string;
  /** Sipariş detayındaki her kargo paketinin başlığı; {n} yerine paket sırası yazılır. */
  packageTitleText?: string;
  /** Sipariş detayındaki paket kartında kargo firması adının yanındaki etiket. */
  cargoLabel?: string;
  /** Sipariş detayındaki paket kartında kargo takip numarasının yanındaki etiket. */
  trackingLabel?: string;
  /** Takip numarasını panoya kopyalayan simge düğmesinin ekran okuyucu etiketi. */
  copyAriaLabel?: string;
  /** Takip numarası kopyalandıktan sonra kısa süreliğine görünen onay metni. */
  copiedText?: string;
  /** Sipariş detayında her ürünün adet bilgisi; {count} yerine ürün adedi yazılır. */
  quantityText?: string;
  /** Sipariş detayındaki teslimat adresi kartının başlığı. */
  shippingAddressLabel?: string;
  /** Sipariş detayındaki fatura adresi kartının başlığı. */
  billingAddressLabel?: string;
  /** Sipariş detayında ödeme yöntemi bilgisinin yanındaki etiket. */
  paymentLabel?: string;
  /** Taksitli ödemelerde ödeme bilgisine eklenen metin; {count} yerine taksit sayısı yazılır. */
  installmentText?: string;
  /** Sipariş detayındaki tutar özetinde ara toplam satırının etiketi. */
  subtotalLabel?: string;
  /** Sipariş detayındaki tutar özetinde kargo ücreti satırının etiketi. */
  shippingLabel?: string;
  /** Siparişte kargo ücretsizse kargo satırında tutar yerine görünen metin. */
  freeShippingText?: string;
  /** Sipariş detayındaki tutar özetinde genel toplam satırının etiketi. */
  totalLabel?: string;
  /** İade edilebilir siparişlerin detayında iade formunu açan düğmenin metni. Boş bırakılırsa düğme gizlenir. */
  returnButtonText?: string;
  /** Açılan sipariş bulunamadığında sipariş detay panelinde gösterilen metin. */
  orderNotFoundText?: string;
  /** Sipariş detayında açılan iade talebi formunun başlığı. Boş bırakılırsa gizlenir. */
  returnTitle?: string;
  /** İade formunun başlığı altında müşteriye yol gösteren kısa açıklama. Boş bırakılırsa gizlenir. */
  returnIntroText?: string;
  /** İade formundaki iade nedeni alanının etiketi. Boş bırakılırsa neden alanı gizlenir. */
  returnReasonLabel?: string;
  /** İade formunun altında, seçilen ürünler için iade talebini gönderen düğmenin metni. */
  returnSubmitText?: string;
  /** İade talebi gönderilirken gönder düğmesinde görünen metin. */
  returnSubmittingText?: string;
  /** İade talebi başarıyla iletildiğinde formun altında gösterilen mesaj. */
  returnSuccessText?: string;
  /** İade talebi gönderilemediğinde formun altında gösterilen hata mesajı. */
  returnErrorText?: string;
  /** Siparişte iade edilebilecek ürün kalmadığında iade formunda gösterilen metin. */
  returnEmptyText?: string;
  /** İade formunda ürün adedini azaltan düğmenin ekran okuyucu etiketi. */
  decreaseAriaLabel?: string;
  /** İade formunda ürün adedini artıran düğmenin ekran okuyucu etiketi. */
  increaseAriaLabel?: string;
  /** Müşterinin kayıtlı adresi yoksa adresler panelinde gösterilen metin. */
  addressesEmptyText?: string;
  /** Adresler panelinde yeni adres formunu açan düğmenin metni. Boş bırakılırsa düğme gizlenir. */
  addAddressText?: string;
  /** Varsayılan adres kartının üzerinde görünen rozet metni. Boş bırakılırsa rozet gizlenir. */
  defaultBadgeText?: string;
  /** Adres kartında adresi düzenleme formunu açan bağlantının metni. Boş bırakılırsa gizlenir. */
  editText?: string;
  /** Adres kartındaki sil bağlantısının ve silme onayındaki düğmenin metni. Boş bırakılırsa gizlenir. */
  deleteText?: string;
  /** Adres silinirken onay düğmesinde görünen metin. */
  deletingText?: string;
  /** Varsayılan olmayan adres kartlarında adresi varsayılan yapan bağlantının metni. Boş bırakılırsa gizlenir. */
  makeDefaultText?: string;
  /** Adres silinmeden önce kartta gösterilen onay sorusu. */
  confirmDeleteText?: string;
  /** Adres silme, adres formu ve hesap silme onayındaki vazgeç düğmesinin metni. */
  cancelText?: string;
  /** Yeni adres eklenirken açılan formun başlığı. */
  addressFormTitle?: string;
  /** Kayıtlı bir adres düzenlenirken açılan formun başlığı. */
  addressEditTitle?: string;
  /** Yeni adres ve adres düzenleme formunun altında adresi kaydeden düğmenin metni. */
  addressSaveText?: string;
  /** Adres kaydedilirken form düğmesinde görünen metin. */
  addressSavingText?: string;
  /** Adres formunda kurumsal fatura alanlarını açan onay kutusunun metni. Boş bırakılırsa seçenek gizlenir. */
  corporateText?: string;
  /** Adres formunda adresi varsayılan teslimat adresi yapan onay kutusunun metni. Boş bırakılırsa gizlenir. */
  defaultAddressText?: string;
  /** Hesap ayarlarında e-posta ve SMS ile kampanya bildirimi iznini veren onay kutusunun metni. */
  marketingText?: string;
  /** Hesap ayarlarında kişisel verilerin dışa aktarılmasını anlatan kısa açıklama. */
  exportDataText?: string;
  /** Kişisel verilerin bir kopyasını e-postaya gönderten düğmenin metni. Boş bırakılırsa düğme gizlenir. */
  exportButtonText?: string;
  /** Veri dışa aktarma isteği işlenirken düğmede görünen metin. */
  exportingText?: string;
  /** Veri kopyası başarıyla gönderildiğinde hesap ayarlarında gösterilen mesaj. */
  exportSuccessText?: string;
  /** Hesap ayarlarında hesap silmenin sonuçlarını anlatan uyarı metni. */
  deleteAccountText?: string;
  /** Hesap silme onayını açan düğmenin metni. Boş bırakılırsa hesap silme düğmesi gizlenir. */
  deleteAccountButtonText?: string;
  /** Hesap silme onay alanının başlığında sorulan soru. Boş bırakılırsa gizlenir. */
  accountDeleteTitle?: string;
  /** Hesap silme onayında başlığın altında görünen, şifre girilmesini isteyen açıklama. */
  accountDeleteConfirmText?: string;
  /** Hesap silme onayında istenen şifre alanının etiketi. */
  passwordLabel?: string;
  /** Şifre alanındaki şifreyi gösteren göz düğmesinin ekran okuyucu etiketi. */
  showPasswordLabel?: string;
  /** Şifre alanındaki şifreyi gizleyen göz düğmesinin ekran okuyucu etiketi. */
  hidePasswordLabel?: string;
  /** Hesabı kalıcı olarak silen son onay düğmesinin metni. */
  accountDeleteFinalText?: string;
  /** Hesap silme işlemi sürerken son onay düğmesinde görünen metin. */
  accountDeletingText?: string;
  /** Kaydetme, silme veya dışa aktarma gibi işlemler başarısız olduğunda gösterilen genel hata mesajı. */
  actionErrorText?: string;
  /** Hesap panelleri yüklenirken ekran okuyucular için okunan yükleniyor metni. */
  loadingText?: string;
}
