import { useEffect, useRef, useState } from "preact/hooks";
import {
  IkasProduct,
  IkasProductListSortType,
  Router,
  clearProductListFilters,
  customerStore,
  getCategoryPath,
  getFavoriteProducts,
  getIkasCategoryHref,
  getProductListNextPage,
  getProductListPrevPage,
  getProductListSortOptions,
  getProductVariantFinalPrice,
  getSelectedProductVariant,
  hasCustomer,
  hasProductListAppliedFilters,
  hasProductListNextPage,
  hasProductListPrevPage,
  isProductListSearch,
  setSortType,
  waitForCustomerStoreInit,
  withRoutePrefix,
} from "@ikas/bp-storefront";
import BottomSheet from "../../sub-components/BottomSheet";
import Breadcrumbs, { type BreadcrumbItem } from "../../sub-components/Breadcrumbs";
import Button from "../../sub-components/Button";
import EditorialTile from "../../sub-components/EditorialTile";
import FilterDrawer from "../../sub-components/FilterDrawer";
import { getActiveFilterChips, hasVisibleFilters, type FilterPanelTexts } from "../../sub-components/FilterPanel";
import FilterRail from "../../sub-components/FilterRail";
import { FilterPills } from "../../sub-components/FilterSelected";
import Icon from "../../sub-components/Icon";
import ProductCard from "../../sub-components/ProductCard";
import { cx } from "../../utils/cx";
import { prefersReducedMotion } from "../../utils/hooks";
import { BREAKPOINT, TEXT } from "../../utils/tokens";
import { UI_EVENT, onUi } from "../../utils/ui";
import { Props } from "./types";

type Mode = "category" | "search" | "favorites";
type FavSort = "default" | "price-asc" | "price-desc";
type SortOption = { value: string; label: string; isSelected: boolean };

const finalPrice = (p: IkasProduct) => {
  const v = getSelectedProductVariant(p);
  return v ? (getProductVariantFinalPrice(v) as unknown as number) : 0;
};

/** Desktop filter panel open/closed survives page changes and reloads of the same list. */
const panelKey = () => `ism:plp-filter-open:${window.location.pathname}`;
const readPanelOpen = () => {
  try {
    return window.sessionStorage.getItem(panelKey()) === "1";
  } catch {
    return false;
  }
};
const writePanelOpen = (open: boolean) => {
  try {
    window.sessionStorage.setItem(panelKey(), open ? "1" : "0");
  } catch {
    /* storage blocked — state still works for this view */
  }
};

/**
 * I/Section/ProductList — PLP for category, collection, search and favourites pages (K2-E).
 * Desktop (≥992): 64px sticky FilterRail that expands inline to a 300px panel (grid 4 → 3 cols) ·
 * breadcrumbs · sticky toolbar (I-PLP-01: count, active pills, sort dropdown).
 * Tablet/mobile: toolbar "Filtrele (n)" + "Sırala" opening bottom sheets (M-A filter, sort radio
 * sheet), pills row under it; 3 / 2 columns. ProductCard grid (I-PLP-02) with an optional
 * editorial tile · "load more" with progress (I-PLP-03) · empty / loading / favourites-login states.
 */
export function ProductList(props: Props) {
  const {
    productList,
    pageMode = "category",
    columns = 4,
    showTitle = true,
    inStockText = "Stokta var",
    outOfStockText = "Stokta yok",
    breadcrumbHomeText = "Mağaza",
    breadcrumbAriaLabel = "Sayfa konumu",
    allProductsTitle = "Tüm ürünler",
    searchTitle = "“{query}” için sonuçlar",
    favoritesTitle = "Favorilerin",
    resultsLabel = "ÜRÜN",
    searchResultsLabel = "SONUÇ",
    filterButtonText = "Filtrele",
    hideFiltersText = "Filtreyi gizle",
    showFiltersText = "Filtreyi göster",
    sortLabel = "Sırala",
    sortTitle = "Sırala",
    clearFiltersText = "Filtreleri temizle",
    removeFilterAriaLabel = "Filtreyi kaldır",
    categoryFilterTitle = "Kategori",
    priceMinAriaLabel = "En düşük fiyat",
    priceMaxAriaLabel = "En yüksek fiyat",
    loadMoreText = "Daha fazla göster",
    loadingMoreText = "Yükleniyor…",
    loadPreviousText = "Önceki ürünleri göster",
    emptyTitle = "Burada henüz ürün yok",
    emptyText = "Filtreleri değiştirmeyi ya da başka bir kategoriye bakmayı dene.",
    emptyButtonText = "Tüm ürünler",
    searchEmptyTitle = "“{query}” için sonuç bulunamadı",
    searchEmptyText = "Başka bir kelimeyle aramayı dene.",
    favoritesEmptyText = "Beğendiğin ürünleri kalbe dokunarak buraya ekle.",
    favoritesLoginText = "Favorilerini görmek için giriş yap",
    favoritesLoginSubtext = "Beğendiğin ürünleri kaydet, her cihazdan ulaş.",
    favoritesLoginButtonText = "Giriş yap",
    addToCartAriaLabel = "Sepete ekle",
    favoriteAriaLabel = "Favorilere ekle",
    soldOutText = "Tükendi",
    filterTitle = "Filtrele",
    filterRailText = "FİLTRE",
    selectedFiltersTitle = "Seçili filtreler",
    liveUpdateText = "Sonuçlar anında güncellenir",
    closeAriaLabel = "Kapat",
    drawerClearText = "Temizle",
    applyFiltersText = "{count} ürünü göster",
    favoritesSortDefaultText = "Önerilen",
    favoritesSortPriceAscText = "Fiyat: Düşükten yükseğe",
    favoritesSortPriceDescText = "Fiyat: Yüksekten düşüğe",
    showEditorial = true,
    editorialImage,
    editorialTitle = "Katmanlamanın kuralı",
    editorialText = "Üç katman, tek kural: terlemeden ısın, rüzgârda üşüme.",
    editorialLinkText = "Rehberi oku",
    editorialLink,
    editorialPosition = 4,
    emptyButtonLink,
    backgroundColor,
  } = props;

  const list = productList ?? null;
  const mode: Mode =
    pageMode === "favorites" ? "favorites" : pageMode === "search" || (list && isProductListSearch(list)) ? "search" : "category";

  const barRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelAnim, setPanelAnim] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [favSort, setFavSort] = useState<FavSort>("default");
  const [fav, setFav] = useState<{ status: "loading" | "guest" | "ready"; items: IkasProduct[] }>({ status: "loading", items: [] });

  // Favourites: a fetched snapshot (no store field); re-fetched when the customer changes.
  const customerId = customerStore.customer?.id ?? null;
  useEffect(() => {
    if (mode !== "favorites") return;
    let cancelled = false;
    (async () => {
      await waitForCustomerStoreInit(customerStore);
      if (cancelled) return;
      if (!hasCustomer(customerStore)) {
        setFav({ status: "guest", items: [] });
        return;
      }
      setFav((f) => ({ ...f, status: "loading" }));
      const items = await getFavoriteProducts(customerStore).catch(() => [] as IkasProduct[]);
      if (!cancelled) setFav({ status: "ready", items: items ?? [] });
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, customerId]);

  // Restore the desktop panel state without animating it in.
  useEffect(() => {
    if (readPanelOpen()) setPanelOpen(true);
  }, []);

  const togglePanel = (open: boolean) => {
    setPanelAnim(true);
    setPanelOpen(open);
    writePanelOpen(open);
  };

  const isTouchLayout = () => window.matchMedia(`(max-width: ${BREAKPOINT.tablet}px)`).matches;

  // Any element can open the filters (e.g. a header shortcut): sheet on touch, inline panel on desktop.
  useEffect(
    () =>
      onUi(UI_EVENT.openFilter, () => {
        if (isTouchLayout()) setDrawerOpen(true);
        else togglePanel(true);
      }),
    [],
  );

  // I-PLP-01 · M-18: the toolbar sticks under the header; `is-stuck` swaps in the stuck style.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let raf = 0;
    const check = () => {
      raf = 0;
      const top = parseFloat(getComputedStyle(bar).top) || 0;
      const rect = bar.getBoundingClientRect();
      setStuck(rect.top <= top + 0.5 && window.scrollY > 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mode]);

  const scrollToGrid = () => {
    const el = bodyRef.current;
    if (!el || el.getBoundingClientRect().top >= 0) return;
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  };

  const onLoadMore = async () => {
    if (!list || loadingMore) return;
    setLoadingMore(true);
    try {
      await getProductListNextPage(list);
    } finally {
      setLoadingMore(false);
    }
  };

  // ---- data -----------------------------------------------------------------------------------
  const isFav = mode === "favorites";
  const favItems =
    favSort === "default"
      ? fav.items
      : fav.items.slice().sort((a, b) => (favSort === "price-asc" ? 1 : -1) * (finalPrice(a) - finalPrice(b)));
  const items: IkasProduct[] = isFav ? favItems : list?.data ?? [];
  const keyword = list?.searchKeyword ?? "";
  const category = list?.category ?? null;
  const brand = list?.brand ?? null;
  const total = isFav ? (fav.status === "ready" ? fav.items.length : 0) : list?.count ?? 0;
  const initialLoading = isFav ? fav.status === "loading" : !!list && !list.isInitialized;
  // yükleniyor: the grid dims to 0.4 for any refetch, "load more" included.
  const refreshing = !isFav && !!list?.isLoading;
  const showFilters = !isFav && !!list && hasVisibleFilters(list);
  const applied = !isFav && !!list && hasProductListAppliedFilters(list);
  const chips = !isFav && list ? getActiveFilterChips(list, { inStockText, outOfStockText }) : [];
  // Favourites get no ikas list (no filters, no sort) — the canvas bar's sort is done client-side.
  const sortOptions: SortOption[] = isFav
    ? ([
        ["default", favoritesSortDefaultText],
        ["price-asc", favoritesSortPriceAscText],
        ["price-desc", favoritesSortPriceDescText],
      ] as const)
        .filter(([, label]) => !!label)
        .map(([value, label]) => ({ value, label, isSelected: value === favSort }))
    : list
      ? getProductListSortOptions(list)
      : [];
  const selectedSort = sortOptions.find((o) => o.isSelected) ?? sortOptions[0];
  const onSort = (value: string) => {
    if (isFav) setFavSort(value as FavSort);
    else if (list) setSortType(list, value as IkasProductListSortType);
  };
  const hasSort = sortOptions.length > 1;
  const cols = Math.min(Math.max(Math.round(columns || 4), 2), 4);
  const railOpen = showFilters && panelOpen;
  const gridCols = railOpen ? Math.max(cols - 1, 2) : cols;

  const title =
    mode === "favorites"
      ? favoritesTitle
      : mode === "search"
        ? keyword
          ? searchTitle.replace("{query}", keyword)
          : allProductsTitle
        : category?.name || brand?.name || allProductsTitle;
  const countLabel = `${total} ${mode === "search" ? searchResultsLabel : resultsLabel}`;

  const home: BreadcrumbItem = { label: breadcrumbHomeText, href: withRoutePrefix("/") };
  let crumbs: BreadcrumbItem[] = [home, { label: title }];
  if (mode === "category" && category) {
    const path = getCategoryPath(category);
    const trail: BreadcrumbItem[] = path.map((p) => ({ label: p.name, href: getIkasCategoryHref(p as any) }));
    if (!path.length || path[path.length - 1].id !== category.id) trail.push({ label: category.name });
    crumbs = [home, ...trail];
  }

  const panelTexts: FilterPanelTexts = { categoryFilterTitle, priceMinAriaLabel, priceMaxAriaLabel, resultsLabel, inStockText, outOfStockText };

  // ---- empty states ---------------------------------------------------------------------------
  const isEmpty = !initialLoading && !refreshing && items.length === 0;
  let empty: { title: string; text: string; button: string; href?: string; onClick?: () => void } | null = null;
  if (isEmpty) {
    if (isFav && fav.status === "guest")
      empty = {
        title: favoritesLoginText,
        text: favoritesLoginSubtext,
        button: favoritesLoginButtonText,
        onClick: () => Router.navigateToPage("LOGIN"),
      };
    else if (isFav) empty = { title: emptyTitle, text: favoritesEmptyText, button: emptyButtonText, href: emptyButtonLink?.href };
    else
      empty = {
        title: mode === "search" && keyword ? searchEmptyTitle.replace("{query}", keyword) : emptyTitle,
        text: mode === "search" ? searchEmptyText : emptyText,
        button: emptyButtonText,
        ...(applied && list ? { onClick: () => clearProductListFilters(list) } : { href: emptyButtonLink?.href }),
      };
  }

  const shown = items.length;
  const progress = total > 0 ? Math.min(1, shown / total) : 0;

  // editorial-tile: category lists only, after `editorialPosition` products, image required.
  const edPos = Math.max(0, Math.round(editorialPosition ?? 4));
  const showEd = mode === "category" && showEditorial !== false && !!editorialImage && items.length >= edPos;
  const editorial =
    showEd && editorialImage ? (
      <EditorialTile
        key="editorial"
        className="plp__editorial"
        image={editorialImage}
        title={editorialTitle}
        text={editorialText}
        linkText={editorialLinkText}
        href={editorialLink?.href}
      />
    ) : null;

  const cards = items.map((product, i) => (
    <ProductCard
      key={product.id}
      product={product}
      addToCartAriaLabel={addToCartAriaLabel}
      favoriteAriaLabel={favoriteAriaLabel}
      soldOutText={soldOutText}
      priority={i < gridCols}
      sizes="(max-width: 767px) 50vw, (max-width: 991px) 33vw, 25vw"
      onFavoriteRemove={isFav ? () => setFav((f) => ({ ...f, items: f.items.filter((p) => p.id !== product.id) })) : undefined}
    />
  ));
  if (editorial) cards.splice(edPos, 0, editorial);

  const showBar = isFav || (!!list && (showFilters || hasSort));

  return (
    <section
      className={cx("plp", showFilters && "plp--rail", railOpen && "plp--open")}
      style={{ ...(backgroundColor ? { backgroundColor } : {}), "--plp-cols": cols, "--plp-cols-open": Math.max(cols - 1, 2) } as any}
    >
      <div className="plp__shell">
        {/* filter-rail ↔ filter-panel-inline (desktop) */}
        {showFilters && list && (
          <FilterRail
            productList={list}
            open={panelOpen}
            onToggle={togglePanel}
            animate={panelAnim}
            idPrefix="plp-rail"
            panelTexts={panelTexts}
            onChange={scrollToGrid}
            texts={{
              railText: filterRailText,
              title: filterTitle,
              openAriaLabel: showFiltersText,
              collapseAriaLabel: hideFiltersText,
              selectedTitle: selectedFiltersTitle,
              clearText: clearFiltersText,
              removeAriaLabel: removeFilterAriaLabel,
              liveUpdateText,
            }}
          />
        )}

        <div className="plp__content">
          {/* list-meta-row */}
          <header className={cx("plp__header", !showTitle && "plp__header--crumbs")}>
            <Breadcrumbs items={crumbs} ariaLabel={breadcrumbAriaLabel} className="plp__crumbs" />
            {/* Off when a cover (CollectionHero, its own h1) above already shows the title. */}
            {showTitle && <h1 className={cx("plp__title", TEXT.h2)}>{title}</h1>}
          </header>

          {/* filter-bar · I-PLP-01 · M-18 */}
          {showBar && (
            <div ref={barRef} className={cx("plp__bar", stuck && "is-stuck")}>
              <div className="plp__bar-left">
                {!initialLoading && <span className={cx("plp__count", TEXT.label, "tabular")}>{countLabel}</span>}
                {chips.length > 0 && (
                  <>
                    <span className="plp__divider" aria-hidden="true" />
                    <FilterPills chips={chips} removeAriaLabel={removeFilterAriaLabel} onChange={scrollToGrid} className="plp__bar-pills" />
                  </>
                )}
                {/* touch: filter-button → M-A sheet */}
                {showFilters && (
                  <button
                    type="button"
                    className={cx("plp__fbtn", chips.length > 0 && "plp__fbtn--count")}
                    aria-haspopup="dialog"
                    aria-expanded={drawerOpen}
                    onClick={() => setDrawerOpen(true)}
                  >
                    <Icon name="sliders" size={16} />
                    <span className={cx("plp__fbtn-label", TEXT.ui)}>{filterButtonText}</span>
                    {chips.length > 0 && <span className={cx("plp__badge", TEXT.badge, "tabular")}>{chips.length}</span>}
                  </button>
                )}
              </div>
              {hasSort && (
                <>
                  {/* desktop: "Sırala: Önerilen ▾" over a native select */}
                  <label className="plp__sort">
                    <span className={cx("plp__sort-label", TEXT.ui)} aria-hidden="true">
                      {sortLabel}
                      {selectedSort ? `: ${selectedSort.label}` : ""}
                    </span>
                    <Icon name="chevron-down" size={14} />
                    <select
                      className="plp__sort-select"
                      aria-label={sortLabel}
                      value={selectedSort?.value}
                      onChange={(e) => onSort((e.currentTarget as HTMLSelectElement).value)}
                    >
                      {sortOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  {/* touch: sort-button → sort sheet */}
                  <button
                    type="button"
                    className="plp__sortbtn"
                    aria-haspopup="dialog"
                    aria-expanded={sortOpen}
                    onClick={() => setSortOpen(true)}
                  >
                    <span className={cx("plp__sort-label", TEXT.ui)}>{sortLabel}</span>
                    <Icon name="chevron-down" size={14} />
                  </button>
                </>
              )}
            </div>
          )}

          {/* touch: filter-active-chips — scroll with the content, under the sticky toolbar */}
          {chips.length > 0 && (
            <FilterPills chips={chips} removeAriaLabel={removeFilterAriaLabel} onChange={scrollToGrid} className="plp__pills" />
          )}

          {/* list-body */}
          <div ref={bodyRef} className="plp__body">
            {!isFav && list && hasProductListPrevPage(list) && items.length > 0 && (
              <div className="plp__prev">
                <Button
                  label={list.isLoading ? loadingMoreText : loadPreviousText}
                  variant="outline"
                  size="sm"
                  state={list.isLoading ? "loading" : "idle"}
                  onClick={() => getProductListPrevPage(list)}
                />
              </div>
            )}

            {initialLoading ? (
              /* no skeleton on the canvas: the grid area stays empty until the first page arrives */
              <div className="plp__grid is-refreshing" aria-busy="true" aria-label={loadingMoreText} />
            ) : empty ? (
              /* list-empty */
              <div className="plp__empty">
                <h2 className={cx("plp__empty-title", TEXT.h3)}>{empty.title}</h2>
                {empty.text && <p className={cx("plp__empty-text", TEXT.body)}>{empty.text}</p>}
                {empty.button && (empty.href || empty.onClick) && (
                  <Button label={empty.button} href={empty.href} onClick={empty.onClick ? () => empty?.onClick?.() : undefined} />
                )}
              </div>
            ) : (
              /* list-grid · I-PLP-02 · M-01: grid dims to 0.4 while a filter refetch runs */
              <div className={cx("plp__grid", refreshing && "is-refreshing")} aria-busy={refreshing || undefined}>
                {cards}
              </div>
            )}

            {/* list-pagination */}
            {!isFav && list && !initialLoading && shown > 0 && total > 0 && (
              <div className="plp__pagination">
                <span className={cx("plp__progress", TEXT.label, "tabular")}>{`${shown} / ${total}`}</span>
                <span className="plp__progress-bar" aria-hidden="true">
                  <span className="plp__progress-fill" style={{ transform: `scaleX(${progress})` }} />
                </span>
                {hasProductListNextPage(list) && (
                  /* load-more-button · I-PLP-03 · M-11 via Button */
                  <Button
                    label={loadingMore ? loadingMoreText : loadMoreText}
                    variant="outline"
                    state={loadingMore ? "loading" : "idle"}
                    onClick={onLoadMore}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* M-A filter sheet (tablet/mobile) */}
      {showFilters && list && (
        <FilterDrawer
          productList={list}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          idPrefix="plp-drawer"
          panelTexts={panelTexts}
          texts={{
            filterTitle,
            closeAriaLabel,
            clearText: drawerClearText,
            applyText: applyFiltersText,
            loadingText: loadingMoreText,
            selectedTitle: selectedFiltersTitle,
            liveUpdateText,
            removeAriaLabel: removeFilterAriaLabel,
          }}
        />
      )}

      {/* sort sheet (tablet/mobile) — selection applies at once and closes */}
      {hasSort && (
        <BottomSheet
          open={sortOpen}
          onClose={() => setSortOpen(false)}
          closeAbove={BREAKPOINT.tablet}
          titleId="plp-sort-title"
          title={sortTitle}
          closeAriaLabel={closeAriaLabel}
          className="plp-sort"
        >
          <div className="plp-sort__list" role="radiogroup" aria-labelledby="plp-sort-title">
            {sortOptions.map((o) => {
              const on = o.value === selectedSort?.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  className={cx("plp-sort__row", on && "plp-sort__row--on")}
                  onClick={() => {
                    onSort(o.value);
                    setSortOpen(false);
                  }}
                >
                  <span className={cx("plp-sort__label", TEXT.ui)}>{o.label}</span>
                  <span className="plp-sort__radio" aria-hidden="true">
                    {on && <Icon name="check" size={12} />}
                  </span>
                </button>
              );
            })}
          </div>
        </BottomSheet>
      )}
    </section>
  );
}

export default ProductList;
