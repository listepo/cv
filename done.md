# Done

The site already renders the one-page CV, the WebGL hero, the print page, and a post-build PDF. Pushes to `main` publish GitHub Pages via `.github/workflows/deploy.yml`.

### T1. "Download CV (PDF)" 404s in dev

The hero linked to `<base>ivan-tuhai-cv.pdf`, which is written only into `dist/` after `astro build`. In `npm run dev` the button now opens `<base>print/`. A production build still downloads the PDF.

### T2. DIST path breaks on non-ASCII/space paths

`scripts/build-pdf.mjs` took `dist/` from `URL.pathname`, which stays percent-encoded, so `stat` and `readFile` failed for a checkout path with spaces or non-ASCII characters. It now uses `fileURLToPath`.

### T9. Add the required project files

The project was missing `AGENTS.md`, `done.md`, `roadmap.md`, `ideas.md`, and `toolchain.md`. Done means: all files exist, with the real toolchain (Node, npm, Astro, headless Chrome) in `toolchain.md`.

Those files are in the repo root. `toolchain.md` lists Node, npm, Astro, and headless Chrome.

### T10. Test CV data and the network simulation

`src/data/cv.ts` and `createNetwork` return data the page renders, and nothing checked them. Canvas, WebGL, and audio stay out of the suite. Done means: `npm test` checks the content invariants and that a small network is finite and connected.

`node --test tests/*.test.mjs` passed 6 tests: site and project invariants, contact links, experience shape, config ranges, and a connected `createNetwork` graph. Hero, rain, glitch, and hover sound stay untested.
