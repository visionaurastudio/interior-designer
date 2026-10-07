import { useCallback, useEffect, useRef, useState } from 'react';
import Img from './Img';
import Lightbox from './Lightbox';
import { ImageReveal, Parallax, Reveal, RevealText } from './Reveal';
import { GALLERY_ORDER, PHOTOS } from '../data/photos';

interface TileProps {
  id: string;
  open: (id: string) => void;
  sizes?: string;
  position?: string;
  className?: string;
  delay?: number;
  from?: 'bottom' | 'left' | 'right';
  ratio?: string;
  parallax?: number;
  label?: boolean;
}

/** One clickable photograph: reveal-in, slow hover zoom, opens the lightbox. */
function Tile({ id, open, sizes = '50vw', position, className = '', delay, from, ratio, parallax, label = true }: TileProps) {
  const p = PHOTOS[id];
  const img = <Img id={id} sizes={sizes} position={position} />;
  return (
    <button
      type="button"
      className={`tile ${className}`}
      style={{ aspectRatio: ratio ?? `${p.w} / ${p.h}` }}
     
      onClick={() => open(id)}
      aria-label={`View larger — ${p.alt}`}
    >
      <ImageReveal className="tile__frame hoverzoom" delay={delay} from={from}>
        {parallax ? <Parallax amount={parallax}>{img}</Parallax> : img}
      </ImageReveal>
      {label && <span className="tile__label">{p.label}</span>}
    </button>
  );
}

function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return; // touch keeps native swipe
      down = true;
      moved.current = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6) {
        moved.current = true;
        el.classList.add('is-dragging');
      }
      el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      down = false;
      el.classList.remove('is-dragging');
      setTimeout(() => (moved.current = false), 0);
    };
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.removeEventListener('scroll', onScroll);
    };
  }, []);

  const by = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.7, behavior: 'smooth' });
  return { ref, moved, progress, by };
}

const STRIP = ['k07', 'k08', 'k09', 'k10', 'k11', 'k13', 'k16'];
const BATH = ['k35', 'k41', 'k38', 'k39', 'k36', 'k42', 'k37', 'k40'];

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const open = useCallback((id: string) => setIndex(GALLERY_ORDER.indexOf(id)), []);
  const close = useCallback(() => setIndex(null), []);
  const strip = useDragScroll();

  return (
    <section id="work" className="gallery" aria-labelledby="gallery-title">
      <div className="container gallery__intro section-top">
        <div>
          <Reveal>
            <p className="eyebrow">Selected Work</p>
          </Reveal>
          <RevealText as="h2" className="display gallery__title" text="Made for _Real _Homes." />
          <span id="gallery-title" hidden>Made for Real Homes</span>
        </div>
        <Reveal delay={0.15} className="gallery__lead">
          <p>
            Kitchens, storage, entrances and steel work.
            Tap any photograph to view it full screen.
          </p>
        </Reveal>
      </div>

      {/* A — featured composition */}
      <div className="container gA">
        <div className="gA__main">
          <Tile id="k01" open={open} sizes="(max-width: 800px) 92vw, 52vw" />
        </div>
        <div className="gA__text">
          <Reveal>
            <p className="meta">Kitchens</p>
            <h3 className="display">Clean lines. <em>Concealed light.</em></h3>
            <p>Handles, hardware and finishes chosen so the kitchen stays calm to look at and easy to live with.</p>
          </Reveal>
        </div>
        <div className="gA__small">
          <Tile id="k34" open={open} sizes="(max-width: 800px) 56vw, 24vw" delay={0.2} from="left" />
        </div>
      </div>

      {/* B — full-bleed moment */}
      <div className="moment">
        <Tile id="k15" open={open} sizes="100vw" ratio="auto" className="moment__tile" parallax={10} position="50% 45%" label={false} />
        <div className="moment__cap">
          <small>Interiors</small>
          <p className="display">Light, finish and <em>proportion.</em></p>
        </div>
      </div>

      {/* C — horizontal strip */}
      <div className="container strip__head">
        <RevealText as="h3" className="display" text="Living _spaces." />
        <div className="strip__arrows">
          <button onClick={() => strip.by(-1)} aria-label="Scroll left">
            <svg width="18" height="10" viewBox="0 0 18 10" aria-hidden="true"><path d="M18 5H2M6 1L2 5l4 4" stroke="currentColor" strokeWidth="1.2" fill="none" /></svg>
          </button>
          <button onClick={() => strip.by(1)} aria-label="Scroll right">
            <svg width="18" height="10" viewBox="0 0 18 10" aria-hidden="true"><path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" fill="none" /></svg>
          </button>
        </div>
      </div>
      <div
        className="strip"
        ref={strip.ref}
       
        onClickCapture={(e) => {
          if (strip.moved.current) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
        tabIndex={-1}
      >
        <div className="strip__track">
          {STRIP.map((id, i) => (
            <div className={`strip__item${i % 2 ? ' is-low' : ''}`} key={id}>
              <Tile id={id} open={open} sizes="(max-width: 700px) 70vw, 30vw" from="right" delay={0.05 * (i % 3)} />
            </div>
          ))}
        </div>
      </div>
      <div className="container">
        <div className="strip__progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${0.12 + strip.progress * 0.88})` }} />
        </div>
      </div>

      {/* D — details */}
      <div className="container gD">
        <div className="gD__text">
          <Reveal>
            <p className="eyebrow">Storage · Detail</p>
          </Reveal>
          <RevealText as="h3" className="display" text="The details that _matter." />
          <Reveal delay={0.15}>
            <p>Divided drawers, smooth pull-outs and well-planned storage. The small things that decide how a kitchen works day to day.</p>
          </Reveal>
        </div>
        <div className="gD__a"><Tile id="k29" open={open} sizes="(max-width: 800px) 70vw, 34vw" /></div>
        <div className="gD__b"><Tile id="k28" open={open} sizes="(max-width: 800px) 46vw, 22vw" delay={0.15} from="left" /></div>
        <div className="gD__c"><Tile id="k31" open={open} sizes="(max-width: 800px) 46vw, 24vw" delay={0.25} from="right" /></div>
      </div>

      {/* E — entrances */}
      <div className="container gE">
        <div className="gE__head">
          <RevealText as="h3" className="display" text="Entrances &amp; _steel work." />
          <Reveal delay={0.1}><p>Doors, gates and fabricated pieces in steel and timber.</p></Reveal>
        </div>
        <div className="gE__doors">
          {['k17', 'k18', 'k19', 'k20'].map((id, i) => (
            <div key={id} className={`gE__door gE__door--${i + 1}`}>
              <Tile id={id} open={open} sizes="(max-width: 800px) 46vw, 23vw" delay={0.08 * i} />
            </div>
          ))}
        </div>
        <div className="gE__outdoor">
          <div className="gE__o1"><Tile id="k24" open={open} sizes="(max-width: 800px) 90vw, 40vw" /></div>
          <div className="gE__o2"><Tile id="k23" open={open} sizes="(max-width: 800px) 60vw, 28vw" delay={0.15} from="left" /></div>
          <div className="gE__o3"><Tile id="k25" open={open} sizes="(max-width: 800px) 60vw, 28vw" delay={0.25} from="right" /></div>
        </div>
      </div>

      {/* F — bathrooms masonry */}
      <div className="container gG">
        <div className="gG__head">
          <p className="eyebrow">More interiors</p>
          <RevealText as="h3" className="display" text="Beyond the _kitchen." />
        </div>
        <div className="gG__cols">
          {BATH.map((id, i) => (
            <div className="gG__item" key={id}>
              <Tile id={id} open={open} sizes="(max-width: 800px) 46vw, 24vw" delay={0.06 * (i % 4)} />
            </div>
          ))}
        </div>
      </div>

      <Lightbox index={index} onClose={close} onIndex={setIndex} />
    </section>
  );
}
