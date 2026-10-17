import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { useSmoothScroll } from './hooks/useLenis';
import Loader from './components/Loader';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Marquee from './components/Marquee';
import Services from './components/Services';
import Gallery from './components/Gallery';
import WhyUs from './components/WhyUs';
import Process from './components/Process';
import Contact from './components/Contact';
import Footer from './components/Footer';
import StudioSection from './components/StudioSection';
import { STUDIO_EVENT } from './studio/studioBus';
import type { Product } from './studio/types';

const Studio = lazy(() => import('./studio/Studio'));

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [studio, setStudio] = useState<Product | null>(null);
  useEffect(() => {
    const on = (e: Event) => setStudio((e as CustomEvent<Product>).detail);
    window.addEventListener(STUDIO_EVENT, on);
    return () => window.removeEventListener(STUDIO_EVENT, on);
  }, []);
  const closeStudio = useCallback(() => setStudio(null), []);
  useSmoothScroll();
  const done = useCallback(() => setLoaded(true), []);

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#about">Skip to content</a>
      <AnimatePresence>{!loaded && <Loader key="loader" onDone={done} />}</AnimatePresence>
      <Nav visible={loaded} />
      <main>
        <Hero loaded={loaded} />
        <About />
        <Marquee />
        <Services />
        <Gallery />
        <StudioSection />
        <WhyUs />
        <Process />
        <Contact />
      </main>
      <Footer />
      {studio && (
        <Suspense fallback={<div className="studio-boot" role="status">Loading 3D studio…</div>}>
          <Studio initial={studio} onClose={closeStudio} />
        </Suspense>
      )}
    </MotionConfig>
  );
}
