import type { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import { whenStylesReady } from "../../utils/styles-ready";

type Props = JSX.IntrinsicElements["img"];

/**
 * <img> whose loading="lazy" really waits for the scroll: src/srcset are held back until the
 * storefront's stylesheets have applied, then native lazy loading judges distance on the real
 * layout. Eager images render as a plain <img>.
 */
export default function LazyImg({ src, srcSet, loading, style, ...rest }: Props) {
  const lazy = loading === "lazy";
  const [styled, setStyled] = useState(false);
  const on = !lazy || styled;

  useEffect(() => {
    if (on) return;
    let alive = true;
    whenStylesReady().then(() => alive && setStyled(true));
    return () => {
      alive = false;
    };
  }, [on]);

  // held back: transparent so the alt text does not flash in the image box
  return <img {...rest} loading={loading} src={on ? src : undefined} srcSet={on ? srcSet : undefined} style={on ? style : { opacity: 0 }} />;
}
