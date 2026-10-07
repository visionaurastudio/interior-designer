import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Img from './Img';
import Button from './Magnetic';
import { RevealText, EASE } from './Reveal';
import { scrollToId } from '../hooks/useLenis';
import { BUSINESS } from '../config';

export default function Hero({ loaded }: { loaded: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '16%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-14%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const floatY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-60%']);
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.55]);

  const up = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: loaded ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1.1, ease: EASE, delay },
  });

  return (
    <section id="home" className="hero" ref={ref} aria-label="Introduction">
      <motion.div className="hero__media" style={{ y: imgY }}>
        <motion.div
          className="hero__zoom"
          initial={{ scale: 1.22 }}
          animate={loaded ? { scale: 1 } : {}}
          transition={{ duration: 2.8, ease: EASE }}
        >
          <Img
            id="k03"
            eager
            sizes="100vw"
            position="50% 58%"
            alt="Spacious modular kitchen by Shree Shiv Steel Art with island, pendant lights and cove-lit ceiling"
          />
        </motion.div>
      </motion.div>
      <div className="hero__shade" />
      <motion.div className="hero__shade hero__shade--scroll" style={{ opacity: shade }} />

      <motion.div className="hero__content container" style={{ y: textY, opacity: fade }}>
        <h1 className="hero__title">
          <motion.span className="hero__brand" {...up(0.15)}>
            Shree Shiv Steel Art
          </motion.span>
          <RevealText
            as="span"
            className="hero__tagline display"
            text="Built for the | _way _you _live."
            when={loaded}
            delay={0.35}
            stagger={0.09}
          />
        </h1>
        <motion.p className="hero__lead" {...up(0.95)}>
          Premium modular kitchens and custom steel solutions, crafted with experience, precision
          and lasting quality.
        </motion.p>
        <motion.div className="hero__cta" {...up(1.1)}>
          <Button href="#work" onClick={() => scrollToId('work')}>
            Explore Our Work
          </Button>
          <Button href="#contact" variant="ghost" onClick={() => scrollToId('contact')}>
            Get a Free Consultation
          </Button>
        </motion.div>
      </motion.div>

      <motion.a
        className="hero__float"
        href="#work"
       
        onClick={(e) => {
          e.preventDefault();
          scrollToId('work');
        }}
        style={{ y: floatY }}
        initial={{ opacity: 0, x: 40 }}
        animate={loaded ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.3, ease: EASE, delay: 1.3 }}
        aria-label="See selected work"
      >
        <Img id="k14" sizes="260px" />
        <span>
          <small>Selected work</small>
          Interiors, finished properly
        </span>
      </motion.a>

      <motion.div
        className="hero__meta"
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 1.5 }}
      >
        <span>Manufacturer · Modular Kitchens · Stainless Steel</span>
        <span className="hero__scroll" aria-hidden="true">
          <i />
          Scroll
        </span>
        <span>
          {BUSINESS.locality.split(',').slice(0, 2).join(',')} — {BUSINESS.hours}
        </span>
      </motion.div>
    </section>
  );
}
