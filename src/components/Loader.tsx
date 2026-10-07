import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { lockScroll } from '../hooks/useLenis';
import { photoUrl } from './Img';

/** Elegant page-load curtain. Waits for the hero photograph (max ~3s), shows ≥1.5s. */
export default function Loader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    lockScroll(true);
    const min = new Promise((r) => setTimeout(r, 1500));
    const hero = new Promise<void>((r) => {
      const img = new Image();
      img.onload = img.onerror = () => r();
      img.src = photoUrl('k03', window.innerWidth > 700 ? 1472 : 736);
      setTimeout(r, 3200);
    });
    Promise.all([min, hero]).then(onDone);
    return () => lockScroll(false);
  }, [onDone]);

  return (
    <motion.div
      className="loader"
      role="status"
      aria-label="Loading Shree Shiv Steel Art"
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="loader__inner">
        <motion.p
          className="loader__brand"
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.34em' }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Shree Shiv Steel Art
        </motion.p>
        <motion.p
          className="loader__sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Modular Kitchens · Steel Solutions
        </motion.p>
        <div className="loader__bar">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
}
