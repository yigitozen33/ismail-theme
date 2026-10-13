import { IkasImage, createMediaSrcset, getDefaultSrc } from "@ikas/bp-storefront";
import { cx } from "../../utils/cx";
import { TEXT, forceScheme } from "../../utils/tokens";
import ArrowLink from "../ArrowLink";
import LazyImg from "../LazyImg";

interface Props {
  image: IkasImage;
  title?: string;
  text?: string;
  linkText?: string;
  href?: string;
  className?: string;
}

/**
 * editorial-tile — merchandising tile inside the product grid (2 columns desktop/tablet, full
 * width mobile): cover image, dark gradient from 30% down, title + one line + inverse ArrowLink.
 */
export default function EditorialTile({ image, title, text, linkText, href, className }: Props) {
  return (
    <article className={cx("edtile", className)}>
      <LazyImg
        className="edtile__img"
        src={getDefaultSrc(image)}
        srcSet={createMediaSrcset(image)}
        sizes="(max-width: 767px) 100vw, 50vw"
        alt={image.altText ?? ""}
        loading="lazy"
        decoding="async"
      />
      <span className="edtile__scrim" aria-hidden="true" />
      <div className={cx("edtile__text", forceScheme("clear"))}>
        {title && <h3 className={cx("edtile__title", TEXT.h3)}>{title}</h3>}
        {text && <p className={cx("edtile__line", TEXT.body)}>{text}</p>}
        {linkText && href && (
          <span className="edtile__link">
            {/* I-CMP-06 · M-10 via ArrowLink */}
            <ArrowLink label={linkText} href={href} />
          </span>
        )}
      </div>
    </article>
  );
}
