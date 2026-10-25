import Img from './Img';
import { ImageReveal, Reveal, RevealText } from './Reveal';
import { scrollToId } from '../hooks/useLenis';

const TILES = [
  { n: '01', title: 'Modular Kitchen', text: 'Planned around how you cook.', img: 'c02', to: 'kitchens' },
  { n: '02', title: 'Kitchen Accessories', text: 'Racks, drawers and pull-outs.', img: 'c13', to: 'kitchens' },
  { n: '03', title: 'Kitchen Loft', text: 'Overhead storage, solid or glass-fronted.', img: 'c15', to: 'kitchens' },
  { n: '04', title: 'TV Unit', text: 'Back panels and floating consoles.', img: 'tv1', to: 'tv' },
] as const;

const MORE = [
  ['05', 'Bedroom Décor', 'Furniture and décor pieces made to suit the room.', 'contact'],
  ['06', 'Wardrobe', 'Sliding-door wardrobes made to measure.', 'wardrobes'],
  ['07', 'Bed', 'Beds made to your size and style.', 'contact'],
  ['08', 'Dining Table', 'Dining tables made to suit your space and your seating.', 'contact'],
  ['09', 'Dressing Table', 'Dressing tables made to fit the room.', 'contact'],
  ['10', 'Bathroom Mirror Box', 'Mirror boxes that add storage to the bathroom.', 'contact'],
  ['11', 'Bathroom Storage Box', 'Storage boxes that keep bathroom essentials organised.', 'contact'],
] as const;

/** The eleven services confirmed by the business. Photo tiles only where a real photograph exists. */
export default function WhatWeDo() {
  return (
    <section id="services" className="sec sec--paper" aria-labelledby="services-title">
      <div className="container">
        <header className="sec__head sec__head--center">
          <Reveal><p className="eyebrow">What we do</p></Reveal>
          <RevealText as="h2" className="display sec__title" text="Kitchens, furniture and _storage." />
          <span id="services-title" hidden>Kitchens, furniture and storage</span>
        </header>

        <ul className="tiles">
          {TILES.map((t, i) => (
            <li key={t.n}>
              <a className="wtile" href={`#${t.to}`} onClick={(e) => { e.preventDefault(); scrollToId(t.to); }}>
                <ImageReveal className="wtile__img hoverzoom" delay={0.07 * i}>
                  <Img id={t.img} sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 24vw" />
                </ImageReveal>
                <span className="wtile__body">
                  <small>{t.n}</small>
                  <strong>{t.title}</strong>
                  <span>{t.text}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <h3 className="sec__sub">Also made to order</h3>
        <ul className="more">
          {MORE.map(([n, title, text, to], i) => (
            <li key={n}>
              <Reveal delay={0.04 * (i % 3)}>
                <a href={`#${to}`} onClick={(e) => { e.preventDefault(); scrollToId(to); }}>
                  <small>{n}</small>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
