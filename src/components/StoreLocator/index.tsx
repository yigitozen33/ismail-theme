import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { IkasComponentRenderer, IkasImage, createMediaSrcset, getDefaultSrc } from "@ikas/bp-storefront";
import Button from "../../sub-components/Button";
import Icon from "../../sub-components/Icon";
import LazyImg from "../../sub-components/LazyImg";
import Skeleton from "../../sub-components/Skeleton";
import { cx } from "../../utils/cx";
import { BREAKPOINT, TEXT } from "../../utils/tokens";
import { SCOPED_EVENT, onScoped } from "../../utils/ui";
import type { StoreSelectDetail } from "../StoreItem";
import { Props } from "./types";

const toList = (v: any) => (Array.isArray(v) ? v : v ? [v] : []).flat().filter(Boolean);

/**
 * I/Section/StoreLocator — heading row + featured store (image + info card) beside the StoreItem rows.
 * Children are opaque, so the selected StoreItem sends its data with SCOPED_EVENT.storeSelect; the first
 * row is selected initially, hovering / focusing / tapping a row selects it. I-LOC-01 (rows, StoreItem CSS) ·
 * I-LOC-02 (the new feature image fades in over the previous one).
 */
export function StoreLocator(props: Props) {
  const {
    title = "Mağazalarımızı ziyaret et",
    text = "Tüm koleksiyonu dene, bedenini ekibimizle birlikte bul.",
    allStoresText = "Tüm mağazalar",
    allStoresLink,
    directionsText = "Yol tarifi al",
    openNowText = "Şu an açık",
    closedText = "Şu an kapalı",
    selectStoreAriaLabel = "Mağazayı göster",
    stores,
    backgroundColor,
  } = props;
  const rowsRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  const [store, setStore] = useState<StoreSelectDetail | null>(null);
  // version keys the feature image/card so they fade in on change; prev stays underneath while the new one fades.
  const [view, setView] = useState<{ version: number; prev: { version: number; image: IkasImage } | null }>({ version: 0, prev: null });
  const storeRef = useRef<{ index: number; image?: IkasImage | null } | null>(null);
  // Memoised: IkasComponentRenderer re-mounts its children whenever the array identity changes, and every
  // selection re-renders this section — a fresh array here re-mounted the rows in a loop.
  const list = useMemo(() => toList(stores), [stores]);

  useEffect(() => {
    const scope = rowsRef.current;
    if (!scope) return;
    return onScoped<StoreSelectDetail>(scope, SCOPED_EVENT.storeSelect, (d) => {
      if (!d) return;
      const index = Array.from(scope.querySelectorAll(".sitem")).indexOf(d.el);
      scope.dataset.activeIndex = String(index);
      const prev = storeRef.current;
      if (!prev || prev.index !== index || prev.image?.id !== d.image?.id) {
        setView((v) => ({
          version: v.version + 1,
          prev: prev?.image && d.image ? { version: v.version, image: prev.image } : null,
        }));
      }
      storeRef.current = { index, image: d.image };
      setStore(d);
      if (d.scroll && window.innerWidth <= BREAKPOINT.tablet) {
        featureRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }, []);

  const name = store ? [store.name, store.district].filter(Boolean).join(" · ") : "";
  const status = store?.status;

  return (
    <section className="sloc" style={backgroundColor ? { backgroundColor } : undefined}>
      <div className="sloc__head">
        <div className="sloc__head-text">
          {title && <h2 className={cx("sloc__title", TEXT.h2)}>{title}</h2>}
          {text && <p className={cx("sloc__text", TEXT.body)}>{text}</p>}
        </div>
        {allStoresText && allStoresLink?.href && (
          <Button label={allStoresText} href={allStoresLink.href} variant="outline" size="sm" className="sloc__all" />
        )}
      </div>

      {list.length > 0 && (
        <div className="sloc__body">
          {/* I-LOC-02 · M-02: selected store image fades in (0.5s) */}
          <div ref={featureRef} className="sloc__feature" aria-live="polite">
            <div className="sloc__media">
              {store?.image && view.prev && (
                <LazyImg
                  key={view.prev.version}
                  className="sloc__img sloc__img--prev"
                  src={getDefaultSrc(view.prev.image)}
                  srcSet={createMediaSrcset(view.prev.image)}
                  sizes="(max-width: 991px) 100vw, 64vw"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              )}
              {store?.image ? (
                <LazyImg
                  key={view.version}
                  className="sloc__img"
                  src={getDefaultSrc(store.image)}
                  srcSet={createMediaSrcset(store.image)}
                  sizes="(max-width: 991px) 100vw, 64vw"
                  alt={store.image.altText ?? name}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                !store && <Skeleton height="100%" className="sloc__skel" />
              )}
            </div>
            {store && (
              <div key={`card-${view.version}`} className="sloc__card">
                <div className="sloc__card-head">
                  {name && <h3 className={cx("sloc__card-name", TEXT.h4)}>{name}</h3>}
                  {status?.text && (
                    <span className={cx("sloc__pill", `sloc__pill--${status.kind}`)}>
                      <span className="sloc__pill-dot" aria-hidden="true" />
                      <span className={TEXT.badge}>{status.kind === "open" ? openNowText : status.kind === "closed" ? closedText : status.text}</span>
                    </span>
                  )}
                </div>
                {store.address && (
                  <p className="sloc__line">
                    <Icon name="map-pin" size={14} className="sloc__line-icon" />
                    <span className={TEXT.uiSm}>{store.address}</span>
                  </p>
                )}
                {store.hours && (
                  <p className="sloc__line">
                    <Icon name="clock" size={14} className="sloc__line-icon" />
                    <span className={TEXT.uiSm}>{store.hours}</span>
                  </p>
                )}
                {directionsText && store.mapHref && (
                  <div className="sloc__actions">
                    <Button label={directionsText} href={store.mapHref} size="sm" />
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            ref={rowsRef}
            className="sloc__rows"
            data-scope="store-locator"
            data-open-text={openNowText}
            data-closed-text={closedText}
            data-select-label={selectStoreAriaLabel}
          >
            <IkasComponentRenderer id="store-locator-rows" components={list} parentProps={props} />
          </div>
        </div>
      )}
    </section>
  );
}

export default StoreLocator;
