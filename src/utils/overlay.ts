// Overlay plumbing shared by Header's overlays (MenuOverlay, SearchOverlay, CartDrawer) and QuickBuy.
import { useEffect, useRef, useState } from "preact/hooks";
import type { RefObject } from "preact";
import { prefersReducedMotion } from "./hooks";

/**
 * Mount/transition state for an overlay. `mounted` keeps the DOM alive through the exit
 * transition; `shown` flips one frame after mount so CSS transitions run from the start state.
 */
export function usePresence(open: boolean, exitMs = 450) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      let r2 = 0;
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), prefersReducedMotion() ? 0 : exitMs);
    return () => clearTimeout(t);
  }, [open]);
  return { mounted, shown };
}

/*
 * Input modality for script-moved focus. Only Tab counts as keyboard navigation: Escape, typing
 * in a field or Enter after a click leave it on "pointer". Starts on keyboard so focus is never
 * hidden before the first pointer interaction.
 */
let keyboardNav = true;
if (typeof document !== "undefined") {
  document.addEventListener("pointerdown", () => (keyboardNav = false), true);
  document.addEventListener("keydown", (e) => e.key === "Tab" && (keyboardNav = true), true);
}

/**
 * Focuses `el` without scrolling. After a pointer interaction the element is marked
 * `data-focus-quiet` until it blurs (global.css drops the ring): Chrome otherwise paints
 * :focus-visible when focus returns to a trigger after an Escape keypress. Keyboard users keep it.
 */
export function focusQuietly(el?: HTMLElement | null) {
  if (!el?.focus) return;
  if (keyboardNav) {
    el.focus({ preventScroll: true });
    return;
  }
  el.setAttribute("data-focus-quiet", "");
  el.focus({ preventScroll: true, focusVisible: false } as FocusOptions);
  if (document.activeElement === el) el.addEventListener("blur", () => el.removeAttribute("data-focus-quiet"), { once: true });
  else el.removeAttribute("data-focus-quiet");
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * While `active`: moves focus into `ref` (to `initial` when given), keeps Tab inside it and
 * restores focus to the previously focused element when it deactivates (both via focusQuietly).
 */
export function useFocusTrap(ref: RefObject<HTMLElement>, active: boolean, initial?: RefObject<HTMLElement>) {
  const prev = useRef<Element | null>(null);
  useEffect(() => {
    if (!active) return;
    prev.current = document.activeElement;
    const root = ref.current;
    const t = setTimeout(() => {
      const target = initial?.current ?? root?.querySelector<HTMLElement>(FOCUSABLE) ?? root;
      focusQuietly(target);
    }, 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      focusQuietly(prev.current as HTMLElement | null);
    };
  }, [active]);
}

/** Replaces `{key}` tokens in merchant text ("{count} SONUÇ"). */
export const fillText = (tpl: string | undefined, values: Record<string, string | number>) =>
  Object.keys(values).reduce((s, k) => s.split(`{${k}}`).join(String(values[k])), tpl ?? "");
