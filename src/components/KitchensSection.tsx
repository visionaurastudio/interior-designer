import KitchenSlider from './KitchenSlider';
import Img from './Img';
import { ImageReveal, Reveal, RevealText } from './Reveal';

const FINISHES = [
  ['c16', 'Sage green'], ['c18', 'Slate blue'], ['c19', 'Cream'],
] as const;

export default function KitchensSection() {
  return (
    <section id="kitchens" className="sec sec--light" aria-labelledby="kitchens-title">
      <div className="container">
        <header className="sec__head">
          <Reveal><p className="eyebrow">Modular kitchens</p></Reveal>
          <RevealText as="h2" className="display sec__title" text="Kitchens made to _measure." />
          <span id="kitchens-title" hidden>Kitchens made to measure</span>
          <Reveal delay={0.1}>
            <p className="sec__lead">
              Gloss, matt and timber finishes, planned around your space and the way you cook. These are kitchens from homes we have worked on.
            </p>
          </Reveal>
        </header>

        <Reveal delay={0.05}><KitchenSlider /></Reveal>

        <div className="finishes">
          <div className="finishes__head">
            <h3 className="display">One kitchen, three finishes</h3>
            <p>The same layout shown in three colours, to help you picture your own.</p>
          </div>
          <ul className="finishes__grid">
            {FINISHES.map(([id, name], i) => (
              <li key={id}>
                <ImageReveal className="finishes__img hoverzoom" delay={0.06 * i}>
                  <Img id={id} sizes="(max-width: 700px) 46vw, 18vw" />
                </ImageReveal>
                <span>{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
