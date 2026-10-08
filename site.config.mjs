// Where the site is served, shared by astro.config.mjs, src/data/cv.ts and scripts/build-pdf.mjs.
// Defaults: GitHub Pages under https://listepo.github.io/cv/.
// Custom domain at the root: SITE_URL=https://listepo.dev SITE_BASE=/ npm run build
const trim = (value) => value.replace(/^\/+|\/+$/g, '');

/** Origin without a trailing slash, e.g. `https://listepo.github.io`. */
export const siteUrl = (process.env.SITE_URL || 'https://listepo.github.io').replace(/\/+$/, '');

/** Base path with leading and trailing slashes, e.g. `/cv/`, or `/` at the root. */
export const siteBase = trim(process.env.SITE_BASE ?? '/cv') ? `/${trim(process.env.SITE_BASE ?? '/cv')}/` : '/';
