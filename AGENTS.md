# cv

If an AGENTS.md or CLAUDE.md exists higher in the tree, follow it too. On conflict, ask the creator.

One-page CV site for Ivan Tuhai. Astro 5, Tailwind 4, and OGL. Copy lives in `src/data/cv.ts`. The site is hosted under `/cv` (`astro.config.mjs`: `site` `https://listepo.github.io`, `base` `/cv`).

```sh
npm ci
npm run dev       # http://localhost:4321/cv/
npm run build     # dist/, then dist/ivan-tuhai-cv.pdf
npm run preview
npm test
```

`npm run build` runs `astro build` and then `scripts/build-pdf.mjs`, which prints the print page with headless Chrome through `playwright-core`. Set `CHROME_PATH` to choose the browser. A missing browser fails CI and only warns locally.

`npm test` checks the data in `src/data/cv.ts` and `createNetwork` in `src/scripts/network-sim.ts`. Do not assert on canvas pixels, WebGL, or audio.
