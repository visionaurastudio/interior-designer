import Img from './Img';
import Button from './Magnetic';
import { ImageReveal, Reveal, RevealText } from './Reveal';
import { openStudio } from '../studio/studioBus';
import type { Product } from '../studio/types';

const CARDS: { product: Product; title: string; text: string; img: string | null; pos: string }[] = [
  { product: 'kitchen', title: 'Modular kitchen', text: 'Three layouts. Change cabinet, countertop, backsplash and handle finishes.', img: 'c02', pos: '50% 50%' },
  { product: 'tv', title: 'TV unit', text: 'Fluted side panels, a stone-look back panel and a floating console, in your finishes.', img: 'c10', pos: '50% 50%' },
  { product: 'wardrobe', title: 'Wardrobe', text: 'A four-door wardrobe with loft and open unit. Try different shutter and accent colours.', img: null, pos: '' },
];

/** Entry point for the 3D studio. The viewer itself loads only when a card is opened. */
export default function StudioSection() {
  return (
    <section id="studio" className="studio-sec section" aria-labelledby="studio-title">
      <div className="container">
        <header className="studio-sec__head">
          <div>
            <Reveal>
              <p className="eyebrow">3D Studio</p>
            </Reveal>
            <RevealText as="h2" className="display studio-sec__title" text="See it in _3D." />
            <span id="studio-title" hidden>See it in 3D</span>
          </div>
          <Reveal delay={0.15} className="studio-sec__intro">
            <p>
              Rotate, zoom and try different finishes before you visit. These are design prototypes, not exact copies of
              our installations. Sizes, finishes and prices are confirmed with the team.
            </p>
          </Reveal>
        </header>

        <ul className="studio-sec__cards">
          {CARDS.map((c, i) => (
            <li key={c.product}>
              <button className="scard" onClick={() => openStudio(c.product)} aria-label={`Open the 3D studio: ${c.title}`}>
                <ImageReveal className="scard__media hoverzoom" delay={0.08 * i}>
                  {c.img ? (
                    <Img id={c.img} sizes="(max-width: 800px) 90vw, 30vw" position={c.pos} />
                  ) : (
                    <div className="scard__panel" aria-hidden="true">
                      <span className="display">3D</span>
                    </div>
                  )}
                </ImageReveal>
                <span className="scard__meta">Prototype</span>
                <span className="scard__title display">{c.title}</span>
                <span className="scard__text">{c.text}</span>
                <span className="scard__cta">Open in 3D <svg width="18" height="10" viewBox="0 0 18 10" aria-hidden="true"><path d="M0 5h16M12 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg></span>
              </button>
            </li>
          ))}
        </ul>

        <Reveal delay={0.1} className="studio-sec__more">
          <Button href="#studio" onClick={() => openStudio('kitchen')}>Open the 3D studio</Button>
          <p>Dressing tables, bathroom storage and other pieces are not available in 3D yet.</p>
        </Reveal>
      </div>
    </section>
  );
}
