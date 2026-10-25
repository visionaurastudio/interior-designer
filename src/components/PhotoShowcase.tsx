import { useCallback, useState } from 'react';
import Button from './Magnetic';
import Lightbox from './Lightbox';
import { Tile } from './Tile';
import { Reveal, RevealText } from './Reveal';
import { scrollToId } from '../hooks/useLenis';

interface Props {
  id: string;
  tone: 'light' | 'paper';
  eyebrow: string;
  title: string;
  text: string;
  points: string[];
  /** First photo is the large lead image. All of them open in the viewer. */
  photos: string[];
  note?: string;
}

/** Category section: description and calls to action beside a lead photograph and supporting thumbnails. */
export default function PhotoShowcase({ id, tone, eyebrow, title, text, points, photos, note }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const open = useCallback((pid: string) => setIndex(photos.indexOf(pid)), [photos]);
  const close = useCallback(() => setIndex(null), []);
  const [lead, ...rest] = photos;
  const odd = rest.length % 2 === 1;

  return (
    <section id={id} className={`sec sec--${tone}`} aria-labelledby={`${id}-title`}>
      <div className="container">
        <div className="show__head">
          <div>
            <Reveal><p className="eyebrow">{eyebrow}</p></Reveal>
            <RevealText as="h2" className="display sec__title" text={title} />
            <span id={`${id}-title`} hidden>{title.replace(/_/g, '')}</span>
          </div>
          <div className="show__copy">
            <Reveal delay={0.1}><p className="sec__lead">{text}</p></Reveal>
            <Reveal delay={0.15}><ul className="pfeat__points">{points.map((p) => <li key={p}>{p}</li>)}</ul></Reveal>
            <Reveal delay={0.2} className="pfeat__cta">
              <Button variant="dark" href="#contact" onClick={() => scrollToId('contact')}>Enquire</Button>
            </Reveal>
          </div>
        </div>

        <div className="show__grid">
          <div className="show__lead">
            <Tile id={lead} open={open} sizes="(max-width: 900px) 92vw, 40vw" ratio="4 / 5" />
          </div>
          <div className="show__thumbs">
            {rest.map((pid, i) => {
              const wide = odd && i === rest.length - 1;
              return (
                <div key={pid} className={wide ? 'show__wide' : undefined}>
                  <Tile id={pid} open={open} sizes="(max-width: 900px) 46vw, 24vw" ratio={wide ? '16 / 10' : '4 / 5'} delay={0.07 * i} from={i % 2 ? 'right' : 'left'} />
                </div>
              );
            })}
          </div>
        </div>
        {note && <p className="show__note">{note}</p>}
      </div>
      <Lightbox index={index} onClose={close} onIndex={setIndex} order={photos} />
    </section>
  );
}
