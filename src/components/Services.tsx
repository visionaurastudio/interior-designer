import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Img from './Img';
import { ImageReveal, Reveal, RevealText, EASE } from './Reveal';

interface Service { n: string; title: string; img: string | null; pos: string; text: string }

/** The eleven services confirmed by the business. Only services with a real photograph show one. */
const SERVICES: Service[] = [
  { n: '01', title: 'Modular Kitchen', img: 'c02', pos: '50% 50%', text: 'Fully planned kitchens with cabinetry, worktops, drawers and hardware, designed around how you cook.' },
  { n: '02', title: 'Kitchen Accessories', img: 'c13', pos: '50% 50%', text: 'Racks, drawer organisers and pull-outs that keep a kitchen in order. Kitchen racks are listed from about ₹400 to ₹8,000 per piece.' },
  { n: '03', title: 'Kitchen Loft', img: 'c15', pos: '50% 50%', text: 'Overhead loft units for extra storage, in solid or glass-fronted finishes.' },
  { n: '04', title: 'TV Unit', img: 'c10', pos: '50% 50%', text: 'TV units and decorative back panels in timber, stone-look and fluted finishes.' },
  { n: '05', title: 'Bedroom Décor', img: null, pos: '', text: 'Furniture and décor pieces that finish a bedroom, made to suit the room.' },
  { n: '06', title: 'Wardrobe', img: null, pos: '', text: 'Wardrobes made to measure, with shutters and interiors planned around your storage.' },
  { n: '07', title: 'Bed', img: null, pos: '', text: 'Beds made to your size and style.' },
  { n: '08', title: 'Dining Table', img: null, pos: '', text: 'Dining tables made to suit your space and your seating.' },
  { n: '09', title: 'Dressing Table', img: null, pos: '', text: 'Dressing tables made to fit the room.' },
  { n: '10', title: 'Bathroom Mirror Box', img: null, pos: '', text: 'Mirror boxes that add storage and a clean finish to the bathroom.' },
  { n: '11', title: 'Bathroom Storage Box', img: null, pos: '', text: 'Storage boxes that keep bathroom essentials organised.' },
];

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
              <p className="eyebrow">Kitchens &amp; Furniture</p>
            </Reveal>
            <RevealText as="h2" className="display services__title" text="What we _make." />
            <span id="services-title" hidden>What we make</span>
          </div>
          <Reveal delay={0.15} className="services__intro">
            <p>
              From complete modular kitchens to wardrobes and TV units, everything is planned and made
              to suit your space.
            </p>
          </Reveal>
        </header>

        <div className="services__body">
          <div className="services__sticky" aria-hidden="true">
            <div className="services__frame">
              {stack.map((i) => (
                <motion.div
                  key={SERVICES[i].n}
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
                    {SERVICES[i].img ? (
                      <Img id={SERVICES[i].img as string} sizes="40vw" position={SERVICES[i].pos} alt="" />
                    ) : (
                      <div className="services__panel">
                        <span className="display">{SERVICES[i].n}</span>
                        <p className="display">{SERVICES[i].title}</p>
                        <small>Made to order</small>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
              <span className="services__count">
                {SERVICES[active].n} <i>/ {String(SERVICES.length).padStart(2, '0')}</i>
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
                  {s.img && (
                    <ImageReveal className="svc__img hoverzoom">
                      <Img id={s.img} sizes="(max-width: 700px) 90vw, 60vw" position={s.pos} />
                    </ImageReveal>
                  )}
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
