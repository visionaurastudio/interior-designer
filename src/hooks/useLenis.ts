import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenis: Lenis | null = null;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Mount once: smooth, inertial scrolling for wheel/trackpad. Touch keeps native scrolling. */
export function useSmoothScroll() {
  useEffect(() => {
    if (reduced()) return;
    const instance = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true });
    lenis = instance;
    let raf = 0;
    const loop = (t: number) => {
      instance.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      lenis = null;
    };
  }, []);
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView({ behavior: 'auto', block: 'start' });
}

export function lockScroll(lock: boolean) {
  if (lock) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = lock ? 'hidden' : '';
}
