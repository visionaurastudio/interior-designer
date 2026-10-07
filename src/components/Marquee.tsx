const WORDS = ['Modular Kitchens', 'Stainless Steel', 'Custom Steel Work', 'Kitchen Storage', 'Renovation'];

/** Slow editorial ticker; pure CSS so it costs no JavaScript. */
export default function Marquee() {
  const row = (k: string) => (
    <ul key={k} className="marquee__row" aria-hidden={k === 'b'}>
      {WORDS.map((w, i) => (
        <li key={w} className={i % 2 ? 'is-italic' : ''}>
          {w}
          <span aria-hidden="true">/</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee" role="presentation">
      <div className="marquee__track">
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}
