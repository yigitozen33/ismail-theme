import { IkasProductList, clearProductListFilters } from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { cx } from "../../utils/cx";
import { TEXT } from "../../utils/tokens";
import { getActiveFilterChips, type FilterChip, type FilterPanelTexts } from "../FilterPanel";
import Icon from "../Icon";

interface PillsProps {
  chips: FilterChip[];
  removeAriaLabel: string;
  /** Called after a pill is removed (e.g. scroll the grid into view). */
  onChange?: () => void;
  className?: string;
}

/** filter-chip row — surface pill, value label + × (removes that one value). */
export function FilterPills({ chips, removeAriaLabel, onChange, className }: PillsProps) {
  if (!chips.length) return null;
  return (
    <ul className={cx("fpills", className)}>
      {chips.map((chip) => (
        <li key={chip.key} className="fpills__pill">
          <span className={cx("fpills__label", TEXT.uiSm)}>{chip.label}</span>
          <button
            type="button"
            className="fpills__x"
            aria-label={`${removeAriaLabel}: ${chip.label}`}
            onClick={() => {
              chip.remove();
              onChange?.();
            }}
          >
            <Icon name="x" size={12} />
          </button>
        </li>
      ))}
    </ul>
  );
}

export interface FilterSelectedTexts {
  title: string;
  clearText: string;
  removeAriaLabel: string;
}

interface Props {
  productList: IkasProductList;
  texts: FilterSelectedTexts;
  panelTexts: Pick<FilterPanelTexts, "inStockText" | "outOfStockText">;
  onChange?: () => void;
  className?: string;
}

/** filter-active — "Seçili filtreler" + clear-all link over the active pills; hidden with no filters. */
const FilterSelected = observer(function FilterSelected({ productList, texts, panelTexts, onChange, className }: Props) {
  const chips = getActiveFilterChips(productList, panelTexts);
  if (!chips.length) return null;
  return (
    <div className={cx("fsel", className)}>
      <div className="fsel__head">
        <span className={cx("fsel__title", TEXT.ui)}>{texts.title}</span>
        <button
          type="button"
          className={cx("fsel__clear", TEXT.uiSm)}
          onClick={() => {
            clearProductListFilters(productList);
            onChange?.();
          }}
        >
          {texts.clearText}
        </button>
      </div>
      <FilterPills chips={chips} removeAriaLabel={texts.removeAriaLabel} onChange={onChange} className="fsel__pills" />
    </div>
  );
});

export default FilterSelected;
