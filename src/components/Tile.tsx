import Img from './Img';
import { ImageReveal } from './Reveal';
import { PHOTOS } from '../data/photos';

interface TileProps {
  id: string;
  open: (id: string) => void;
  sizes?: string;
  position?: string;
  className?: string;
  delay?: number;
  from?: 'bottom' | 'left' | 'right';
  ratio?: string;
  label?: boolean;
  caption?: string;
}

/** One clickable photograph: reveal-in, slow hover zoom, opens the lightbox. */
export function Tile({ id, open, sizes = '50vw', position, className = '', delay, from, ratio, label = true, caption }: TileProps) {
  const p = PHOTOS[id];
  return (
    <button
      type="button"
      className={`tile ${className}`}
      style={{ aspectRatio: ratio ?? `${p.w} / ${p.h}` }}
     
      onClick={() => open(id)}
      aria-label={`View larger — ${p.alt}`}
    >
      <ImageReveal className="tile__frame hoverzoom" delay={delay} from={from}>
        <Img id={id} sizes={sizes} position={position} />
      </ImageReveal>
      {label && <span className={`tile__label${caption ? ' tile__label--on' : ''}`}>{caption ?? p.label}</span>}
    </button>
  );
}


