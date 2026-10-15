// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { siteBase, siteUrl } from './site.config.mjs';

// Served at the root of https://listepo.dev by default; SITE_URL and SITE_BASE override
// both (see site.config.mjs).
export default defineConfig({
  // Keep pre-Astro-7 spacing between inline elements.
  compressHTML: true,
  site: siteUrl,
  base: siteBase === '/' ? '/' : siteBase.slice(0, -1),
  vite: { plugins: [tailwindcss()] },
});
