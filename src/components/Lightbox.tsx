import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { GALLERY_ORDER, PHOTOS } from '../data/photos';
import { bestUrl } from './Img';
import { lockScroll } from '../hooks/useLenis';

interface Props {
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}

const slide = {
  enter: (d: number) => ({ x: d > 0 ? 90 : -90, opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (d: number) => ({ x: d > 0 ? -90 : 90, opacity: 0, scale: 0.97 }),
};

export default function Lightbox({ index, onClose, onIndex }: Props) {
  const [dir, setDir] = useState(1);
  const dialog = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);
  const isOpen = index !== null;
  const total = GALLERY_ORDER.length;

  const go = useCallback(
    (step: number) => {
      if (index === null) return;
      setDir(step);
      onIndex((index + step + total) % total);
    },
    [index, onIndex, total],
  );

  // scroll lock + focus management
  useEffect(() => {
    if (!isOpen) return;
    opener.current = document.activeElement;
    lockScroll(true);
    dialog.current?.querySelector<HTMLElement>('[data-close]')?.focus();
    return () => {
      lockScroll(false);
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [isOpen]);

  // keyboard
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab' && dialog.current) {
        const f = dialog.current.querySelectorAll<HTMLElement>('button');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, go, onClose]);

  // preload neighbours so navigation feels instant
  useEffect(() => {
    if (index === null) return;
    [1, -1, 2].forEach((s) => {
      const id = GALLERY_ORDER[(index + s + total) % total];
      new Image().src = bestUrl(id);
    });
  }, [index, total]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -480) go(1);
    else if (info.offset.x > 70 || info.velocity.x > 480) go(-1);
    else if (info.offset.y > 120) onClose();
  };

  const id = index !== null ? GALLERY_ORDER[index] : null;
  const photo = id ? PHOTOS[id] : null;

  return (
    <AnimatePresence>
      {isOpen && photo && id && (
        <motion.div
          ref={dialog}
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="lb__backdrop" onClick={onClose} />

          <div className="lb__top">
            <p className="lb__count" aria-live="polite">
              {String((index ?? 0) + 1).padStart(2, '0')} <i>/ {String(total).padStart(2, '0')}</i>
            </p>
            <button className="lb__btn" data-close onClick={onClose} aria-label="Close viewer">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.3" fill="none" />
              </svg>
            </button>
          </div>

          <motion.div
            className="lb__stage"
            initial={{ opacity: 0, scale: 0.9, clipPath: 'inset(6% 6% 6% 6% round 18px)' }}
            animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)' }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence custom={dir} mode="popLayout" initial={false}>
              <motion.figure
                key={id}
                className="lb__fig"
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                drag="x"
                dragDirectionLock
                dragElastic={0.22}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={onDragEnd}
              >
                <div className="lb__imgbox" style={{ aspectRatio: `${photo.w} / ${photo.h}` }}>
                  <img src={bestUrl(id)} alt={photo.alt} draggable={false} style={{ background: photo.bg }} />
                </div>
                <figcaption>
                  <span>{photo.label}</span>
                  {photo.alt}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </motion.div>

          <button className="lb__btn lb__nav lb__nav--prev" onClick={() => go(-1)} aria-label="Previous image">
            <svg width="18" height="10" viewBox="0 0 18 10" aria-hidden="true">
              <path d="M18 5H2M6 1L2 5l4 4" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </svg>
          </button>
          <button className="lb__btn lb__nav lb__nav--next" onClick={() => go(1)} aria-label="Next image">
            <svg width="18" height="10" viewBox="0 0 18 10" aria-hidden="true">
              <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
