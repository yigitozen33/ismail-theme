import { useState } from "preact/hooks";
import {
  IkasApplicableProductFilterValue,
  clearProductListFilter,
  IkasFilterCategory,
  IkasProductFilter,
  IkasProductList,
  formatCurrency,
  getFilterDisplayedValues,
  getIkasFilterThumbnailImage,
  getProductListCurrencyCode,
  getProductListCurrencySymbol,
  getProductListFilterCategories,
  getProductListInitialData,
  handleFilterValueClick,
  isStockFilter,
  handleNumberRangeOptionClick,
  onFilterCategoryClick,
  onNumberRangeFilterChange,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { cx } from "../../utils/cx";
import { TEXT, upperTr } from "../../utils/tokens";
import AccordionItem from "../AccordionItem";
import PriceRange from "../PriceRange";
import VariantChip from "../VariantChip";
import VariantSwatch from "../VariantSwatch";

export interface FilterPanelTexts {
  categoryFilterTitle: string;
  priceMinAriaLabel: string;
  priceMaxAriaLabel: string;
  /** "ÜRÜN" — appended to the swatch value count ("SİYAH · 24 ÜRÜN"). */
  resultsLabel: string;
  /** Labels for the stock filter's raw values ("in-stock" / "out-of-stock"). */
  inStockText: string;
  outOfStockText: string;
}

/** Readable label of a filter value; the stock filter's values arrive as raw keys. */
export function filterValueLabel(filter: IkasProductFilter, name: string, texts: Pick<FilterPanelTexts, "inStockText" | "outOfStockText">) {
  if (!isStockFilter(filter)) return name;
  if (name === "in-stock") return texts.inStockText;
  if (name === "out-of-stock") return texts.outOfStockText;
  return name;
}

interface Props {
  productList: IkasProductList;
  texts: FilterPanelTexts;
  /** panel: desktop inline filter panel · sheet: mobile/tablet bottom sheet (styling only). */
  variant: "panel" | "sheet";
  idPrefix: string;
  /** Called after any filter change (e.g. scroll the grid into view). */
  onChange?: () => void;
  className?: string;
}

type Fmt = (n: number) => string;

/** Range label for NUMBER_RANGE_LIST options and active chips: "%10+", "750 TL – 1.500 TL". */
export function formatRange(fmt: Fmt, from: number, to?: number | null) {
  return to != null ? `${fmt(from)} – ${fmt(to)}` : `${fmt(from)}+`;
}

export function currencyFormatter(list: IkasProductList, filter: IkasProductFilter): Fmt {
  if (filter.type === "PRICE") {
    const code = getProductListCurrencyCode(list);
    const symbol = getProductListCurrencySymbol(list);
    return (n) => formatCurrency(n, code, symbol);
  }
  if (filter.type === "DISCOUNT_RATIO") return (n) => `%${n}`;
  return (n) => String(n);
}

export type FilterChip = { key: string; label: string; remove: () => void };

/** Active filter pills — one per selected value / range / sub-category (search & brand lists). */
export function getActiveFilterChips(
  list: IkasProductList,
  texts: Pick<FilterPanelTexts, "inStockText" | "outOfStockText">,
): FilterChip[] {
  const chips: FilterChip[] = [];
  if (list.pageType !== "CATEGORY") {
    for (const cat of getProductListFilterCategories(list)) {
      if (cat.isSelected) chips.push({ key: `cat-${cat.id}`, label: cat.name, remove: () => onFilterCategoryClick(list, cat, true) });
    }
  }
  for (const f of list.filters ?? []) {
    const fmt = currencyFormatter(list, f);
    if (f.displayType === "NUMBER_RANGE") {
      if (f.numberRange)
        chips.push({
          key: `rng-${f.id}`,
          label: `${f.name}: ${formatRange(fmt, f.numberRange.from, f.numberRange.to)}`,
          remove: () => clearProductListFilter(list, f),
        });
    } else if (f.displayType === "NUMBER_RANGE_LIST") {
      for (const opt of f.numberRangeListOptions ?? []) {
        if (opt.isSelected)
          chips.push({
            key: `opt-${f.id}-${opt.key}`,
            label: `${f.name}: ${formatRange(fmt, opt.from, opt.to)}`,
            remove: () => handleNumberRangeOptionClick(list, f, opt),
          });
      }
    } else {
      for (const v of getFilterDisplayedValues(f)) {
        if (v.isSelected)
          chips.push({
            key: `val-${f.id}-${v.id || v.name}`,
            // canvas pills show the bare value ("Turuncu", "M"); the stock filter's raw keys get labels
            label: filterValueLabel(f, v.name, texts),
            remove: () => handleFilterValueClick(list, f, v),
          });
      }
    }
  }
  return chips;
}

/** Colour codes of the selected swatch values (rail hint dots). */
export function getSelectedSwatchColors(list: IkasProductList): string[] {
  const out: string[] = [];
  for (const f of list.filters ?? []) {
    if (f.displayType !== "SWATCH") continue;
    for (const v of getFilterDisplayedValues(f)) if (v.isSelected && v.colorCode) out.push(v.colorCode);
  }
  return out;
}

/** True when the list has at least one filter group worth drawing. */
export function hasVisibleFilters(list: IkasProductList) {
  if (getProductListFilterCategories(list).length) return true;
  return (list.filters ?? []).some((f) =>
    f.displayType === "NUMBER_RANGE"
      ? !!f.numberRangeLimit && f.numberRangeLimit.to != null && f.numberRangeLimit.from !== f.numberRangeLimit.to
      : f.displayType === "NUMBER_RANGE_LIST"
        ? !!f.numberRangeListOptions?.length
        : f.displayType !== "DATE_RANGE" && getFilterDisplayedValues(f).length > 0,
  );
}

/** filter-swatch-values — VariantSwatch row + mono label of the hovered / selected value. */
const SwatchValues = observer(function SwatchValues({
  list,
  filter,
  values,
  resultsLabel,
  onChange,
}: {
  list: IkasProductList;
  filter: IkasProductFilter;
  values: IkasApplicableProductFilterValue[];
  resultsLabel: string;
  onChange?: () => void;
}) {
  const [hover, setHover] = useState<IkasApplicableProductFilterValue | null>(null);
  const shown = hover ?? values.find((v) => v.isSelected) ?? null;
  return (
    <div className="fpanel__swatches">
      <div className="fpanel__swatch-row" onMouseLeave={() => setHover(null)}>
        {values.map((fv) => (
          <span key={fv.id || fv.name} onMouseEnter={() => setHover(fv)} onFocusCapture={() => setHover(fv)} onBlurCapture={() => setHover(null)}>
            <VariantSwatch
              label={fv.name}
              color={fv.colorCode ?? null}
              image={getIkasFilterThumbnailImage(fv) ?? null}
              selected={fv.isSelected === true}
              soldOut={fv.resultCount === 0}
              onSelect={() => {
                handleFilterValueClick(list, filter, fv);
                onChange?.();
              }}
            />
          </span>
        ))}
      </div>
      {shown && (
        <span className={cx("fpanel__swatch-label", TEXT.label, "tabular")} aria-live="polite">
          {upperTr(shown.name)}
          {shown.resultCount != null ? ` · ${shown.resultCount} ${resultsLabel}` : ""}
        </span>
      )}
    </div>
  );
});

/** filter-range — NUMBER_RANGE through PriceRange (two boxes + slider). */
const RangeValues = observer(function RangeValues({
  list,
  filter,
  texts,
  idPrefix,
  fmt,
  onChange,
}: {
  list: IkasProductList;
  filter: IkasProductFilter;
  texts: FilterPanelTexts;
  idPrefix: string;
  fmt: Fmt;
  onChange?: () => void;
}) {
  const limit = filter.numberRangeLimit;
  if (!limit || limit.to == null || limit.from === limit.to) return null;
  const min = limit.from;
  const max = limit.to;
  return (
    <PriceRange
      min={min}
      max={max}
      valueMin={filter.numberRange?.from ?? null}
      valueMax={filter.numberRange?.to ?? null}
      formatValue={fmt}
      minAriaLabel={texts.priceMinAriaLabel}
      maxAriaLabel={texts.priceMaxAriaLabel}
      idPrefix={idPrefix}
      disabled={list.isLoading}
      onChange={(v) => {
        onNumberRangeFilterChange(filter, v.min == null && v.max == null ? null : { from: v.min ?? min, to: v.max ?? max });
        getProductListInitialData(list);
        onChange?.();
      }}
    />
  );
});

const FilterGroup = observer(function FilterGroup({
  list,
  filter,
  texts,
  defaultOpen,
  idPrefix,
  fmt,
  onChange,
}: {
  list: IkasProductList;
  filter: IkasProductFilter;
  texts: FilterPanelTexts;
  defaultOpen: boolean;
  idPrefix: string;
  fmt: Fmt;
  onChange?: () => void;
}) {
  const values = getFilterDisplayedValues(filter);
  const rangeOptions = filter.numberRangeListOptions ?? [];

  let body = null;
  switch (filter.displayType) {
    case "SWATCH":
      if (values.length)
        body = <SwatchValues list={list} filter={filter} values={values} resultsLabel={texts.resultsLabel} onChange={onChange} />;
      break;
    case "BOX":
      if (values.length)
        body = (
          <div className="fpanel__chips">
            {values.map((fv) => (
              <VariantChip
                key={fv.id || fv.name}
                label={filterValueLabel(filter, fv.name, texts)}
                selected={fv.isSelected === true}
                soldOut={fv.resultCount === 0}
                onSelect={() => {
                  handleFilterValueClick(list, filter, fv);
                  onChange?.();
                }}
              />
            ))}
          </div>
        );
      break;
    case "NUMBER_RANGE_LIST":
      if (rangeOptions.length)
        body = (
          <div className="fpanel__chips fpanel__chips--range">
            {rangeOptions.map((opt) => (
              <VariantChip
                key={opt.key || `${opt.from}-${opt.to}`}
                label={formatRange(fmt, opt.from, opt.to)}
                selected={opt.isSelected}
                onSelect={() => {
                  handleNumberRangeOptionClick(list, filter, opt);
                  onChange?.();
                }}
              />
            ))}
          </div>
        );
      break;
    case "NUMBER_RANGE":
      body = <RangeValues list={list} filter={filter} texts={texts} idPrefix={`${idPrefix}-${filter.id}`} fmt={fmt} onChange={onChange} />;
      break;
    case "LIST":
      // No LIST group on the canvas: drawn like filter-category-list (name + mono count, selected = 600).
      if (values.length)
        body = (
          <ul className="fpanel__cats">
            {values.map((fv) => (
              <li key={fv.id || fv.name}>
                <button
                  type="button"
                  className={cx("fpanel__cat", fv.isSelected && "fpanel__cat--on")}
                  aria-pressed={fv.isSelected === true}
                  disabled={fv.resultCount === 0 && !fv.isSelected}
                  onClick={() => {
                    handleFilterValueClick(list, filter, fv);
                    onChange?.();
                  }}
                >
                  <span className={cx("fpanel__cat-name", TEXT.uiSm)}>{filterValueLabel(filter, fv.name, texts)}</span>
                  {fv.resultCount != null && <span className={cx("fpanel__count", TEXT.label, "tabular")}>{fv.resultCount}</span>}
                </button>
              </li>
            ))}
          </ul>
        );
      break;
    default:
      body = null;
  }
  if (!body) return null;

  return (
    <AccordionItem id={`${idPrefix}-${filter.id}`} title={filter.name} defaultOpen={defaultOpen} headingLevel={3} icon="chevron-down" className="fpanel__group">
      {body}
    </AccordionItem>
  );
});

/** filter-category-list — sub-categories with result counts; selected = semi-bold. */
const CategoryGroup = observer(function CategoryGroup({
  list,
  categories,
  title,
  defaultOpen,
  idPrefix,
  onChange,
}: {
  list: IkasProductList;
  categories: IkasFilterCategory[];
  title: string;
  defaultOpen: boolean;
  idPrefix: string;
  onChange?: () => void;
}) {
  // On a category page a sub-category navigates; elsewhere (search, brand) it filters in place.
  const disableRoute = list.pageType !== "CATEGORY";
  return (
    <AccordionItem id={`${idPrefix}-categories`} title={title} defaultOpen={defaultOpen} headingLevel={3} icon="chevron-down" className="fpanel__group">
      <ul className="fpanel__cats">
        {categories.map((cat) => (
          <li key={cat.id}>
            <button
              type="button"
              className={cx("fpanel__cat", cat.isSelected && "fpanel__cat--on")}
              aria-pressed={cat.isSelected}
              onClick={() => {
                onFilterCategoryClick(list, cat, disableRoute);
                onChange?.();
              }}
            >
              <span className={cx("fpanel__cat-name", TEXT.uiSm)}>{cat.name}</span>
              {cat.resultCount != null && <span className={cx("fpanel__count", TEXT.label, "tabular")}>{cat.resultCount}</span>}
            </button>
          </li>
        ))}
      </ul>
    </AccordionItem>
  );
});

/** Mirrors FilterGroup's switch: does this filter draw a group at all? */
function groupVisible(f: IkasProductFilter) {
  switch (f.displayType) {
    case "SWATCH":
    case "BOX":
    case "LIST":
      return getFilterDisplayedValues(f).length > 0;
    case "NUMBER_RANGE_LIST":
      return !!f.numberRangeListOptions?.length;
    case "NUMBER_RANGE": {
      const l = f.numberRangeLimit;
      return !!l && l.to != null && l.from !== l.to;
    }
    default:
      return false;
  }
}

/** How many accordion groups start open (K2-E: the first two). */
const OPEN_GROUPS = 2;

/**
 * Filter groups shared by the desktop inline panel (FilterRail) and the mobile bottom sheet
 * (FilterDrawer). Every ikas display type is drawn separately: SWATCH → VariantSwatch,
 * BOX → VariantChip, NUMBER_RANGE → PriceRange, NUMBER_RANGE_LIST → range chips,
 * LIST → name/count rows (category-list style); the sub-category list comes last.
 * The first two groups start open, the rest collapsed.
 */
const FilterPanel = observer(function FilterPanel({ productList, texts, variant, idPrefix, onChange, className }: Props) {
  const categories = getProductListFilterCategories(productList);
  const filters = (productList.filters ?? []).filter(groupVisible).sort((a, b) => a.order - b.order);

  return (
    <div className={cx("fpanel", `fpanel--${variant}`, className)}>
      {filters.map((filter, i) => (
        <div key={filter.id} className="fpanel__item" style={{ "--i": i } as any}>
          <FilterGroup
            list={productList}
            filter={filter}
            texts={texts}
            defaultOpen={i < OPEN_GROUPS}
            idPrefix={idPrefix}
            fmt={currencyFormatter(productList, filter)}
            onChange={onChange}
          />
        </div>
      ))}
      {categories.length > 0 && (
        <div className="fpanel__item" style={{ "--i": filters.length } as any}>
          <CategoryGroup
            list={productList}
            categories={categories}
            title={texts.categoryFilterTitle}
            defaultOpen={filters.length < OPEN_GROUPS}
            idPrefix={idPrefix}
            onChange={onChange}
          />
        </div>
      )}
    </div>
  );
});

export default FilterPanel;
