import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Img from './Img';
import { ImageReveal, Reveal, RevealText, EASE } from './Reveal';

const SERVICES = [
  { n: '01', title: 'Modular Kitchens', img: 'k05', pos: '50% 50%', text: 'Fully planned, factory-finished kitchens with cabinetry, counters and hardware designed around how you cook.' },
  { n: '02', title: 'Stainless Steel Kitchens', img: 'k06', pos: '50% 40%', text: 'Hygienic, durable and easy to maintain. Steel kitchens made to measure.' },
  { n: '03', title: 'Custom Steel Work', img: 'k27', pos: '50% 50%', text: 'Gates, railings, fixtures and fabricated pieces, crafted to your drawings and finished cleanly.' },
  { n: '04', title: 'Kitchen Storage Solutions', img: 'k32', pos: '50% 50%', text: 'Pull-outs, drawers, pantry units and organisers that keep everything in reach and in order.' },
  { n: '05', title: 'Kitchen Renovation / Upgrades', img: 'k02', pos: '50% 50%', text: 'Refresh an existing kitchen with new cabinetry, counters, storage and finishes.' },
  { n: '06', title: 'Custom Furniture / Steel Solutions', img: 'k30', pos: '50% 50%', text: 'Display units, cabinets and bespoke pieces built to suit your room and your routine.' },
] as const;

export default function Services() {
  const [stack, setStack] = useState<number[]>([0]);
  const active = stack[stack.length - 1];
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  const activate = (i: number) =>
    setStack((s) => (s[s.length - 1] === i ? s : [...s.slice(-1), i]));

  // keep the sticky image in step with whichever row is mid-screen
  useEffect(() => {
    if (!window.matchMedia('(min-width: 1024px)').matches) return;
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) activate(Number((e.target as HTMLElement).dataset.i));
        }),
      { rootMargin: '-42% 0px -42% 0px' },
    );
    rows.current.forEach((r) => r && obs.observe(r));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="kitchens" className="services section" aria-labelledby="services-title">
      <div className="container">
        <header className="services__head">
          <div>
            <Reveal>
              <p className="eyebrow">Kitchens &amp; Steel</p>
            </Reveal>
            <RevealText as="h2" className="display services__title" text="What we _make." />
            <span id="services-title" hidden>What we make</span>
          </div>
          <Reveal delay={0.15} className="services__intro">
            <p>
              From complete modular kitchens to custom steel work, everything is planned,
              manufactured and installed to suit your space.
            </p>
          </Reveal>
        </header>

        <div className="services__body">
          <div className="services__sticky" aria-hidden="true">
            <div className="services__frame">
              {stack.map((i) => (
                <motion.div
                  key={SERVICES[i].img}
                  className="services__slide"
                  initial={{ clipPath: 'inset(100% 0 0 0)' }}
                  animate={{ clipPath: 'inset(0% 0 0 0)' }}
                  transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                  style={{ zIndex: stack.indexOf(i) + 1 }}
                >
                  <motion.div
                    initial={{ scale: 1.18 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.6, ease: EASE }}
                    className="services__slide-inner"
                  >
                    <Img id={SERVICES[i].img} sizes="40vw" position={SERVICES[i].pos} alt="" />
                  </motion.div>
                </motion.div>
              ))}
              <span className="services__count">
                {SERVICES[active].n} <i>/ 06</i>
              </span>
            </div>
          </div>

          <ol className="services__list">
            {SERVICES.map((s, i) => (
              <li
                key={s.n}
                data-i={i}
                ref={(el) => {
                  rows.current[i] = el;
                }}
                className={`svc${active === i ? ' is-active' : ''}`}
                onMouseEnter={() => activate(i)}
                onFocus={() => activate(i)}
                tabIndex={0}
              >
                <Reveal y={36}>
                  <span className="svc__line" aria-hidden="true" />
                  <div className="svc__row">
                    <span className="svc__num">{s.n}</span>
                    <div className="svc__text">
                      <h3 className="svc__title display">{s.title}</h3>
                      <p>{s.text}</p>
                    </div>
                  </div>
                  <ImageReveal className="svc__img hoverzoom">
                    <Img id={s.img} sizes="(max-width: 700px) 90vw, 60vw" position={s.pos} />
                  </ImageReveal>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
