// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Hosted on GitHub Pages under /cv/. To move to a custom domain (e.g. listepo.dev),
// set site to that origin, base to '/', and update `site` in src/data/cv.ts.
export default defineConfig({
  site: 'https://listepo.github.io',
  base: '/cv',
  vite: { plugins: [tailwindcss()] },
});
