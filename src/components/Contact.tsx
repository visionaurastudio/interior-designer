import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Img from './Img';
import Button from './Magnetic';
import { ImageReveal, Reveal, RevealText, EASE } from './Reveal';
import { BUSINESS } from '../config';
import { ENQUIRY_EVENT, type EnquiryDraft } from '../enquiry';

const TYPES = ['Modular Kitchen', 'Kitchen Accessories / Loft', 'TV Unit', 'Wardrobe / Bedroom', 'Other'];
type Status = 'idle' | 'sending' | 'sent' | 'compose' | 'error';

export default function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const [type, setType] = useState(TYPES[0]);
  const [status, setStatus] = useState<Status>('idle');
  const [note, setNote] = useState('');
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // pre-fill from the 3D studio
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<EnquiryDraft>).detail;
      if (d.projectType && TYPES.includes(d.projectType)) setType(d.projectType);
      const ta = form.current?.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
      if (ta && d.message !== undefined) {
        ta.value = d.message;
        ta.rows = Math.min(10, Math.max(3, d.message.split('\n').length));
      }
      setStatus('idle');
    };
    window.addEventListener(ENQUIRY_EVENT, on);
    return () => window.removeEventListener(ENQUIRY_EVENT, on);
  }, []);

  const focusForm = () => {
    form.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true });
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get('company')) return; // honeypot
    const data = {
      name: String(fd.get('name') || '').trim(),
      phone: String(fd.get('phone') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      projectType: type,
      message: String(fd.get('message') || '').trim(),
    };
    const err: Record<string, string> = {};
    if (data.name.length < 2) err.name = 'Please enter your name.';
    if (data.phone.replace(/\D/g, '').length < 8) err.phone = 'Please enter a valid phone number.';
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) err.email = 'That email doesn’t look right.';
    setErrors(err);
    if (Object.keys(err).length) return;

    setStatus('sending');
    try {
      if (BUSINESS.formEndpoint) {
        const r = await fetch(BUSINESS.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        if (!r.ok) throw new Error('bad status');
        setNote('Thank you. We’ll get back to you shortly.');
        setStatus('sent');
        form.current?.reset();
        setType(TYPES[0]);
      } else {
        // No form service is connected, so nothing is sent from here. Hand the visitor ready-made
        // ways to send the enquiry to the business's own phone number instead of pretending it was sent.
        setDraft(
          `Hello Shree Shiv Steel Art, I would like to enquire about: ${data.projectType}.\n` +
          `Name: ${data.name}\nPhone: ${data.phone}` + (data.email ? `\nEmail: ${data.email}` : '') +
          (data.message ? `\n\n${data.message}` : ''),
        );
        setCopied(false);
        setStatus('compose');
      }
    } catch {
      setStatus('error');
    }
  };

  const callProps = BUSINESS.phone
    ? { href: `tel:${BUSINESS.phone.replace(/\s+/g, '')}` }
    : { href: '#enquiry', onClick: () => { document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(focusForm, 600); } };

  return (
    <section id="contact" className="contact section" aria-labelledby="contact-title">
      <div className="contact__glow" aria-hidden="true" />
      <div className="container contact__grid">
        <div className="contact__left">
          <Reveal><p className="eyebrow">Contact</p></Reveal>
          <RevealText as="h2" className="display contact__title" text="Let’s Build Your _Kitchen." />
          <span id="contact-title" hidden>Let’s Build Your Kitchen</span>
          <Reveal delay={0.1}>
            <p className="contact__lead">
              Have a kitchen project in mind? Talk to Shree Shiv Steel Art about your requirements.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="contact__cta">
            <Button {...callProps}>Call Now</Button>
            <Button variant="ghost" href="#enquiry" onClick={() => { document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(focusForm, 600); }}>
              Send Enquiry
            </Button>
          </Reveal>

          <dl className="contact__info">
            <div>
              <dt>Location</dt>
              <dd>
                {BUSINESS.addressLines.map((l) => (<span key={l} className="contact__line">{l}</span>))}
                <a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer">View on map ↗</a>
              </dd>
            </div>
            <div>
              <dt>Hours</dt>
              <dd>{BUSINESS.hours}</dd>
            </div>
            {BUSINESS.phone && (
              <div>
                <dt>Phone</dt>
                <dd><a href={callProps.href}>{BUSINESS.phone}</a></dd>
              </div>
            )}
            <div>
              <dt>Payments</dt>
              <dd>{BUSINESS.payments}</dd>
            </div>
            <div>
              <dt>Directory listing</dt>
              <dd className="contact__small">{BUSINESS.listing}</dd>
            </div>
          </dl>

          <ImageReveal className="contact__img hoverzoom">
            <Img id="c04" sizes="(max-width: 900px) 60vw, 22vw" />
          </ImageReveal>
        </div>

        <div className="contact__right">
          <motion.form
            id="enquiry"
            ref={form}
            className="form"
            onSubmit={submit}
            noValidate
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <h3 className="form__title">Send an enquiry</h3>

            <div className="field">
              <input id="f-name" name="name" type="text" autoComplete="name" placeholder=" " required aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined} />
              <label htmlFor="f-name">Name</label>
              {errors.name && <p className="field__err" id="e-name">{errors.name}</p>}
            </div>
            <div className="form__row">
              <div className="field">
                <input id="f-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder=" " required aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'e-phone' : undefined} />
                <label htmlFor="f-phone">Phone Number</label>
                {errors.phone && <p className="field__err" id="e-phone">{errors.phone}</p>}
              </div>
              <div className="field">
                <input id="f-email" name="email" type="email" autoComplete="email" placeholder=" " aria-invalid={!!errors.email} aria-describedby={errors.email ? 'e-email' : undefined} />
                <label htmlFor="f-email">Email</label>
                {errors.email && <p className="field__err" id="e-email">{errors.email}</p>}
              </div>
            </div>

            <fieldset className="chips">
              <legend>Project Type</legend>
              {TYPES.map((t) => (
                <label key={t} className={`chip${type === t ? ' is-on' : ''}`}>
                  <input type="radio" name="projectType" value={t} checked={type === t} onChange={() => setType(t)} />
                  <span>{t}</span>
                </label>
              ))}
            </fieldset>

            <div className="field">
              <textarea id="f-msg" name="message" rows={3} placeholder=" " />
              <label htmlFor="f-msg">Message</label>
            </div>

            <input className="hp" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <div className="form__foot">
              <Button as="button" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send Enquiry'}
              </Button>
              <p className="form__hint">We’ll respond as soon as we can.</p>
            </div>

            <div aria-live="polite" className="form__status">
              <AnimatePresence>
                {status === 'sent' && (
                  <motion.p key="ok" className="is-ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {note}
                  </motion.p>
                )}
                {status === 'compose' && (
                  <motion.div key="compose" className="compose" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <p>Your enquiry is ready. Choose how to send it to us:</p>
                    <div className="compose__acts">
                      <a className="compose__a" href={`https://wa.me/${BUSINESS.phone.replace(/\D/g, '')}?text=${encodeURIComponent(draft)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                      <a className="compose__a" href={`sms:${BUSINESS.phone.replace(/\s+/g, '')}?body=${encodeURIComponent(draft)}`}>SMS</a>
                      <a className="compose__a" href={callProps.href}>Call {BUSINESS.phone}</a>
                      <button type="button" className="compose__a" onClick={async () => { try { await navigator.clipboard.writeText(draft); setCopied(true); } catch { setCopied(false); } }}>
                        {copied ? 'Copied' : 'Copy text'}
                      </button>
                    </div>
                    <small>Nothing is sent until you choose one of these. WhatsApp only works if this number is on WhatsApp.</small>
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.p key="bad" className="is-bad" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    Something went wrong. Please try again or call us.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
