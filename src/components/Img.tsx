import type { CSSProperties } from 'react';
import { PHOTOS } from '../data/photos';

const base = import.meta.env.BASE_URL;
export const photoUrl = (id: string, w: number) => `${base}images/${id}-${w}.webp`;

/** Largest generated width ≤ the natural image width (never upscaled in the file). */
export const bestUrl = (id: string) => {
  const p = PHOTOS[id];
  return photoUrl(id, p.widths[p.widths.length > 2 ? p.widths.length - 2 : p.widths.length - 1]);
};

interface Props {
  id: string;
  sizes?: string;
  eager?: boolean;
  position?: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
}

/** Responsive, lazy, CLS-safe image. Uses the real business photography only. */
export default function Img({ id, sizes = '100vw', eager, position, alt, className, style }: Props) {
  const p = PHOTOS[id];
  const srcSet = p.widths.map((w) => `${photoUrl(id, w)} ${w}w`).join(', ');
  const fallback = photoUrl(id, p.widths[p.widths.length > 2 ? 1 : p.widths.length - 1]);
  return (
    <img
      className={className}
      src={fallback}
      srcSet={srcSet}
      sizes={sizes}
      width={p.w}
      height={p.h}
      alt={alt ?? p.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      draggable={false}
      style={{ backgroundColor: p.bg, objectPosition: position, ...style }}
    />
  );
}
