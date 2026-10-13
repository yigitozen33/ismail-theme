// The storefront loads every stylesheet non-blocking (<link media="print" onload="this.media='all'">),
// so the first layout is unstyled and much shorter than the real page. Native loading="lazy" makes
// its distance decision on that layout and starts images that end up far below the fold.

let ready: Promise<void> | null = null;

const pending = (link: HTMLLinkElement) => link.media === "print" || !link.sheet;

/** Resolves (once per page) after every stylesheet link has applied and a frame has been laid out. */
export function whenStylesReady(): Promise<void> {
  if (ready) return ready;
  ready = new Promise<void>((resolve) => {
    const links = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).filter(pending);
    let left = links.length;
    if (!left || document.readyState === "complete") return resolve();
    const done = () => {
      if (--left <= 0) resolve();
    };
    links.forEach((link) => {
      // the inline onload (media → all) runs before this listener
      link.addEventListener("load", done, { once: true });
      link.addEventListener("error", done, { once: true });
    });
    window.addEventListener("load", () => resolve(), { once: true });
  }).then(() => new Promise<void>((r) => requestAnimationFrame(() => r())));
  return ready;
}
