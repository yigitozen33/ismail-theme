import { useId, useRef } from "preact/hooks";
import { cx } from "../../utils/cx";
import { useEscape, useScrollLock } from "../../utils/hooks";
import { useFocusTrap, usePresence } from "../../utils/overlay";
import { TEXT } from "../../utils/tokens";
import IconButton from "../IconButton";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  /** RICH_TEXT HTML (agreement, policy). */
  html: string;
  closeAriaLabel: string;
}

/**
 * Rich-text document sheet (membership agreement, policies) — same shell as SizeGuide: scrim +
 * panel sliding up, 720 centred from tablet, full width with grab handle on mobile, body scrolls.
 */
export default function DocSheet({ open, onClose, title, html, closeAriaLabel }: Props) {
  const { mounted, shown } = usePresence(open, 500);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = `doc-${useId()}`;
  useScrollLock(open);
  useEscape(open, onClose);
  useFocusTrap(panelRef, open && mounted);
  if (!mounted) return null;

  return (
    <div className={cx("doc", shown && "is-open")}>
      <div className="doc__scrim" onClick={onClose} aria-hidden="true" />
      <div ref={panelRef} className="doc__panel" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <span className="doc__grabber" aria-hidden="true" />
        <div className="doc__head">
          <h2 id={titleId} className={cx("doc__title", TEXT.h4)}>
            {title}
          </h2>
          <IconButton icon="x" iconSize={20} ariaLabel={closeAriaLabel} onClick={onClose} className="doc__close" />
        </div>
        <div className={cx("doc__body", TEXT.uiSm)} tabIndex={0} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
