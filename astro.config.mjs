// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { siteBase, siteUrl } from './site.config.mjs';

// Hosted on GitHub Pages under /cv/ by default. A custom-domain build at the root sets
// SITE_URL=https://listepo.dev SITE_BASE=/ (see site.config.mjs).
export default defineConfig({
  site: siteUrl,
  base: siteBase === '/' ? '/' : siteBase.slice(0, -1),
  vite: { plugins: [tailwindcss()] },
});
