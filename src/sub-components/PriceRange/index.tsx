import { useEffect, useRef, useState } from "preact/hooks";
import { cx } from "../../utils/cx";
import { TEXT } from "../../utils/tokens";

export interface PriceRangeValue {
  /** null = bound (no lower limit chosen). */
  min: number | null;
  max: number | null;
}

export interface PriceRangeProps {
  /** Bounds of the slider (e.g. the filter's min/max price). */
  min: number;
  max: number;
  /** Chosen values; null/undefined = not entered (placeholder shows the bound). */
  valueMin?: number | null;
  valueMax?: number | null;
  step?: number;
  /** Display formatter, e.g. (n) => formatCurrency(n, currencyCode, symbol). Default: plain number. */
  formatValue?: (n: number) => string;
  minAriaLabel: string;
  maxAriaLabel: string;
  showSlider?: boolean;
  disabled?: boolean;
  /** Committed on blur / Enter / slider release (keyboard steps: after a short pause). Values equal to the bounds are sent as null. */
  onChange?: (value: PriceRangeValue) => void;
  /** Live while dragging the slider. */
  onInput?: (value: PriceRangeValue) => void;
  idPrefix?: string;
  className?: string;
}

const clamp = (n: number, a: number, b: number) => Math.min(Math.max(n, a), b);

/** Keyboard / assistive-tech slider steps settle for this long before they are committed. */
const KEY_COMMIT_DELAY = 400;

/** Accepts "5.000", "5.000,50", "750 TL" → number (tr-TR grouping). */
function parseAmount(text: string): number | null {
  const cleaned = text.replace(/[^\d,]/g, "").replace(",", ".");
  if (!cleaned) return null;
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

/**
 * I/Sub/PriceRange — two 40px boxes (min – max) over a 2px track with a filled span and two 16px
 * thumbs. "değer girilmiş": entered values switch from muted (bound placeholder) to text colour.
 */
export default function PriceRange({
  min,
  max,
  valueMin,
  valueMax,
  step = 1,
  formatValue = (n) => String(n),
  minAriaLabel,
  maxAriaLabel,
  showSlider = true,
  disabled,
  onChange,
  onInput,
  idPrefix = "prange",
  className,
}: PriceRangeProps) {
  const lo0 = valueMin ?? min;
  const hi0 = valueMax ?? max;
  const [lo, setLo] = useState(lo0);
  const [hi, setHi] = useState(hi0);
  const [loText, setLoText] = useState<string | null>(null);
  const [hiText, setHiText] = useState<string | null>(null);
  // Thumb held by a pointer: the drag stays local and is committed once, on release.
  const held = useRef(false);
  // Latest thumb values (pointer/change handlers run outside render) and the last committed pair.
  const live = useRef({ lo, hi });
  const committed = useRef({ lo: lo0, hi: hi0 });
  const keyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loRangeRef = useRef<HTMLInputElement>(null);
  const hiRangeRef = useRef<HTMLInputElement>(null);

  // Follow the applied filter, but never yank a thumb the user is holding (list refreshes re-render us).
  useEffect(() => {
    committed.current = { ...committed.current, lo: lo0 };
    if (held.current) return;
    live.current.lo = lo0;
    setLo(lo0);
  }, [lo0]);
  useEffect(() => {
    committed.current = { ...committed.current, hi: hi0 };
    if (held.current) return;
    live.current.hi = hi0;
    setHi(hi0);
  }, [hi0]);

  const span = max - min || 1;
  const toValue = (a: number, b: number): PriceRangeValue => ({
    min: a <= min ? null : a,
    max: b >= max ? null : b,
  });

  const commit = (a: number, b: number) => {
    const na = clamp(Math.min(a, b), min, max);
    const nb = clamp(Math.max(a, b), min, max);
    live.current = { lo: na, hi: nb };
    setLo(na);
    setHi(nb);
    if (na === committed.current.lo && nb === committed.current.hi) return;
    committed.current = { lo: na, hi: nb };
    onChange?.(toValue(na, nb));
  };
  const commitLive = () => commit(live.current.lo, live.current.hi);
  const commitLiveRef = useRef(commitLive);
  commitLiveRef.current = commitLive;

  // Pointer drag: commit once when the thumb is let go (anywhere on the page).
  const onRangeDown = () => {
    if (keyTimer.current) clearTimeout(keyTimer.current);
    held.current = true;
    const release = () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      held.current = false;
      commitLiveRef.current();
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
  };

  // Keyboard / assistive tech: the native `change` event fires per step; commit after a pause.
  // Bound natively — the runtime's preact/compat turns an `onChange` prop on a range input into `input`.
  useEffect(() => {
    const onNativeChange = () => {
      if (held.current) return;
      if (keyTimer.current) clearTimeout(keyTimer.current);
      keyTimer.current = setTimeout(() => commitLiveRef.current(), KEY_COMMIT_DELAY);
    };
    const els = [loRangeRef.current, hiRangeRef.current].filter(Boolean) as HTMLInputElement[];
    els.forEach((el) => el.addEventListener("change", onNativeChange));
    return () => {
      els.forEach((el) => el.removeEventListener("change", onNativeChange));
      if (keyTimer.current) clearTimeout(keyTimer.current);
    };
  }, [showSlider, max > min]);

  const commitText = (which: "lo" | "hi") => {
    const text = which === "lo" ? loText : hiText;
    which === "lo" ? setLoText(null) : setHiText(null);
    if (text === null) return;
    const n = parseAmount(text);
    if (which === "lo") commit(n ?? min, hi);
    else commit(lo, n ?? max);
  };

  const enteredLo = lo > min;
  const enteredHi = hi < max;
  const shownLo = loText ?? (enteredLo ? formatValue(lo) : "");
  const shownHi = hiText ?? (enteredHi ? formatValue(hi) : "");

  const onKey = (which: "lo" | "hi") => (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitText(which);
    }
  };

  const loPct = ((lo - min) / span) * 100;
  const hiPct = ((hi - min) / span) * 100;

  return (
    <div className={cx("prange", disabled && "prange--disabled", className)}>
      <div className="prange__inputs">
        <input
          id={`${idPrefix}-min`}
          className={cx("prange__box", TEXT.priceSm, "tabular", enteredLo && "prange__box--set")}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          aria-label={minAriaLabel}
          placeholder={formatValue(min)}
          value={shownLo}
          disabled={disabled}
          onFocus={() => setLoText(enteredLo ? String(lo) : "")}
          onInput={(e) => setLoText((e.currentTarget as HTMLInputElement).value)}
          onBlur={() => commitText("lo")}
          onKeyDown={onKey("lo") as any}
        />
        <span className={cx("prange__sep", TEXT.ui)} aria-hidden="true">
          –
        </span>
        <input
          id={`${idPrefix}-max`}
          className={cx("prange__box", TEXT.priceSm, "tabular", enteredHi && "prange__box--set")}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          aria-label={maxAriaLabel}
          placeholder={formatValue(max)}
          value={shownHi}
          disabled={disabled}
          onFocus={() => setHiText(enteredHi ? String(hi) : "")}
          onInput={(e) => setHiText((e.currentTarget as HTMLInputElement).value)}
          onBlur={() => commitText("hi")}
          onKeyDown={onKey("hi") as any}
        />
      </div>
      {showSlider && max > min && (
        <div className="prange__slider" style={{ "--prange-lo": loPct / 100, "--prange-hi": hiPct / 100 } as any}>
          <span className="prange__track" aria-hidden="true" />
          <span className="prange__fill" aria-hidden="true" />
          <input
            ref={loRangeRef}
            className={cx("prange__range", lo >= max && "prange__range--top")}
            type="range"
            min={min}
            max={max}
            step={step}
            value={lo}
            disabled={disabled}
            aria-label={minAriaLabel}
            aria-valuetext={formatValue(lo)}
            onPointerDown={onRangeDown}
            onInput={(e) => {
              const n = Math.min(Number((e.currentTarget as HTMLInputElement).value), live.current.hi);
              (e.currentTarget as HTMLInputElement).value = String(n);
              live.current.lo = n;
              setLo(n);
              onInput?.(toValue(n, live.current.hi));
            }}
          />
          <input
            ref={hiRangeRef}
            className="prange__range"
            type="range"
            min={min}
            max={max}
            step={step}
            value={hi}
            disabled={disabled}
            aria-label={maxAriaLabel}
            aria-valuetext={formatValue(hi)}
            onPointerDown={onRangeDown}
            onInput={(e) => {
              const n = Math.max(Number((e.currentTarget as HTMLInputElement).value), live.current.lo);
              (e.currentTarget as HTMLInputElement).value = String(n);
              live.current.hi = n;
              setHi(n);
              onInput?.(toValue(live.current.lo, n));
            }}
          />
        </div>
      )}
    </div>
  );
}
