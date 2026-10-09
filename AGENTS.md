# cv

If an AGENTS.md or CLAUDE.md exists higher in the tree, follow it too. On conflict, ask the creator.

One-page CV site for Ivan Tuhai. Astro 5, Tailwind 4, and OGL. Copy lives in `src/data/cv.ts`. The site is hosted under `/cv` by default (`site.config.mjs`: `site` `https://listepo.github.io`, `base` `/cv`). `SITE_URL` and `SITE_BASE` override both at build time, for example `SITE_URL=https://listepo.dev SITE_BASE=/` for the domain root; never hardcode `/cv` elsewhere.

```sh
npm ci
npm run dev       # http://localhost:4321/cv/
npm run build     # dist/, then dist/ivan-tuhai-cv.pdf
npm run preview
npm test
```

`npm run build` runs `astro build` and then `scripts/build-pdf.mjs`, which prints the print page with headless Chrome through `playwright-core`. Set `CHROME_PATH` to choose the browser. A missing browser fails CI and only warns locally.

`npm test` checks the data in `src/data/cv.ts` and `createNetwork` in `src/scripts/network-sim.ts`. Do not assert on canvas pixels, WebGL, or audio.

Pull requests and pushes run `.github/workflows/ci.yml` (a SHA-pinned caller of `pyrlyn/ci`). Node comes from `mise.toml` (22, same major as the Docker image). The check job runs `npm ci`, `npm test`, and `npm run build`.
