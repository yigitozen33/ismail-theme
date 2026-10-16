import { useEffect, useRef, useState } from "preact/hooks";
import { IkasImage, createMediaSrcset, getDefaultSrc } from "@ikas/bp-storefront";
import { cx } from "../../utils/cx";
import { prefersReducedMotion } from "../../utils/hooks";
import { TEXT } from "../../utils/tokens";

interface Props {
  text?: string;
  images?: IkasImage[];
  className?: string;
}

/** Path the pointer travels before the box shows the next image. */
const STEP_PX = 80;
/** Spring ≈ { duration: 0.5, bounce: 0.2 } (mass 1). */
const STIFFNESS = 170;
const DAMPING = 21;
const TILT = [-3, 2, -2, 3];

/**
 * I/Section/Footer › footer-marquee.
 * I-FTR-05 (I-M-08): `text` as whole words — letters stacked one per line, an accent dot after each word —
 * looping top → bottom, sized so one full word fits the stub, faded at both ends (mobile: one row, left → right).
 * Decorative: aria-hidden; stops under reduced motion.
 * I-FTR-06 (I-M-08): fine pointer over this area only — a 4:5 image box follows the cursor on a spring and
 * shows the next image every STEP_PX of travel. Never on touch or under reduced motion.
 */
export default function BrandMarquee({ text = "İSMAİL", images = [], className }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const sim = useRef({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, px: 0, py: 0, travel: 0, raf: 0, last: 0 });

  // Whole words, each closed by a separator, so the loop always reads as the word (never a random slice).
  const chars = Array.from((text ?? "").replace(/\s+/g, ""));
  const words = chars.length ? Math.max(2, Math.ceil(12 / chars.length)) : 0;
  const imgs = images.filter(Boolean).slice(0, 12);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(fine.matches && !prefersReducedMotion() && imgs.length > 0);
    update();
    fine.addEventListener?.("change", update);
    return () => fine.removeEventListener?.("change", update);
  }, [imgs.length]);

  useEffect(() => () => cancelAnimationFrame(sim.current.raf), []);

  const place = () => {
    const s = sim.current;
    if (boxRef.current) boxRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
  };

  const tick = (now: number) => {
    const s = sim.current;
    const dt = Math.min((now - (s.last || now)) / 1000, 1 / 30);
    s.last = now;
    s.vx += (STIFFNESS * (s.tx - s.x) - DAMPING * s.vx) * dt;
    s.vy += (STIFFNESS * (s.ty - s.y) - DAMPING * s.vy) * dt;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    place();
    const settled = Math.abs(s.tx - s.x) < 0.3 && Math.abs(s.ty - s.y) < 0.3 && Math.abs(s.vx) + Math.abs(s.vy) < 0.3;
    s.raf = settled ? 0 : requestAnimationFrame(tick);
  };

  const local = (e: PointerEvent) => {
    const r = rootRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onEnter = (e: PointerEvent) => {
    if (!enabled || e.pointerType !== "mouse") return;
    const p = local(e);
    const s = sim.current;
    Object.assign(s, { x: p.x, y: p.y, tx: p.x, ty: p.y, px: p.x, py: p.y, vx: 0, vy: 0, travel: 0, last: 0 });
    place();
    setArmed(true);
    setVisible(true);
  };

  const onMove = (e: PointerEvent) => {
    if (!enabled || e.pointerType !== "mouse") return;
    const p = local(e);
    const s = sim.current;
    s.travel += Math.hypot(p.x - s.px, p.y - s.py);
    s.px = p.x;
    s.py = p.y;
    s.tx = p.x;
    s.ty = p.y;
    if (s.travel >= STEP_PX && imgs.length > 1) {
      s.travel = 0;
      setIndex((i) => (i + 1) % imgs.length);
      cardRef.current?.animate([{ transform: "scale(0.96)" }, { transform: "scale(1)" }], {
        duration: 200,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      });
    }
    if (!s.raf) s.raf = requestAnimationFrame(tick);
  };

  const onLeave = () => setVisible(false);

  if (!words) return <div className={cx("bmq", className)} aria-hidden="true" />;

  return (
    <div
      ref={rootRef}
      className={cx("bmq", className)}
      style={{ "--bmq-n": chars.length, "--bmq-words": words }}
      aria-hidden="true"
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="bmq__track">
        <div className="bmq__reel">
          {[0, 1].map((copy) => (
            <div className="bmq__run" key={copy}>
              {Array.from({ length: words }, (_, w) => (
                <div className="bmq__word" key={w}>
                  {chars.map((ch, i) => (
                    <span className={cx("bmq__char", TEXT.display)} key={i}>
                      {ch}
                    </span>
                  ))}
                  <span className="bmq__sep" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {enabled && armed && (
        <div ref={boxRef} className="bmq__box">
          <div ref={cardRef} className={cx("bmq__card", visible && "is-visible")} style={{ rotate: `${TILT[index % TILT.length]}deg` }}>
            {imgs.map((img, i) => (
              <img
                key={i}
                className={cx("bmq__img", i === index && "is-active")}
                src={getDefaultSrc(img)}
                srcSet={createMediaSrcset(img)}
                sizes="180px"
                alt=""
                decoding="async"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
