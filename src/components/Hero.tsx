import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Img from './Img';
import Button from './Magnetic';
import { RevealText, EASE } from './Reveal';
import { scrollToId } from '../hooks/useLenis';

export default function Hero({ loaded }: { loaded: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '14%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-10%']);

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
          initial={{ scale: 1.16 }}
          animate={loaded ? { scale: 1 } : {}}
          transition={{ duration: 2.6, ease: EASE }}
        >
          <Img
            id="c07"
            eager
            sizes="100vw"
            position="50% 55%"
            alt="U-shaped modular kitchen with navy wall units, timber base cabinets and a peninsula"
          />
        </motion.div>
      </motion.div>
      <div className="hero__shade" />

      <motion.div className="hero__content container" style={{ y: textY }}>
        <h1 className="hero__title">
          <motion.span className="hero__brand" {...up(0.15)}>
            Shree Shiv Steel Art · Vile Parle East, Mumbai
          </motion.span>
          <RevealText
            as="span"
            className="hero__tagline display"
            text="Built for the way you _live."
            when={loaded}
            delay={0.3}
            stagger={0.08}
          />
        </h1>
        <motion.p className="hero__lead" {...up(0.9)}>
          Premium modular kitchens and custom steel solutions, crafted with experience, precision
          and lasting quality.
        </motion.p>
        <motion.div className="hero__cta" {...up(1.05)}>
          <Button href="#kitchens" onClick={() => scrollToId('kitchens')}>Explore Our Work</Button>
          <Button href="#contact" variant="ghost" onClick={() => scrollToId('contact')}>Get a Free Consultation</Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
