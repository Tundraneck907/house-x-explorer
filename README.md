# HOUSE-X — Interactive Building Systems Lab

A browser-based 3D construction explorer for a cold-climate (Fairbanks / North Pole / Interior Alaska) house.
Rotate, zoom, pan, select any of eight assemblies, isolate them, explode their real 3D layers, switch roofing
configurations, cut a section through the house, and read material specifications for ~60 layers.
Runs on desktop and iPhone Safari. No backend, no API keys, no paid services.

## Run locally
```bash
npm install --include=dev   # (--include=dev only needed if NODE_ENV=production)
npm run dev                 # http://localhost:5173
npm run build               # static site in dist/
npm run preview
```

## Deploy (free)
* **GitHub Pages**: push to `main`; enable Settings → Pages → Source: GitHub Actions. `.github/workflows/pages.yml` builds and deploys.
* **Cloudflare Pages / Netlify**: build command `npm run build`, output dir `dist`. (`vite.config.ts` uses a relative `base`, so any sub-path works.)

Environment variables: **none**.

## Stack and cost
| Item | License | Cost |
|---|---|---|
| three.js (WebGL) | MIT | free |
| React 19, Vite, TypeScript | MIT / Apache-2.0 | free |
| All geometry | procedural, original (no 3D assets) | free |
| Hosting | GitHub Pages / Cloudflare Pages / Netlify free tier | free |

Nothing here is paid or subscription-dependent.

## Architecture
* `src/data/catalog.ts` — assemblies, layers, roofing configurations (single source of truth; add a layer here).
* `src/data/info-*.ts` — material information per layer id.
* `src/engine/build/*` — procedural geometry. One builder per assembly returns `LayerRT` objects (a layer = a group of independently movable *parts*).
* `src/engine/Engine.ts` — scene, controls, picking, isolation/ghosting, exploded-view animation, section clipping, camera framing.
* `src/store.ts` — tiny external store; UI and engine both read it.
* `src/ui/*` — React panels and toolbar.

Exploded view moves the real meshes: each part has a direction (roof: up; walls: outward normal; floor: up; foundation: mixed) and a rank (position in the stack) × the Spread slider.
Roofing configurations only toggle layers and restack offsets; geometry for all five systems is built once.

## Controls
Drag = rotate · wheel / pinch = zoom · right-drag / two fingers / arrow keys = pan · tap/click = select ·
keys: **E** explode, **I** isolate, **A** show all, **R** reset camera, **Esc** back.

## Honest limitations
* Illustrative model, not a design. Thin layers (membranes, metal) are drawn thicker than real so they are visible.
* EPDM and modified bitumen are low-slope systems shown on a 6:12 roof for layer comparison only.
* Material text is general guidance. Code references carry a VERIFIED / LIKELY / UNVERIFIED badge; most are not independently verified — confirm the adopted code edition with the local building official. Snow loads, structural sizing, soils/permafrost and foundation design need a licensed professional.
* Foundation is a generic insulated stem wall; Interior Alaska foundations are very site-specific.
