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
 * Below desktop every card is open and the same size, in a CSS scroll-snap strip (one card per swipe).
 * A click or tap on any card follows its link at every width.
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

  // Desktop: a mouse hover or keyboard focus opens a card. Clicks are never intercepted — every card (open or not)
  // is a plain <a> and follows its link.
  const onPointerOpen = (i: number) => {
    if (window.innerWidth <= BREAKPOINT.tablet) return;
    if (i >= 0 && i !== open) setOpen(i);
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
          onPointerOver={(e) => e.pointerType === "mouse" && onPointerOpen(indexOf(e.target))}
          onFocusIn={(e) => isKeyboardFocus(e.target) && onPointerOpen(indexOf(e.target))}
        >
          <IkasComponentRenderer id="activity-cards" className="act__renderer" components={list} parentProps={props} />
        </div>
      )}
    </section>
  );
}

export default ActivityGrid;
