# Shree Shiv Steel Art — website (v3: light catalogue redesign)

React + TypeScript + Vite · Framer Motion · Lenis · 

## Run / build / deploy
```bash
npm install
npm run dev
npm run build      # type-check + production build -> dist/
npm run preview
```
All asset URLs are relative (`base: './'`), so the build works at a domain root (Vercel) or under a sub-path
(GitHub Pages). On Vercel: framework preset Vite, build command `npm run build`, output directory `dist`.

## What changed in v3
* **Redesign** (`src/styles/redesign.css` + new section components): light, catalogue-style layout with a utility
  bar (phone, WhatsApp, free consultation) over a white header, hero + facts strip, service tiles, uppercase section
  titles, large photography, and dark bands for process, contact and footer.
* **Automatic kitchen slider** (`KitchenSlider.tsx`): 10 real kitchen photos, cross-fade, previous/next, indicators,
  swipe, keyboard arrows, pause button, pauses on hover/focus/off-screen/hidden tab, fixed aspect ratio (no layout shift),
  next images load lazily. Autoplay is off for visitors who prefer reduced motion.
* **TV units** and **wardrobes** sections with real photographs and a full-screen viewer.
* **Removed:** the wall-niche (mandir) photo, the ₹400–₹8,000 kitchen-rack price text, the old marquee and decorative blocks.
* **Phone and WhatsApp** stay reachable: utility bar, header, contact section, footer, a fixed Call / Enquire bar on small screens, and a floating green WhatsApp button (bottom-right) that opens `wa.me/919892851153` with a pre-filled message the visitor reviews and sends.
  bar on small screens.
* Business details and the enquiry flow (no fake sends) are unchanged from v2.

## Photo -> section map (v4)
| Section | Photos |
|---|---|
| Hero / What we do (kitchen) / About | c07 / c02 / c09 |
| Kitchen slider (5 slides) | c05, c03, c12, c06, c01 |
| One kitchen, three finishes | c16, c18, c19 |
| Why us / Process (faint) / Contact | c11 / c08 / c04 |
| Kitchen accessories / Kitchen loft tiles | c13 / c15 |
| TV units & feature walls | tv3, c10, tv2, tv1 |
| Wardrobes | wd5, wd4, wd3, wd2, wd1 |
`assets-original/` keeps every supplied photo (not deployed). The separate Gallery section was folded into the category sections.

## v5
* The 3D studio (section, three prototypes, launchers, code and Three.js dependencies) was removed; the kitchen, TV unit and wardrobe sections and their photos are unchanged.
* Removed the product photo that sat at the end of the contact block, just above the footer; the footer itself is now compact.
