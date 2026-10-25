import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import Img from './Img';
import Button from './Magnetic';
import { ImageReveal, Parallax, Reveal, RevealText } from './Reveal';
import { scrollToId } from '../hooks/useLenis';

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} aria-label={`${to} plus`}>
      <span aria-hidden="true">{n}+</span>
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="sec sec--light about" aria-labelledby="about-title">
      <div className="container about__grid">
        <div className="about__media">
          <ImageReveal className="about__img hoverzoom">
            <Parallax amount={6}>
              <Img id="c09" sizes="(max-width: 900px) 92vw, 44vw" position="50% 40%" />
            </Parallax>
          </ImageReveal>
        </div>
        <div className="about__text">
          <Reveal><p className="eyebrow">About us</p></Reveal>
          <RevealText as="h2" className="display sec__title" text="26+ years of _craftsmanship." />
          <span id="about-title" hidden>26+ years of craftsmanship</span>
          <Reveal delay={0.1}>
            <p className="about__lead">
              Shree Shiv Steel Art is a modular kitchen dealer and furniture manufacturer in Vile Parle East, opposite the railway station.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="sec__lead">
              Listed since 2000, we make modular kitchens and the furniture that goes with them: TV units, wardrobes, beds, dining and
              dressing tables, and bathroom storage. We also deal in steel. A small, hands-on team plans each piece around your space and
              finishes it with care.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="about__row">
            <div className="about__counter">
              <strong className="display"><Counter to={26} /></strong>
              <span>Years of<br />experience</span>
            </div>
            <Button variant="dark" href="#contact" onClick={() => scrollToId('contact')}>Talk to us</Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
