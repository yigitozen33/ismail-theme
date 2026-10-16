import { useEffect, useRef, useState } from "preact/hooks";
import { cx } from "../../utils/cx";
import { prefersReducedMotion } from "../../utils/hooks";
import { TEXT } from "../../utils/tokens";
import Icon from "../Icon";

interface Props {
  label: string;
  href?: string;
  className?: string;
  onClick?: (e: MouseEvent) => void;
  external?: boolean;
  /** Text size: "ui" (default), "uiSm" for the smaller canvas links, "label" for mono label links (12px arrow). */
  size?: "ui" | "uiSm" | "label";
  /** Button variant only (no href): "submit" to send its form. */
  type?: "button" | "submit";
  disabled?: boolean;
}

/**
 * I/Sub/ArrowLink — I-CMP-06 (M-10): underline grows from the left, arrow slides out and a new one slides in.
 * Mouse: on hover. Touch: from the moment the finger lands (undone if it turns into a scroll); a tapped link
 * waits until the motion has played before the page changes, since a tap is far shorter than the motion.
 */
const PRESS_MS = 300;

export default function ArrowLink({ label, href, className, onClick, external, size = "ui", type = "button", disabled }: Props) {
  const [pressed, setPressed] = useState(false);
  const release = useRef(0);
  const touchAt = useRef(0);
  const replay = useRef(false);
  useEffect(() => () => clearTimeout(release.current), []);
  const pressHandlers = {
    onPointerDown: (e: PointerEvent) => {
      touchAt.current = e.pointerType === "mouse" ? 0 : Date.now();
      if (!touchAt.current) return;
      clearTimeout(release.current);
      setPressed(true);
    },
    onPointerUp: () => {
      clearTimeout(release.current);
      release.current = window.setTimeout(() => setPressed(false), 900);
    },
    onPointerCancel: () => {
      clearTimeout(release.current);
      touchAt.current = 0;
      setPressed(false);
    },
  };

  // Touch tap on a plain link: hold the navigation for the rest of the motion, then click again for the Router
  // (it follows <a> clicks from a window listener and ignores defaultPrevented, so stop the first one too).
  const onLinkClick = (e: MouseEvent) => {
    if (replay.current) {
      replay.current = false;
      return;
    }
    const wait = touchAt.current ? PRESS_MS - (Date.now() - touchAt.current) : 0;
    touchAt.current = 0;
    if (wait <= 0 || prefersReducedMotion() || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    e.stopPropagation();
    const link = e.currentTarget as HTMLAnchorElement;
    window.setTimeout(() => {
      replay.current = true;
      link.click();
    }, wait);
  };
  const cls = cx("alink", pressed && "is-pressed", className);
  const inner = (
    <>
      <span className="alink__row">
        <span className={cx("alink__label", TEXT[size])}>{label}</span>
        <span className={cx("alink__arrow", size === "label" && "alink__arrow--sm")} aria-hidden="true">
          <Icon name="arrow-right" size={size === "label" ? 12 : 14} className="alink__arrow-top" />
          <Icon name="arrow-right" size={size === "label" ? 12 : 14} className="alink__arrow-bottom" />
        </span>
      </span>
      <span className="alink__line" aria-hidden="true" />
    </>
  );
  if (href) {
    return (
      <a className={cls} href={href} onClick={(onClick ?? (external ? undefined : onLinkClick)) as any} {...pressHandlers} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} className={cx(cls, "alink--button")} onClick={onClick as any} disabled={disabled} {...pressHandlers}>
      {inner}
    </button>
  );
}
