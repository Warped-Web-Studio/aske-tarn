# Aske Tarn — a concept by Warped Web Studio

Aske Tarn is a **fictional** architecture practice. This site is a concept project by Warped Web Studio: the buildings, people and texts are invented, and the photographs are temporary (Unsplash, credited on `/studio#colophon`). The site says so in its footer, colophon, contact page and structured data.

## Concept: the section

The site is read as an architectural section drawing:

- **Structural grid.** 4 / 8 / 12 columns on an 8px module, drawn as axes lettered A–M. Every layout sits on it.
- **Datum.** A ground line (±0.00) with hatched poché below it. The hero sets the name *on* the ground line, and where the photograph crosses it the name reads as cut out of the building.
- **Annotation.** Mono labels for levels, dimensions, coordinates and job numbers. Each project image carries a dimension string with a real building dimension.
- **Title block navigation.** On desktop the nav is a drawing sheet's title block. On phones it's a sheet bar at thumb height that opens a sheet index (a native `popover`).
- **Section study (three.js).** A live axonometric card model of *The Salt Archive*. A horizontal cutting plane descends through it as you scroll. Cut faces are filled with poché using stencil capping: solid for concrete, hatched for earth. A native range slider drives the same cut.

## Motion system

There are four verbs, defined once in `app/globals.css` and reused everywhere:

| Verb | Behaviour |
| --- | --- |
| **draw** | lines extend from their origin along their axis |
| **cut** | images open upward from their base, and the photograph settles from 1.08 to 1 |
| **set** | type rises out of a mask, line by line |
| **annotate** | labels arrive after the thing they describe |

- **Easing:** `--ease-draft` (weighted) and `--ease-settle`.
- **Durations:** `--t-micro` 180ms, `--t-set` 760ms, `--t-cut` 1150ms.
- **Reveal trigger:** a single tiny client component (`RevealObserver`).
- **Page transitions:** navigations lay a new sheet over the old one. Project photographs morph across routes with React `<ViewTransition>`.
- **Reduced motion:** with `prefers-reduced-motion`, every hidden state is skipped and the section study becomes a still model driven by the slider. The composition is unchanged.

## Structure

```text
app/                 routes, metadata routes (sitemap, robots, manifest, OG images, icons)
components/drawing/  Axes, Datum, Dimension, SectionMarker, SectionDrawing, PlanDrawing
components/home/     Hero, Monograph, Approach
components/project/  TitleSheet, ProjectBody, Materials, NextSheet
components/three/    SectionStudy (client) + scene.ts (lazy-loaded three.js)
components/site/     SiteChrome (client), Footer, ElevationGauge (CSS-only)
content/             projects, studio, site copy; models/salt-archive.ts; images/
lib/                 formatting, drawing geometry, SEO helpers, OG renderer
```

The Salt Archive's massing data (`content/models/salt-archive.ts`) drives the three.js model, the long-section SVG and the interactive ground-floor plan. All three drawings always agree.

## Performance notes

- Every route is statically prerendered.
- Client JavaScript is limited to navigation, the reveal observer and the section study.
- **three.js** (~130 KB gzip) is dynamically imported only after the page `load` event and when the chapter approaches. It renders on demand, never in a loop, and releases its WebGL context on unmount.
- **Images** are static imports with blur placeholders, AVIF/WebP, and per-frame `sizes`. The hero photograph is the only preloaded, high-priority image.
- **Fonts** are self-hosted through `next/font`: Archivo (with `wdth` axis), Newsreader (`opsz`) and IBM Plex Mono.

## Replacing photography

The manifest `content/images/sources.json` lists every photograph and its credit. To replace an image, drop a new file in with the same name. To change sources, edit the manifest and run `npm run images`, which downloads and applies the shared grade. If you change a project's hero, update `content/images/heroes.ts` (the tests check they match).

## Scripts

```bash
npm run dev         # development server
npm run build       # production build
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm test            # unit tests (node:test) — formatting, model geometry, content integrity
npm run test:e2e    # Playwright against `next start` (run `npm run build` first)
npm run images      # fetch and grade temporary photography
```

Set `NEXT_PUBLIC_SITE_URL` in production so canonical URLs, Open Graph and the sitemap use the real domain.
