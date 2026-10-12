import { useEffect, useRef } from "preact/hooks";
import { IkasProductList } from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { cx } from "../../utils/cx";
import { TEXT } from "../../utils/tokens";
import FilterPanel, { getActiveFilterChips, getSelectedSwatchColors, type FilterPanelTexts } from "../FilterPanel";
import FilterSelected from "../FilterSelected";
import Icon from "../Icon";

export interface FilterRailTexts {
  /** "FİLTRE" — rotated rail label. */
  railText: string;
  /** "Filtrele" — panel heading. */
  title: string;
  /** aria-label of the rail (opens the panel). */
  openAriaLabel: string;
  /** aria-label of the "‹" collapse button. */
  collapseAriaLabel: string;
  selectedTitle: string;
  clearText: string;
  removeAriaLabel: string;
  liveUpdateText: string;
}

interface Props {
  productList: IkasProductList;
  open: boolean;
  onToggle: (open: boolean) => void;
  /** Width transition on (off for the restored state right after hydration). */
  animate: boolean;
  texts: FilterRailTexts;
  panelTexts: FilterPanelTexts;
  idPrefix: string;
  onChange?: () => void;
}

const MAX_DOTS = 3;

/**
 * K2-E desktop filter (≥992): a 64px sticky rail (round sliders button + accent count badge,
 * rotated "FİLTRE", colour dots of the active swatch values) that expands INLINE into a 300px
 * panel — pushes the grid, no scrim; 0.3s ease-standard. Panel: "Filtrele (n)" + ‹ collapse,
 * "Seçili filtreler", accordion groups, live-update note. Filters apply immediately.
 */
const FilterRail = observer(function FilterRail({ productList, open, onToggle, animate, texts, panelTexts, idPrefix, onChange }: Props) {
  const railRef = useRef<HTMLButtonElement>(null);
  const collapseRef = useRef<HTMLButtonElement>(null);
  const prevOpen = useRef(open);

  // Move focus with the toggle (only for user toggles, not the restored state).
  useEffect(() => {
    if (prevOpen.current === open) return;
    prevOpen.current = open;
    if (!animate) return;
    (open ? collapseRef : railRef).current?.focus({ preventScroll: true });
  }, [open]);

  const count = getActiveFilterChips(productList, panelTexts).length;
  const colors = getSelectedSwatchColors(productList).slice(0, MAX_DOTS);
  const panelId = `${idPrefix}-panel`;
  const titleId = `${idPrefix}-title`;

  return (
    <aside className={cx("frail", open && "frail--open", animate && "frail--anim")} aria-labelledby={titleId}>
      <div className="frail__sticky">
        {/* filter-rail */}
        <button
          ref={railRef}
          type="button"
          className="frail__rail"
          aria-label={count > 0 ? `${texts.openAriaLabel} (${count})` : texts.openAriaLabel}
          aria-expanded={false}
          aria-controls={panelId}
          tabIndex={open ? -1 : undefined}
          onClick={() => onToggle(true)}
        >
          <span className="frail__toggle" aria-hidden="true">
            <span className="frail__btn">
              <Icon name="sliders" size={16} />
            </span>
            {count > 0 && <span className={cx("frail__badge", TEXT.badge, "tabular")}>{count}</span>}
          </span>
          <span className={cx("frail__label", TEXT.label)} aria-hidden="true">
            {texts.railText}
          </span>
          {colors.length > 0 && (
            <span className="frail__dots" aria-hidden="true">
              {colors.map((c, i) => (
                <span key={`${c}-${i}`} className="frail__dot" style={{ backgroundColor: c }} />
              ))}
            </span>
          )}
        </button>

        {/* filter-panel-inline */}
        <div id={panelId} className="frail__panel" aria-hidden={!open}>
          <div className="frail__head">
            <h2 id={titleId} className={cx("frail__title", TEXT.h4)}>
              {texts.title}
              {count > 0 && <span className={cx("frail__count", TEXT.ui, "tabular")}>({count})</span>}
            </h2>
            <button
              ref={collapseRef}
              type="button"
              className="frail__collapse"
              aria-label={texts.collapseAriaLabel}
              aria-expanded={true}
              aria-controls={panelId}
              onClick={() => onToggle(false)}
            >
              <Icon name="chevron-left" size={16} />
            </button>
          </div>
          <FilterSelected
            className="frail__selected"
            productList={productList}
            panelTexts={panelTexts}
            onChange={onChange}
            texts={{ title: texts.selectedTitle, clearText: texts.clearText, removeAriaLabel: texts.removeAriaLabel }}
          />
          <FilterPanel
            className={cx(count === 0 && "frail__groups--top")}
            productList={productList}
            texts={panelTexts}
            variant="panel"
            idPrefix={`${idPrefix}-groups`}
            onChange={onChange}
          />
          {texts.liveUpdateText && <p className={cx("frail__note", TEXT.uiSm)}>{texts.liveUpdateText}</p>}
        </div>
      </div>
    </aside>
  );
});

export default FilterRail;
