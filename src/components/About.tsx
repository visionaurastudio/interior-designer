import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import Img from './Img';
import { ImageReveal, Reveal, RevealText, Parallax } from './Reveal';

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, {
      duration: 2.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
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
    <section id="about" className="about section" aria-labelledby="about-title">
      <div className="container about__grid">
        <div className="about__left">
          <Reveal>
            <p className="eyebrow">About</p>
          </Reveal>
          <RevealText
            as="h2"
            className="about__title display"
            text="26+ Years of _Craftsmanship."
          />
          <span id="about-title" hidden>
            26+ Years of Craftsmanship
          </span>
          <Reveal delay={0.1} className="about__counter">
            <div className="about__num display">
              <Counter to={26} />
            </div>
            <div className="about__numlabel">
              <span>Years of</span>
              <span>Experience</span>
            </div>
          </Reveal>
        </div>

        <div className="about__right">
          <Reveal delay={0.1}>
            <p className="about__lead">
              Shree Shiv Steel Art is a Vile Parle East manufacturer of modular kitchens and
              stainless steel work.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="about__body">
              For more than twenty-six years we have built kitchens and steel solutions that are
              durable, practical and refined. They are made to be used every day and to look right
              for years. Every piece is planned around your space and finished with care.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <ul className="about__facts">
              <li>
                <small>Type</small>Manufacturer
              </li>
              <li>
                <small>Makes</small>Modular &amp; steel kitchens
              </li>
              <li>
                <small>Approach</small>Custom made
              </li>
            </ul>
          </Reveal>

          <div className="about__images">
            <ImageReveal className="about__img-main hoverzoom">
              <Parallax amount={6}>
                <Img id="k04" sizes="(max-width: 900px) 90vw, 38vw" alt="Grey marble kitchen island with bar stools and dark cabinetry, a Shree Shiv Steel Art kitchen" />
              </Parallax>
            </ImageReveal>
            <ImageReveal className="about__img-small hoverzoom" delay={0.25} from="left">
              <Img id="k33" sizes="(max-width: 900px) 40vw, 16vw" />
            </ImageReveal>
            <svg className="about__badge" viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <path id="badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
              </defs>
              <text>
                <textPath href="#badge-circle" textLength="272" lengthAdjust="spacing">
                  Manufacturer · Vile Parle East · Mumbai ·
                </textPath>
              </text>
              <circle cx="60" cy="60" r="3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
