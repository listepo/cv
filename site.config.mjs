// Where the site is served, shared by astro.config.mjs, src/data/cv.ts and scripts/build-pdf.mjs.
// Defaults: the domain root, https://listepo.dev/.
// Another origin or subpath: SITE_URL=https://example.com SITE_BASE=/cv npm run build
const trim = (value) => value.replace(/^\/+|\/+$/g, '');

/** Origin without a trailing slash, e.g. `https://listepo.dev`. */
export const siteUrl = (process.env.SITE_URL || 'https://listepo.dev').replace(/\/+$/, '');

/** Base path with leading and trailing slashes, e.g. `/` at the root, or `/cv/`. */
export const siteBase = trim(process.env.SITE_BASE ?? '/') ? `/${trim(process.env.SITE_BASE ?? '/')}/` : '/';
