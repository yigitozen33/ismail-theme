import { IkasProductList } from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { cx } from "../../utils/cx";
import { BREAKPOINT, TEXT } from "../../utils/tokens";
import BottomSheet from "../BottomSheet";
import Button from "../Button";
import FilterPanel, { getActiveFilterChips, type FilterPanelTexts } from "../FilterPanel";
import FilterSelected from "../FilterSelected";

export interface FilterDrawerTexts {
  filterTitle: string;
  closeAriaLabel: string;
  /** "Temizle" — clear-all link in the "Seçili filtreler" block. */
  clearText: string;
  /** "{count} ürünü göster" */
  applyText: string;
  loadingText: string;
  selectedTitle: string;
  liveUpdateText: string;
  removeAriaLabel: string;
}

interface Props {
  productList: IkasProductList;
  open: boolean;
  onClose: () => void;
  texts: FilterDrawerTexts;
  panelTexts: FilterPanelTexts;
  idPrefix: string;
}

/**
 * I/Overlay/FilterDrawer — M-A mobile/tablet filter: 88% bottom sheet with "Filtrele (n)" + ×,
 * the "Seçili filtreler" block, accordion groups and the live-update note. Filters apply at once
 * (ikas refetches on every click); the sticky "{count} ürünü göster" button just closes the sheet.
 * I-FILT-01 via BottomSheet · I-FILT-02 · M-22 via AccordionItem.
 */
const FilterDrawer = observer(function FilterDrawer({ productList, open, onClose, texts, panelTexts, idPrefix }: Props) {
  const loading = productList.isLoading;
  const count = getActiveFilterChips(productList, panelTexts).length;
  const applyLabel = loading ? texts.loadingText : texts.applyText.replace("{count}", String(productList.count ?? 0));

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      size="tall"
      closeAbove={BREAKPOINT.tablet}
      titleId={`${idPrefix}-title`}
      closeAriaLabel={texts.closeAriaLabel}
      className="fdrawer"
      title={
        <>
          {texts.filterTitle}
          {count > 0 && <span className={cx("fdrawer__count", TEXT.ui, "tabular")}>({count})</span>}
        </>
      }
      footer={<Button label={applyLabel} fullWidth state={loading ? "loading" : "idle"} onClick={onClose} />}
    >
      <div className="fdrawer__body">
        <FilterSelected
          productList={productList}
          panelTexts={panelTexts}
          texts={{ title: texts.selectedTitle, clearText: texts.clearText, removeAriaLabel: texts.removeAriaLabel }}
        />
        <FilterPanel productList={productList} texts={panelTexts} variant="sheet" idPrefix={`${idPrefix}-panel`} />
        {texts.liveUpdateText && <p className={cx("fdrawer__note", TEXT.uiSm)}>{texts.liveUpdateText}</p>}
      </div>
    </BottomSheet>
  );
});

export default FilterDrawer;
