import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { NAV, BUSINESS } from '../config';
import { lockScroll, scrollToId } from '../hooks/useLenis';

export default function Nav({ visible }: { visible: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 60));

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('keydown', esc);
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    // let the menu close and scroll lock release before scrolling
    setTimeout(() => scrollToId(id), open ? 450 : 0);
  };

  return (
    <>
      <motion.header
        className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}
        initial={{ y: -40, opacity: 0 }}
        animate={visible ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <div className="nav__bar">
          <a
            className="nav__logo"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              go('home');
            }}
            aria-label="Shree Shiv Steel Art — home"
          >
            <span className="nav__mark" aria-hidden="true">SS</span>
            <span className="nav__name">Shree Shiv Steel Art</span>
          </a>

          <nav className="nav__links" aria-label="Primary">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={active === n.id ? 'is-active' : ''}
                aria-current={active === n.id ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  go(n.id);
                }}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="nav__right">
            <a
              className="nav__cta"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                go('contact');
              }}
            >
              Get a Quote
            </a>
            <button
              className="nav__burger"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="menu__list">
              {NAV.map((n, i) => (
                <li key={n.id} className="menu__item">
                  <motion.a
                    href={`#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(n.id);
                    }}
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.06 }}
                  >
                    <small>{String(i + 1).padStart(2, '0')}</small>
                    {n.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              className="menu__foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <a
                className="menu__quote"
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  go('contact');
                }}
              >
                Get a Free Consultation
              </a>
              <p>
                {BUSINESS.locality.split(',').slice(0, 2).join(',')}
                <br />
                {BUSINESS.hours}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
