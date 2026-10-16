import { useEffect, useRef, useState } from "preact/hooks";
import {
  IkasComponentRenderer,
  createMediaSrcset,
  customerStore,
  getDefaultSrc,
  getNewsletterSubscriptionForm,
  initNewsletterSubscriptionForm,
  setNewsletterSubscriptionFormEmail,
  setNewsletterSubscriptionFormIsMarketingAccepted,
  submitNewsletterSubscriptionForm,
} from "@ikas/bp-storefront";
import ArrowLink from "../../sub-components/ArrowLink";
import BrandMarquee from "../../sub-components/BrandMarquee";
import Button from "../../sub-components/Button";
import Checkbox from "../../sub-components/Checkbox";
import Icon from "../../sub-components/Icon";
import LazyImg from "../../sub-components/LazyImg";
import LocaleSwitcher, { currentLocaleLabel, hasLocaleAlternatives } from "../../sub-components/LocaleSwitcher";
import { cx } from "../../utils/cx";
import { useMounted } from "../../utils/hooks";
import { TEXT, forceScheme } from "../../utils/tokens";
import { UI_EVENT, onUi } from "../../utils/ui";
import { Props } from "./types";

type NotifyStatus = "idle" | "success" | "invalid" | "consent" | "failure";

const toList = (v: any) => (Array.isArray(v) ? v : v ? [v] : []).flat().filter(Boolean);

/** ETBİS block id: the last path segment of the verification address (…/sitedogrulama/<id>). */
const etbisIdOf = (href?: string) => (href ?? "").split(/[?#]/)[0].split("/").filter(Boolean).pop() ?? "";

/**
 * I/Section/Footer — always Mürekkep (ink). Hero (image + scrim, CTA bottom-left, contact bottom-right);
 * a dark hang tag rides over the hero's lower edge: left stub = BrandMarquee, perforation, body with the
 * FooterService row, FooterColumn children + newsletter, support line and the ETBİS badge. Below the tag:
 * status · social · copyright + LocaleSwitcher trigger.
 * Anims: I-FTR-01 (FooterColumn) · I-FTR-02 (SocialLink) · I-FTR-03 (Button) · I-FTR-04 (here) ·
 * I-FTR-05/06 (BrandMarquee, I-M-08).
 */
export function Footer(props: Props) {
  const {
    ctaImage,
    ctaTitle = "Sorun mu var?\nYaz, birlikte çözelim.",
    ctaButtonText = "Bize ulaş",
    ctaButtonLink,
    contactText = "0850 000 00 00 · 09:00–18:00",
    contactLink,
    marqueeText = "İSMAİL",
    marqueeImages,
    services,
    columns,
    notifyTitle = "E-postayla bildirim al",
    notifyText = "Yeni sezon, mağaza etkinlikleri ve indirimler önce sana gelsin.",
    notifyPlaceholder = "E-posta adresin",
    notifyButtonText = "KAYDOL",
    notifySubmittingText = "GÖNDERİLİYOR…",
    notifySuccessText = "Teşekkürler, listeye eklendin.",
    notifyErrorText = "Geçerli bir e-posta adresi gir.",
    notifyFailureText = "Bir sorun oluştu, lütfen tekrar dene.",
    showConsentCheckbox = false,
    consentRequired = true,
    consentText = "Kampanya ve fırsatlardan e-posta ile haberdar olmak istiyorum.",
    consentLink,
    consentErrorText = "Devam etmek için onay kutusunu işaretle.",
    supportText = "SORUN MU VAR? 0850 000 00 00",
    supportLinkText = "BİZE ULAŞ",
    supportLink,
    etbisImage,
    etbisLink,
    etbisAltText = "ETBİS'e kayıtlıdır",
    statusText = "ŞU AN AÇIK · KADIKÖY MAĞAZASI 21:00'E KADAR",
    socialLinks,
    copyrightText = "© 2026 İSMAİL. TÜM HAKLARI SAKLIDIR.",
    localeText = "TL · Türkçe",
    localeTitle = "ÜLKE VE PARA BİRİMİ",
    languageTitle = "DİL",
    overlayOpacity = 100,
    backgroundColor,
  } = props;

  const mounted = useMounted();
  const form = getNewsletterSubscriptionForm(customerStore);
  const [status, setStatus] = useState<NotifyStatus>("idle");
  const [localeOpen, setLocaleOpen] = useState(false);
  const [localeMode, setLocaleMode] = useState<"anchored" | "sheet">("anchored");
  const localeBtnRef = useRef<HTMLButtonElement>(null);
  const consentOn = showConsentCheckbox && !!consentText;

  useEffect(() => {
    initNewsletterSubscriptionForm(form);
  }, []);

  // Other sections (e.g. MenuOverlay) open the switcher as a bottom sheet.
  useEffect(
    () =>
      onUi(UI_EVENT.openLocale, () => {
        setLocaleMode("sheet");
        setLocaleOpen(true);
      }),
    [],
  );
  useEffect(() => onUi(UI_EVENT.closeAll, () => setLocaleOpen(false)), []);

  const closeLocale = () => {
    setLocaleOpen(false);
    if (localeMode === "anchored") localeBtnRef.current?.focus();
  };

  const onNotifySubmit = async (e: Event) => {
    e.preventDefault();
    if (form.isSubmitting) return;
    setStatus("idle");
    // The storefront form never validates isMarketingAccepted, so a required consent is checked here.
    if (consentOn && consentRequired && !form.isMarketingAccepted?.value) {
      setStatus("consent");
      return;
    }
    const ok = await submitNewsletterSubscriptionForm(form);
    if (ok) {
      setStatus("success");
      initNewsletterSubscriptionForm(form);
    } else {
      setStatus(form.email.hasError ? "invalid" : "failure");
    }
  };

  const message =
    status === "success"
      ? notifySuccessText
      : status === "invalid"
        ? notifyErrorText
        : status === "consent"
          ? consentErrorText
          : status === "failure"
            ? notifyFailureText
            : "";
  const serviceList = toList(services);
  const columnList = toList(columns);
  const socialList = toList(socialLinks);
  // A single routing (no other country/currency or language) has nothing to pick: plain text, no button.
  const canSwitch = mounted && hasLocaleAlternatives();
  const localeLabel = (canSwitch && currentLocaleLabel()) || localeText;
  const veil = Math.min(100, Math.max(0, Number(overlayOpacity ?? 100))) / 100;
  const submitting = !!form.isSubmitting;
  const etbisId = etbisIdOf(etbisLink?.href);

  return (
    <footer className={cx("ftr", forceScheme("ink"))} style={backgroundColor ? { backgroundColor } : undefined}>
      <div className="ftr__hero">
        {ctaImage && (
          <LazyImg
            className="ftr__hero-img"
            src={getDefaultSrc(ctaImage)}
            srcSet={createMediaSrcset(ctaImage)}
            sizes="100vw"
            alt={ctaImage.altText ?? ""}
            loading="lazy"
            decoding="async"
          />
        )}
        {/* centre veil under the title/CTA (strength: overlayOpacity) + the fade into the tag */}
        {veil > 0 && <div className="ftr__hero-veil" style={{ opacity: veil }} aria-hidden="true" />}
        <div className="ftr__hero-scrim" aria-hidden="true" />
        <div className="ftr__hero-row">
          <div className="ftr__hero-copy">
            {ctaTitle && <h2 className={cx("ftr__hero-title", TEXT.h2)}>{ctaTitle}</h2>}
            <div className="ftr__hero-actions">
              {ctaButtonText && (
                /* I-FTR-03 · M-11 via Button */
                <Button label={ctaButtonText} href={ctaButtonLink?.href} className="ftr__hero-btn" />
              )}
              {contactText && (
                <ContactText text={contactText} href={contactLink?.href} className="ftr__contact ftr__contact--mobile" />
              )}
            </div>
          </div>
          {contactText && <ContactText text={contactText} href={contactLink?.href} className="ftr__contact ftr__contact--desktop" />}
        </div>
      </div>

      <div className="ftr__tag">
        <div className="ftr__stitch">
          <div className="ftr__stub">
            {/* I-FTR-05 · I-FTR-06 · I-M-08 */}
            <BrandMarquee text={marqueeText} images={marqueeImages?.images} />
          </div>
          <div className="ftr__perf" aria-hidden="true" />

          <div className="ftr__body">
            {serviceList.length > 0 && (
              <div className="ftr__services">
                <IkasComponentRenderer id="footer-services" components={serviceList} parentProps={props} />
              </div>
            )}

            <div className="ftr__main">
              {columnList.length > 0 && (
                /* I-FTR-01 · M-28 via FooterColumn */
                <nav className="ftr__columns">
                  <IkasComponentRenderer id="footer-columns" components={columnList} parentProps={props} />
                </nav>
              )}

              <div className="ftr__notify">
                {notifyTitle && <h3 className={cx("ftr__notify-title", TEXT.h4)}>{notifyTitle}</h3>}
                {notifyText && <p className={cx("ftr__notify-hint", TEXT.uiSm)}>{notifyText}</p>}
                <form className={cx("ftr__notify-form", form.email?.hasError && "is-invalid")} onSubmit={onNotifySubmit} noValidate>
                  <input
                    className={cx("ftr__notify-input", TEXT.ui)}
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    value={form.email?.value ?? ""}
                    placeholder={notifyPlaceholder}
                    aria-label={notifyPlaceholder}
                    aria-invalid={form.email?.hasError ? "true" : undefined}
                    disabled={submitting}
                    onInput={(e) => {
                      setNewsletterSubscriptionFormEmail(form, (e.currentTarget as HTMLInputElement).value);
                      if (status !== "idle") setStatus("idle");
                    }}
                  />
                  {/* I-CMP-06 · M-10 via ArrowLink */}
                  <ArrowLink
                    type="submit"
                    size="label"
                    label={submitting ? notifySubmittingText : notifyButtonText}
                    disabled={submitting}
                    className="ftr__notify-submit"
                  />
                </form>
                {consentOn && (
                  <Checkbox
                    className="ftr__notify-consent"
                    checked={!!form.isMarketingAccepted?.value}
                    onChange={(checked) => {
                      setNewsletterSubscriptionFormIsMarketingAccepted(form, checked);
                      if (status === "consent") setStatus("idle");
                    }}
                    label={
                      consentLink?.href ? (
                        <a href={consentLink.href} target="_blank" rel="noopener noreferrer">
                          {consentText}
                        </a>
                      ) : (
                        consentText
                      )
                    }
                    invalid={status === "consent"}
                    required={consentRequired}
                    disabled={submitting}
                    name="marketing"
                  />
                )}
                {/* I-FTR-04 · M-01: result fades up (y 8 → 0, 0.3s) */}
                <p
                  className={cx(
                    "ftr__notify-msg",
                    TEXT.uiSm,
                    message && "is-visible",
                    status === "success" ? "ftr__notify-msg--ok" : "ftr__notify-msg--err",
                  )}
                  role="status"
                  aria-live="polite"
                >
                  {message}
                </p>
              </div>
            </div>

            <div className="ftr__foot">
              {(supportText || supportLinkText) && (
                <div className="ftr__support">
                  {supportText && <p className={cx("ftr__support-text", TEXT.label)}>{supportText}</p>}
                  {supportLinkText && (
                    /* I-CMP-06 · M-10 via ArrowLink */
                    <ArrowLink size="label" label={supportLinkText} href={supportLink?.href} />
                  )}
                </div>
              )}
              {etbisImage && (
                /* ETBİS code block shape: #ETBIS > #<id> > a > img — only the img values are ours. */
                <div id="ETBIS" className="ftr__etbis">
                  <div id={etbisId || undefined}>
                    {etbisLink?.href ? (
                      <a href={etbisLink.href} target="_blank">
                        <img src={getDefaultSrc(etbisImage)} alt={etbisAltText} className="ftr__etbis-img" loading="lazy" />
                      </a>
                    ) : (
                      <img src={getDefaultSrc(etbisImage)} alt={etbisAltText} className="ftr__etbis-img" loading="lazy" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="ftr__bottom">
        {statusText && <p className={cx("ftr__status", TEXT.label)}>{statusText}</p>}
        {socialList.length > 0 && (
          /* I-FTR-02 · M-28 via SocialLink */
          <div className="ftr__social">
            <IkasComponentRenderer id="footer-social" components={socialList} parentProps={props} />
          </div>
        )}
        <div className="ftr__bottom-end">
          {copyrightText && <p className={cx("ftr__copy", TEXT.label)}>{copyrightText}</p>}
          {localeLabel && (
            <div className="ftr__locale">
              {canSwitch ? (
                <>
                  <button
                    ref={localeBtnRef}
                    type="button"
                    className={cx("ftr__locale-btn", localeOpen && "is-open")}
                    aria-haspopup="dialog"
                    aria-expanded={localeOpen}
                    aria-controls="footer-locale-panel"
                    onClick={() => {
                      setLocaleMode("anchored");
                      setLocaleOpen((o) => !o);
                    }}
                  >
                    <Icon name="globe" size={14} />
                    <span className={TEXT.uiSm}>{localeLabel}</span>
                    <Icon name="chevron-up" size={14} className="ftr__locale-caret" />
                  </button>
                  <LocaleSwitcher
                    id="footer-locale-panel"
                    open={localeOpen}
                    mode={localeMode}
                    onClose={closeLocale}
                    localeTitle={localeTitle}
                    languageTitle={languageTitle}
                  />
                </>
              ) : (
                <p className="ftr__locale-text">
                  <Icon name="globe" size={14} />
                  <span className={TEXT.uiSm}>{localeLabel}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

function ContactText({ text, href, className }: { text: string; href?: string; className: string }) {
  return href ? (
    <a className={cx(className, TEXT.label)} href={href}>
      {text}
    </a>
  ) : (
    <p className={cx(className, TEXT.label)}>{text}</p>
  );
}

export default Footer;
