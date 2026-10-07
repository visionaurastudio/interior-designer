import { NAV, BUSINESS } from '../config';
import { scrollToId } from '../hooks/useLenis';
import Button from './Magnetic';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <p className="footer__name display">Shree Shiv Steel Art</p>
          <p className="footer__tag">Modular Kitchens • Steel Solutions • Custom Work</p>
          <p className="footer__loc">Vile Parle East, Mumbai</p>
        </div>
        <nav className="footer__nav" aria-label="Footer">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={(e) => { e.preventDefault(); scrollToId(n.id); }}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="footer__cta">
          <p>Have a project in mind?</p>
          <Button href="#contact" onClick={() => scrollToId('contact')}>Get in touch</Button>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</p>
        <a href="#home" onClick={(e) => { e.preventDefault(); scrollToId('home'); }}>Back to top ↑</a>
      </div>
      <p className="footer__giant" aria-hidden="true">Shree Shiv Steel Art</p>
    </footer>
  );
}
