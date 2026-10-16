import { useId } from "preact/hooks";
import { normalizeSvg } from "@ikas/bp-storefront";
import { cx } from "../../utils/cx";
import { TEXT } from "../../utils/tokens";
import { Props } from "./types";

/** I/Section/Footer › footer-service — line icon in a 40px ring + two-line mono text (care-label row). */
export function FooterService({ icon, text = "1.500 TL ÜZERİ\nÜCRETSİZ KARGO" }: Props) {
  const uid = useId();
  const svg = icon ? normalizeSvg(icon, { idPrefix: `fsv-${uid}`, color: "currentColor" }) : "";
  if (!svg && !text) return null;
  return (
    <div className="fsv">
      {svg && <span className="fsv__icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />}
      {text && <p className={cx("fsv__text", TEXT.label)}>{text}</p>}
    </div>
  );
}

export default FooterService;
