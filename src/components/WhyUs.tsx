import { motion } from 'framer-motion';
import Img from './Img';
import { ImageReveal, Parallax, Reveal, RevealText, EASE } from './Reveal';

const POINTS = [
  ['26+ Years of Experience', 'Decades of hands-on work behind every kitchen we build.'],
  ['Precision Manufacturing', 'Made to measure and finished with care, down to the last edge.'],
  ['Durable Materials', 'Stainless steel and quality materials chosen for daily use.'],
  ['Custom Designs', 'Layouts shaped around your space, your habits and your taste.'],
  ['Practical Storage', 'Drawers, pull-outs and shelving that keep a kitchen orderly.'],
  ['Professional Installation', 'Fitted properly, so everything works the way it was designed.'],
] as const;

export default function WhyUs() {
  return (
    <section id="why" className="why section" aria-labelledby="why-title">
      <div className="container why__grid">
        <div className="why__media">
          <ImageReveal className="why__img hoverzoom">
            <Parallax amount={8}>
              <Img id="k12" sizes="(max-width: 900px) 90vw, 40vw" position="50% 40%" />
            </Parallax>
          </ImageReveal>
          <Reveal className="why__tag" delay={0.4}>
            <small>Experience</small>
            <span>26+ years</span>
          </Reveal>
        </div>

        <div className="why__content">
          <Reveal>
            <p className="eyebrow">Why Shree Shiv Steel Art</p>
          </Reveal>
          <RevealText as="h2" className="display why__title" text="Built to _Last." />
          <span id="why-title" hidden>Built to Last</span>
          <ul className="why__list">
            {POINTS.map(([t, d], i) => (
              <li key={t} className="why__item">
                <motion.span
                  className="why__line"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ duration: 1.4, ease: EASE, delay: 0.06 * (i % 2) }}
                />
                <Reveal delay={0.08 * (i % 2)} y={22}>
                  <span className="why__n">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
