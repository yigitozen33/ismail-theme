import { useEffect, useId, useRef, useState } from "preact/hooks";
import { observer } from "@ikas/component-utils";
import { cx } from "../../utils/cx";
import { useEscape } from "../../utils/hooks";
import { TEXT } from "../../utils/tokens";
import Icon from "../Icon";

export type SortMenuOption = { value: string; label: string };

interface Props {
  /** Trigger text, e.g. "Sırala" — the selected option follows as "Sırala: Önerilen". */
  label: string;
  options: SortMenuOption[];
  value?: string;
  onSelect: (value: string) => void;
  className?: string;
}

/**
 * sort + sort-menu (desktop) — "Sırala: Önerilen ▾" opens a listbox under the trigger, right-aligned.
 * I-PLP-03 · M-06: clip 0 → 100% downward. Selecting applies at once and closes; outside click /
 * Escape closes; arrows move between options.
 */
const SortMenu = observer(function SortMenu({ label, options, value, onSelect, className }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = `sort-menu-${useId()}`;
  const selected = options.find((o) => o.value === value) ?? options[0];

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };

  useEscape(open, () => close());

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onDown);
    // focus the selected option once the menu is open
    const raf = requestAnimationFrame(() =>
      (listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]') ?? listRef.current?.querySelector<HTMLElement>("button"))?.focus(),
    );
    return () => {
      document.removeEventListener("pointerdown", onDown);
      cancelAnimationFrame(raf);
    };
  }, [open]);

  const onListKey = (e: KeyboardEvent) => {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>("button") ?? []);
    const i = items.indexOf(document.activeElement as HTMLElement);
    let next = -1;
    if (e.key === "ArrowDown") next = (i + 1) % items.length;
    else if (e.key === "ArrowUp") next = (i - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else if (e.key === "Tab") close(false);
    if (next >= 0) {
      e.preventDefault();
      items[next]?.focus();
    }
  };

  return (
    <div ref={rootRef} className={cx("smenu", open && "smenu--open", className)}>
      <button
        ref={triggerRef}
        type="button"
        className="smenu__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span className={cx("smenu__label", TEXT.ui)}>
          {label}
          {selected ? `: ${selected.label}` : ""}
        </span>
        <Icon name="chevron-down" size={14} className="smenu__caret" />
      </button>
      <div
        ref={listRef}
        id={listId}
        className="smenu__panel"
        role="listbox"
        aria-label={label}
        aria-hidden={!open}
        {...({ inert: !open ? true : undefined } as any)}
        onKeyDown={onListKey}
      >
        {options.map((o) => {
          const on = o.value === selected?.value;
          return (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={on}
              className={cx("smenu__option", on && "smenu__option--on")}
              onClick={() => {
                if (!on) onSelect(o.value);
                close();
              }}
            >
              <span className={cx("smenu__name", TEXT.ui)}>{o.label}</span>
              {on && <Icon name="check" size={16} className="smenu__check" />}
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default SortMenu;
