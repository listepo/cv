# cv — Ivan Tuhai (listepo)

One-page personal CV site. Live: https://listepo.github.io/cv/

Astro 5 (static) + Tailwind 4 + OGL: a dark code/terminal aesthetic, a WebGL "graph cube" hero with an electrostatic hover effect, a digital-rain background and rare heading glitches, all respecting `prefers-reduced-motion`.

```sh
npm ci
npm run dev       # http://localhost:4321/cv/
npm run build     # static site in dist/
npm run preview
```

- Content: `src/data/cv.ts`
- Design system and tuning notes: [DESIGN.md](DESIGN.md)
- Deploy: pushes to `main` build and publish via GitHub Actions (`.github/workflows/deploy.yml`) to GitHub Pages.
- Custom domain at the root: `SITE_URL=https://listepo.dev SITE_BASE=/ npm run build`. Both variables are read in `site.config.mjs` and default to `https://listepo.github.io` and `/cv`.
