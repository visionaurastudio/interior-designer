import { useCallback, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { useSmoothScroll } from './hooks/useLenis';
import Loader from './components/Loader';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Facts from './components/Facts';
import WhatWeDo from './components/WhatWeDo';
import About from './components/About';
import KitchensSection from './components/KitchensSection';
import PhotoShowcase from './components/PhotoShowcase';
import WhyUs from './components/WhyUs';
import Process from './components/Process';
import Contact from './components/Contact';
import Footer from './components/Footer';
import MobileBar from './components/MobileBar';
import WhatsAppButton from './components/WhatsAppButton';

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
        <Facts />
        <WhatWeDo />
        <About />
        <KitchensSection />
        <PhotoShowcase
          id="tv"
          tone="paper"
          eyebrow="TV units"
          title="TV units &amp; _feature walls."
          text="The wall behind the television is part of the design: stone-look and fluted panels, concealed lighting, lit display niches and a floating console, planned together to the width of your wall."
          points={['Back panels in stone-look, fluted or textured finishes', 'Concealed lighting and lit display shelves', 'Floating or floor-standing consoles']}
          photos={['tv3', 'c10', 'tv2', 'tv1']}
        />
        <PhotoShowcase
          id="wardrobes"
          tone="light"
          eyebrow="Wardrobes"
          title="Wardrobes, _made to measure."
          text="Floor-to-ceiling wardrobes with loft storage, drawers and dressing units built in, finished in the colours and timber tones you choose, including sliding-door designs."
          points={['Loft cabinets for seasonal storage', 'Drawers, open shelves and lit dressing corners', 'Finishes chosen with you']}
          photos={['wd5', 'wd4', 'wd3', 'wd2', 'wd1']}
        />
        <WhyUs />
        <Process />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
      <WhatsAppButton />
    </MotionConfig>
  );
}
