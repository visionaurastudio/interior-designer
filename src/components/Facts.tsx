import { Reveal } from './Reveal';
import { BUSINESS, TEL_HREF } from '../config';

/** Key facts, all supplied by the business. */
export default function Facts() {
  const items: [string, string, string?][] = [
    ['Listed since', '2000'],
    ['Makes', 'Kitchens & furniture'],
    ['Approach', 'Made to measure'],
    ['Find us', 'Opposite Vile Parle Station'],
    ['Open', '9:00 AM – 9:00 PM'],
    ['Call', BUSINESS.phone, TEL_HREF],
  ];
  return (
    <div className="facts-wrap container">
      <Reveal>
        <ul className="facts">
          {items.map(([k, v, href]) => (
            <li key={k}>
              <small>{k}</small>
              {href ? <a href={href}>{v}</a> : <strong>{v}</strong>}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
