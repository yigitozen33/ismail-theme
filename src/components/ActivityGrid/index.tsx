import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { IkasComponentRenderer } from "@ikas/bp-storefront";
import ArrowLink from "../../sub-components/ArrowLink";
import SectionHeading from "../../sub-components/SectionHeading";
import { cx } from "../../utils/cx";
import { isKeyboardFocus, prefersReducedMotion, useReveal } from "../../utils/hooks";
import { BREAKPOINT } from "../../utils/tokens";
import { Props } from "./types";

/**
 * I/Section/ActivityGrid — heading + ArrowLink, then a strip of expanding ActivityCard children.
 * The section owns which card is open and writes `data-open` / `--i` onto the child `.acard`s.
 * Desktop: hover/focus opens a card, the last one stays open; the first opens after the entrance.
 * On a touch screen the first tap opens a card, the second follows its link.
 * Tablet: plain horizontal strip. Mobile: snapping strip (JS), the centred card is open.
 */
export function ActivityGrid({ activities, ...props }: Props) {
  const {
    title = "Aktiviteye göre seç",
    subtitle = "Rotanı seç, gerisini birlikte hazırlayalım.",
    linkText = "Tüm aktiviteler",
    link,
    backgroundColor,
  } = props;
  const list = useMemo(
    () => (Array.isArray(activities) ? activities : activities ? [activities] : []).flat().filter(Boolean),
    [activities],
  );
  const rowRef = useRef<HTMLDivElement>(null);
  // I-ACT-03 · I-M-04: curtain entrance once 40% of the strip is visible
  const reveal = useReveal(rowRef, { threshold: 0.4, rootMargin: "0px" });
  const [open, setOpen] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const lockUntil = useRef(0);
  const openRef = useRef(open);
  openRef.current = open;
  const touch = useRef(false);

  const cards = () => Array.from(rowRef.current?.querySelectorAll<HTMLElement>(".acard") ?? []);
  const indexOf = (target: EventTarget | null) => {
    const card = (target as HTMLElement | null)?.closest?.(".acard");
    return card ? cards().indexOf(card as HTMLElement) : -1;
  };

  // Write state onto the child cards; re-applied when the editor re-renders the children.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const apply = () =>
      cards().forEach((el, i) => {
        el.style.setProperty("--i", String(i));
        if (i === open) el.setAttribute("data-open", "");
        else el.removeAttribute("data-open");
      });
    apply();
    if (!ready) setReady(true);
    const mo = new MutationObserver(apply);
    mo.observe(row, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [open, list]);

  // I-ACT-04: the first card opens 0.2s after the entrance has finished (at once without motion).
  useEffect(() => {
    if (open !== null) return;
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      setOpen(0);
      return;
    }
    if (reveal !== "is-inview") return;
    const n = cards().length;
    const t = setTimeout(() => setOpen((o) => (o === null ? 0 : o)), 700 + 80 * Math.max(0, n - 1) + 200);
    return () => clearTimeout(t);
  }, [reveal]);

  // Mobile: only the open card is wide, so card i opens at padding + i × step (closed + gap) whichever card was
  // open before — its centred scroll position is fixed. `.act__snap` markers sit on exactly these positions
  // (the cards themselves resize, so they cannot be snap points).
  const mobileStep = (row: HTMLElement) => {
    const cs = getComputedStyle(row);
    return (parseFloat(cs.getPropertyValue("--act-card")) || 88) + (parseFloat(cs.columnGap) || 0);
  };
  const mobileTarget = (row: HTMLElement, i: number) => {
    const cs = getComputedStyle(row);
    const wide = parseFloat(cs.getPropertyValue("--act-card-open")) || 240;
    const left = parseFloat(cs.paddingLeft) + i * mobileStep(row);
    return Math.min(Math.max(left + wide / 2 - row.clientWidth / 2, 0), row.scrollWidth - row.clientWidth);
  };

  const centreCard = (row: HTMLElement, i: number, lockMs: number) => {
    lockUntil.current = Date.now() + lockMs;
    setOpen(i);
    row.scrollTo({ left: mobileTarget(row, i), behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  // Mobile swipe: when the finger lifts after moving the strip, go as many cards as the finger travelled (at least
  // one) instead of letting momentum fling past several — the first card's neighbour sits only a few px away.
  // Other scrolling (no touch) opens the card the strip comes to rest on.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    let t = 0;
    let gesture: { from: number; x: number; left: number } | null = null;
    const schedule = () => {
      clearTimeout(t);
      t = window.setTimeout(settle, Math.max(120, lockUntil.current - Date.now() + 50));
    };
    const settle = () => {
      const n = cards().length;
      if (!n || gesture || window.innerWidth > BREAKPOINT.mobile) return;
      if (Date.now() < lockUntil.current) return schedule();
      const cur = Math.min(openRef.current ?? 0, n - 1);
      let best = cur;
      let dist = Infinity;
      for (let i = 0; i < n; i++) {
        const d = Math.abs(mobileTarget(row, i) - row.scrollLeft);
        // positions shared at the strip's start: the card nearest the one already open
        if (d < dist - 0.5 || (Math.abs(d - dist) <= 0.5 && Math.abs(i - cur) < Math.abs(best - cur))) {
          dist = d;
          best = i;
        }
      }
      if (best !== openRef.current || dist > 1) centreCard(row, best, 550);
    };
    // iOS keeps the fling's momentum running over a programmatic scroll; overflow: hidden stops it on the spot
    let thaw = 0;
    const unfreeze = () => {
      clearTimeout(thaw);
      row.style.overflowX = "";
    };
    const onTouchStart = (e: TouchEvent) => {
      clearTimeout(t);
      unfreeze();
      gesture = { from: openRef.current ?? 0, x: e.touches[0]?.clientX ?? 0, left: row.scrollLeft };
    };
    const onTouchEnd = (e: TouchEvent) => {
      const g = gesture;
      gesture = null;
      const n = cards().length;
      // a vertical page scroll or a tap leaves the strip where it was
      if (g && n && window.innerWidth <= BREAKPOINT.mobile && Math.abs(row.scrollLeft - g.left) > 2) {
        const dx = (e.changedTouches[0]?.clientX ?? g.x) - g.x;
        const k = Math.max(1, Math.round(Math.abs(dx) / mobileStep(row)));
        const dir = row.scrollLeft > g.left ? 1 : -1;
        row.style.overflowX = "hidden";
        centreCard(row, Math.min(Math.max(g.from + dir * k, 0), n - 1), 700);
        thaw = window.setTimeout(unfreeze, 600);
        return;
      }
      schedule();
    };
    row.addEventListener("scroll", schedule, { passive: true });
    row.addEventListener("touchstart", onTouchStart, { passive: true });
    row.addEventListener("touchend", onTouchEnd, { passive: true });
    row.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      row.removeEventListener("scroll", schedule);
      row.removeEventListener("touchstart", onTouchStart);
      row.removeEventListener("touchend", onTouchEnd);
      row.removeEventListener("touchcancel", onTouchEnd);
      clearTimeout(t);
      unfreeze();
    };
  }, []);

  // Desktop: a mouse hover or keyboard focus opens a card (a touch tap is handled on click).
  const onPointerOpen = (i: number) => {
    if (window.innerWidth <= BREAKPOINT.tablet) return;
    if (i >= 0 && i !== open) setOpen(i);
  };

  // Mobile, and touch screens on desktop: a tap on a closed card opens it instead of following its link.
  const onClickCapture = (e: MouseEvent) => {
    const w = window.innerWidth;
    if (w > BREAKPOINT.mobile && (w <= BREAKPOINT.tablet || !touch.current)) return;
    const i = indexOf(e.target);
    if (i < 0 || i === open) return;
    // the storefront Router follows every <a> click from a window listener and ignores defaultPrevented
    e.preventDefault();
    e.stopPropagation();
    if (w > BREAKPOINT.mobile) setOpen(i);
    else if (rowRef.current) centreCard(rowRef.current, i, 700);
  };

  return (
    <section className="act" style={backgroundColor ? { backgroundColor } : undefined}>
      <div className="act__head">
        {/* I-ACT-01 · M-01 via SectionHeading */}
        <SectionHeading title={title} subtitle={subtitle} align="left" className="act__heading" />
        {/* I-ACT-02 · M-10 via ArrowLink */}
        {linkText && link?.href && <ArrowLink label={linkText} href={link.href} className="act__link" />}
      </div>
      {list.length > 0 && (
        <div
          ref={rowRef}
          className={cx("act__row", reveal, ready && "is-ready", open !== null && "has-open")}
          onPointerDown={(e) => (touch.current = e.pointerType !== "mouse")}
          onPointerOver={(e) => e.pointerType === "mouse" && onPointerOpen(indexOf(e.target))}
          onFocusIn={(e) => isKeyboardFocus(e.target) && onPointerOpen(indexOf(e.target))}
          onClickCapture={onClickCapture}
        >
          <IkasComponentRenderer id="activity-cards" className="act__renderer" components={list} parentProps={props} />
          <span className="act__snaps" aria-hidden="true">
            {list.map((_, i) => (
              <span key={i} className="act__snap" style={{ "--i": i } as any} />
            ))}
          </span>
        </div>
      )}
    </section>
  );
}

export default ActivityGrid;
