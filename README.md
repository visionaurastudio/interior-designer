# Shree Shiv Steel Art — website (v2: real photos + 3D studio)

React + TypeScript + Vite · Framer Motion · Lenis · Three.js (React Three Fiber / drei, lazy-loaded).

## Run
```bash
npm install
npm run dev        # development
npm run build      # type-check + production build -> dist/
npm run preview    # serve the production build
```
`dist/` is static with relative paths, so it works on GitHub Pages under `/interior-designer/` (tested by serving
it from a sub-folder) or any other host.

## What changed in this version
* **Photography:** all site imagery now comes from the client's second ZIP (20 photos, `public/images/c01…c20`,
  WebP at 480/960/1440 px). Originals are kept in `assets-original/client-photos/` (not deployed) with
  `FILENAME-MAP.txt` listing the original WhatsApp filenames. The earlier 42-image set was removed from the site.
* **Business details** (`src/config.ts`): address, +91 9892851153 (`tel:` links), hours, payments, services list (11),
  listed-since-2000 wording, directory rating shown only as an unverified directory detail. No email or social links exist.
* **3D Studio** (`src/studio/`): opens full screen from the "See it in 3D" section and the gallery button.
  Modular kitchen (3 layouts), TV unit, wardrobe. All procedural prototypes.
* **Enquiry:** the studio sends its configuration into the enquiry form. With no form service connected the form does
  **not** pretend to send; it offers WhatsApp / SMS / call / copy using the supplied number. To receive enquiries
  directly, set `formEndpoint` in `src/config.ts`.
* Animations, layout, typography and navigation are unchanged. The custom cursor stays removed (previous request).

## Photo → section map
| Section | Photos |
|---|---|
| Hero | c07 (float card: c15) |
| About | c09, c11 |
| Services | c02 modular kitchen, c13 accessories, c15 loft, c10 TV unit (services without a photo show a typographic panel) |
| Gallery | c03, c08, c05, finishes c16–c20, c14, c15, c13, c10, c06, c01 |
| 3D Studio cards | c02, c10 |
| Why us / Process / Contact | c12 / c01 (faint) / c04 |

## 3D studio notes
* `three/` holds geometry, materials, procedural textures, layouts and scenes; `components/` the UI; `Studio.tsx` the shell.
* Materials are updated in place from typed config; geometry/textures/materials are disposed when the studio closes.
* Models are procedural prototypes. To use real `.glb` files, name meshes by surface (base_, wall_, island_, counter_, hardware_)
  and map them to the shared materials; this adapter is not written because no real model exists yet.
