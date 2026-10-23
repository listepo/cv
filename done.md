# Done

The site already renders the one-page CV, the WebGL hero, the print page, and a post-build PDF.

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

### T9. Upgrade vulnerable site dependencies

The creator approved dependency updates after npm audit reported high and critical advisories. Preserve static routes, content and assets while upgrading Astro and the affected dependency graph.

Execution plan: capture existing tests/build output; update package manifests and lockfile using npm; preserve HTML whitespace behavior; verify tests, build, package audit and site-specific PDF/docs/SEO checks. Update toolchain documentation. Rollback is a revert of this PR; no runtime data migration is involved.

Validation: npm test (11 passing), npm run build (3 routes and a two-page PDF), npm audit (0 vulnerabilities). All routes and extracted HTML text match the Astro 5 baseline. Preserved HTML whitespace with compressHTML: true. Migration references: https://docs.astro.build/en/guides/upgrade-to/v6/ and https://docs.astro.build/en/guides/upgrade-to/v7/ (checked 2026-10-15).

### T4. Security hardening: JSON-LD escaping + SHA-pinned CI actions

Execution plan: add a script-termination regression for JSON-LD serialization; escape literal less-than characters before the raw script insertion; verify CI action pins (already SHA-pinned on current main); run npm tests and the build. Use JSON.stringify and built-in replacement; no matching shared helper or new dependency is needed.

`src/layouts/Base.astro:62` injects `JSON.stringify(jsonLd)` via `set:html` without escaping `<` — not exploitable today (all values hardcoded), but any future `</script>` value breaks out. The sole reusable-workflow action in `.github/workflows/ci.yml` is already pinned by commit SHA. Done means: `<` is escaped as `\u003c` before injection and the existing CI SHA pin is verified (permissions are already minimal).

Validation: the script-termination regression failed before escaping; all 16 tests and the Astro/PDF build pass. The sole CI reusable-workflow action was already SHA-pinned; no pin changes were needed. JSON round-trips preserve the original text.
