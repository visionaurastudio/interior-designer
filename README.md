# Shree Shiv Steel Art — website

React + TypeScript + Vite · Framer Motion · Lenis (smooth scroll). Self-hosted fonts (Cormorant Garamond, Manrope).
All photography is the business's own, supplied in the ZIP (optimised to WebP, two or three sizes each).

## Run
```bash
npm install
npm run dev        # local development
npm run build      # production build -> dist/
npm run preview    # serve the production build
```
`dist/` (already built and included in this package) is fully static and uses relative paths, so it can be
uploaded to any host or opened from any sub-folder.

## Before going live — fill in `src/config.ts`
Nothing below was invented; it is deliberately blank until the owner supplies it.

| Setting        | Effect |
|----------------|--------|
| `phone`        | Enables "Call Now" as a real `tel:` link and shows the number in Contact. Until set, "Call Now" jumps to the enquiry form. |
| `email`        | Enquiry form opens the visitor's mail app addressed to this email. |
| `formEndpoint` | Preferred: any service that accepts a JSON POST (Formspree, Getform, own API). Overrides `email`. |

While none is set, the form validates and shows a "preview" confirmation — it does not send anything.

Also: set an absolute URL for `og:image` in `index.html`, and add a domain-based sitemap/canonical if desired.

## Structure
```
src/
  config.ts            business details, nav
  data/photos.ts       every photo: size, alt text, label; GALLERY_ORDER drives the lightbox
  components/          Hero, About, Services, Gallery, Lightbox, WhyUs, Process, Contact, Footer …
  styles/              base.css · sections.css · gallery.css
public/images/         optimised WebP (NN-480 / -736, hero also -1472)
```
To swap or add a photo: drop WebP files in `public/images/`, add an entry in `src/data/photos.ts`,
and place it in `Gallery.tsx` / `GALLERY_ORDER`.

## Notes
* Testimonials and the 4.6★ rating are intentionally not shown (no real reviews supplied; 4 ratings is a thin sample).
* Animations respect `prefers-reduced-motion`; smooth-scroll and the custom cursor are desktop-only.
* Source photos are ~736 px wide. They look sharp at gallery sizes; full-bleed uses (hero, wide moment) are
  upscaled — replace with original high-resolution files whenever available for a crisper result.
