import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import Img from './Img';
import { Reveal, RevealText } from './Reveal';
import { useMedia } from '../hooks/useMedia';

const STEPS = [
  ['Consultation', 'We listen to your needs, your space and your budget.'],
  ['Design & Planning', 'Measurements and layouts planned around how you cook and live.'],
  ['Material Selection', 'Finishes, steel and hardware chosen together, with clear options.'],
  ['Manufacturing', 'Cabinetry and steel components are made with precision.'],
  ['Installation', 'Fitted on site by a professional team, carefully and cleanly.'],
  ['Final Handover', 'A final check, and your kitchen is ready to use.'],
] as const;

const range = (i: number) => {
  const a = 0.06 + (i / STEPS.length) * 0.82;
  return [a, a + 0.1] as const;
};

function DesktopStep({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const [a, b] = range(i);
  const p = useTransform(progress, [a, b], [0, 1]);
  const opacity = useTransform(p, [0, 1], [0.28, 1]);
  const y = useTransform(p, [0, 1], [26, 0]);
  const fill = useTransform(p, [0, 1], ['rgba(239,233,223,0)', 'rgba(239,233,223,1)']);
  const dot = useTransform(p, [0, 1], [0.4, 1]);
  return (
    <li className="pstep">
      <motion.span className="pstep__dot" style={{ scale: dot, opacity }} aria-hidden="true" />
      <motion.span className="pstep__n display" style={{ color: fill }}>
        {String(i + 1).padStart(2, '0')}
      </motion.span>
      <motion.div style={{ opacity, y }}>
        <h3>{STEPS[i][0]}</h3>
        <p>{STEPS[i][1]}</p>
      </motion.div>
    </li>
  );
}

function Desktop() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const line = useTransform(scrollYProgress, [0.04, 0.95], [0, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['-4%', reduce ? '-4%' : '6%']);
  return (
    <div className="process__pin" ref={ref}>
      <div className="process__stick">
        <motion.div className="process__bg" style={{ y: bgY }} aria-hidden="true">
          <Img id="k22" sizes="100vw" alt="" position="50% 60%" />
        </motion.div>
        <div className="container process__inner">
          <header className="process__head">
            <p className="eyebrow">Process</p>
            <h2 className="display process__title" id="process-title">
              From first <em>conversation</em> to final handover.
            </h2>
          </header>
          <div className="process__track">
            <div className="process__rail" aria-hidden="true">
              <motion.span style={{ scaleX: line }} />
            </div>
            <ol className="process__steps">
              {STEPS.map((_, i) => (
                <DesktopStep key={i} i={i} progress={scrollYProgress} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function Mobile() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  return (
    <div className="container process__m">
      <header className="process__head">
        <Reveal><p className="eyebrow">Process</p></Reveal>
        <RevealText as="h2" className="display process__title" text="From first _conversation to final handover." />
      </header>
      <div className="process__mwrap">
        <div className="process__mrail" aria-hidden="true">
          <motion.span style={{ scaleY: scrollYProgress }} />
        </div>
        <ol ref={ref} className="process__msteps">
          {STEPS.map(([t, d], i) => (
            <li key={t}>
              <Reveal y={30}>
                <span className="display pstep__n pstep__n--m">{String(i + 1).padStart(2, '0')}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function Process() {
  const desktop = useMedia('(min-width: 1024px) and (min-height: 640px)');
  return (
    <section id="process" className="process" aria-labelledby={desktop ? 'process-title' : undefined} aria-label={desktop ? undefined : 'Our process'}>
      {desktop ? <Desktop /> : <Mobile />}
    </section>
  );
}
