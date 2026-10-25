import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import Img from './Img';

/** A short, curated set. Hero (c07), About (c09) and the services tile (c02) use other kitchen photos. */
const SLIDES = ['c05', 'c03', 'c12', 'c06', 'c01'];
const INTERVAL = 5200;

/**
 * Automatic kitchen slider using the real kitchen photographs.
 * Fixed aspect ratio (no layout shift), cross-fade, arrows, indicators, swipe, keyboard,
 * pauses on hover/focus/drag, when off-screen or when the tab is hidden, and has a pause button.
 * Autoplay is off by default for visitors who prefer reduced motion.
 */
export default function KitchenSlider() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hold, setHold] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0, 1]));
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.35 });
  const n = SLIDES.length;

  const go = useCallback((to: number) => {
    const next = (to + n) % n;
    setIdx(next);
    setSeen((s) => new Set([...s, next, (next + 1) % n, (next - 1 + n) % n]));
  }, [n]);

  useEffect(() => { if (reduce) setAuto(false); }, [reduce]);
  useEffect(() => {
    const on = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);

  useEffect(() => {
    if (!auto || hold || hidden || !inView) return;
    const t = setTimeout(() => go(idx + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [auto, hold, hidden, inView, idx, go]);

  // swipe
  const start = useRef<{ x: number; y: number } | null>(null);
  const onDown = (e: PointerEvent) => { start.current = { x: e.clientX, y: e.clientY }; setHold(true); };
  const onUp = (e: PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (e.pointerType !== 'mouse') setHold(false);
    if (!s) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2) go(idx + (dx < 0 ? 1 : -1));
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
  };

  return (
    <div
      ref={root}
      className="kslider"
      role="region"
      aria-roledescription="carousel"
      aria-label="Kitchen photographs"
      tabIndex={0}
      onKeyDown={onKey}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >
      <div
        className="kslider__frame"
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => { start.current = null; setHold(false); }}
        aria-live={auto && !hold ? 'off' : 'polite'}
      >
        {SLIDES.map((id, i) => (
          <div
            key={id}
            className={`kslide${i === idx ? ' is-active' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}`}
            aria-hidden={i !== idx}
          >
            {seen.has(i) && (
              <>
                <Img id={id} className="kslide__bg" sizes="20vw" alt="" eager={i === 0} />
                <Img id={id} className="kslide__img" sizes="(max-width: 900px) 100vw, 1100px" eager={i === 0} />
              </>
            )}
          </div>
        ))}

        <button className="kslider__nav kslider__nav--prev" onClick={() => go(idx - 1)} aria-label="Previous photograph">
          <svg width="18" height="10" viewBox="0 0 18 10" aria-hidden="true"><path d="M18 5H2M6 1L2 5l4 4" stroke="currentColor" strokeWidth="1.3" fill="none" /></svg>
        </button>
        <button className="kslider__nav kslider__nav--next" onClick={() => go(idx + 1)} aria-label="Next photograph">
          <svg width="18" height="10" viewBox="0 0 18 10" aria-hidden="true"><path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" fill="none" /></svg>
        </button>
      </div>

      <div className="kslider__bar">
        <p className="kslider__count" aria-hidden="true">{String(idx + 1).padStart(2, '0')} <i>/ {String(n).padStart(2, '0')}</i></p>
        <div className="kslider__dots" role="group" aria-label="Choose a photograph">
          {SLIDES.map((id, i) => (
            <button
              key={id}
              className={`kslider__dot${i === idx ? ' is-on' : ''}`}
              aria-label={`Show photograph ${i + 1}`}
              aria-current={i === idx ? 'true' : undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <button className="kslider__play" onClick={() => setAuto((a) => !a)} aria-pressed={auto} aria-label={auto ? 'Pause automatic slideshow' : 'Play automatic slideshow'}>
          {auto ? (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="1" width="3" height="10" fill="currentColor" /><rect x="7" y="1" width="3" height="10" fill="currentColor" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1l8 5-8 5z" fill="currentColor" /></svg>
          )}
        </button>
      </div>
    </div>
  );
}
