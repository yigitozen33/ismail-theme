import type { ComponentChildren } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { cx } from "../../utils/cx";
import { useEscape, useScrollLock } from "../../utils/hooks";
import { TEXT } from "../../utils/tokens";
import IconButton from "../IconButton";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Heading content (e.g. "Filtrele" + muted count). */
  title: ComponentChildren;
  titleId: string;
  closeAriaLabel: string;
  children: ComponentChildren;
  /** Sticky bottom bar (e.g. "48 ürünü göster"). */
  footer?: ComponentChildren;
  /** tall: 88% of the viewport (filters) · auto: content height (sort). */
  size?: "tall" | "auto";
  /** Close automatically once the viewport grows past this width (px). */
  closeAbove?: number;
  className?: string;
}

const CLOSE_MS = 300;
/** Drag distance (px) on the handle / header that dismisses the sheet. */
const DRAG_CLOSE = 80;

/**
 * I/Overlay/BottomSheet — M-A sheet: scrim + panel sliding up from the bottom (translateY,
 * 0.3s ease-standard; I-FILT-01), top corners radius-card, grab handle, 56px header with ×.
 * Closes on scrim, ×, Escape or a downward drag from the handle/header. Focus is trapped while open.
 */
export default function BottomSheet({
  open,
  onClose,
  title,
  titleId,
  closeAriaLabel,
  children,
  footer,
  size = "auto",
  closeAbove,
  className,
}: Props) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const drag = useRef<{ y: number; dy: number; id: number } | null>(null);

  useEffect(() => {
    if (open) {
      returnFocus.current = (document.activeElement as HTMLElement) ?? null;
      setMounted(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(raf);
    }
    setShown(false);
    const t = setTimeout(() => {
      setMounted(false);
      returnFocus.current?.focus?.();
    }, CLOSE_MS);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (shown) closeRef.current?.querySelector<HTMLElement>("button")?.focus();
  }, [shown]);

  useEffect(() => {
    if (!open || !closeAbove) return;
    const mq = window.matchMedia(`(min-width: ${closeAbove + 1}px)`);
    const h = () => mq.matches && onClose();
    mq.addEventListener?.("change", h);
    return () => mq.removeEventListener?.("change", h);
  }, [open, closeAbove]);

  useScrollLock(open);
  useEscape(open, onClose);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const els = panelRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const visible = Array.from(els).filter((el) => el.offsetParent !== null);
    if (!visible.length) return;
    const first = visible[0];
    const last = visible[visible.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // Drag-to-dismiss from the grab handle / header (not from its buttons).
  const setOffset = (dy: number | null) => {
    const el = panelRef.current;
    if (!el) return;
    el.style.transform = dy == null ? "" : `translateY(${dy}px)`;
    el.style.transition = dy == null ? "" : "none";
  };
  const onPointerDown = (e: PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    drag.current = { y: e.clientY, dy: 0, id: e.pointerId };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    d.dy = Math.max(0, e.clientY - d.y);
    setOffset(d.dy);
  };
  const onPointerEnd = (e: PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    setOffset(null);
    if (d.dy > DRAG_CLOSE) onClose();
  };

  if (!mounted) return null;

  return (
    <div className={cx("bsheet", `bsheet--${size}`, shown && "bsheet--open", className)}>
      <div className="bsheet__scrim" onClick={onClose} aria-hidden="true" />
      <div ref={panelRef} className="bsheet__panel" role="dialog" aria-modal="true" aria-labelledby={titleId} onKeyDown={onKeyDown as any}>
        <div
          className="bsheet__top"
          onPointerDown={onPointerDown as any}
          onPointerMove={onPointerMove as any}
          onPointerUp={onPointerEnd as any}
          onPointerCancel={onPointerEnd as any}
        >
          <div className="bsheet__handle-wrap" aria-hidden="true">
            <span className="bsheet__handle" />
          </div>
          <div className="bsheet__header">
            <h2 id={titleId} className={cx("bsheet__title", TEXT.h4)}>
              {title}
            </h2>
            <div ref={closeRef}>
              <IconButton icon="x" iconSize={20} ariaLabel={closeAriaLabel} onClick={onClose} />
            </div>
          </div>
        </div>
        <div className="bsheet__body">{children}</div>
        {footer && <div className="bsheet__footer">{footer}</div>}
      </div>
    </div>
  );
}
