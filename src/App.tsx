import { useCallback, useState } from 'react';
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

export default function App() {
  const [loaded, setLoaded] = useState(false);
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
        <WhyUs />
        <Process />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
