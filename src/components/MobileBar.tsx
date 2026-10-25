import { scrollToId } from '../hooks/useLenis';
import { TEL_HREF } from '../config';

/** Always-reachable call and enquiry actions on small screens (WhatsApp has its own floating button). */
export default function MobileBar() {
  return (
    <nav className="mbar" aria-label="Quick contact">
      <a href={TEL_HREF} className="mbar__a">
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.5.55 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.55 3.5a1 1 0 0 1-.25 1z" fill="currentColor" /></svg>
        Call
      </a>
      <a href="#contact" className="mbar__a mbar__a--ghost" onClick={(e) => { e.preventDefault(); scrollToId('contact'); }}>Enquire</a>
    </nav>
  );
}
