# listepo.dev — CV / business card · Design system

One-page personal site for Ivan Tuhai (`listepo`). UI copy is English (`<html lang="en">`); code identifiers are English.
Stack: Astro 5 (static) + Tailwind 4 (`@tailwindcss/vite`) + OGL (lazy hero only). Self-hosted Geist / Geist Mono via Fontsource.

Run: `npm i && npm run dev` (http://localhost:4321) · `npm run build` → `dist/` · `npm run preview`.

## 0. Identity

A personal identity, deliberately **distinct from the Pyrlyn brand** (Pyrlyn = blue `#4c8dff` / mint `#5ee3a1` / teal `#3ee6c4`, IBM Plex Mono + JetBrains Mono, glass pill nav, `>_` mark).
The CV uses **warm off-white on warm near-black with one signal colour — lime `#c8f031`**, Geist Mono for display, a flat hairline top bar, sharp editor-pane cards, a block-cursor wordmark (`ivan tuhai▌`), a rotating graph cube in the hero and Matrix-style digital rain in the background. Pyrlyn products appear only as projects, in the CV's own style.

## 1. Section structure

No skills, stack or languages lists anywhere (per Ivan). Order follows a resume: about → experience → projects → contact.

| # | id | Prompt header | Content |
|---|---|---|---|
| — | top bar | `ivan tuhai▌` | Sticky flat bar (94% opaque bg, 1px bottom hairline). Numbered mono links `01 about · 02 experience · 03 projects · 04 contact`; lime underline on hover/active. Mobile: only `04 contact`. |
| 1 | `#top` hero | `~/ivan ❯ whoami` | Name (h1, glitch target), `@listepo / founder & CTO of Pyrlyn`, lime "open to offers" tag, motto, primary + outline CTA. Stage: dark radial scrim, lazy OGL graph cube with electrostatic hover (CSS-3D cube fallback), floating frosted `zsh ~/projects` pane. |
| 2 | `#about` | `01 ~/ivan ❯ cat about.md` | 3 paragraphs (career arc, tech-lead track, current roles) + `profile.toml` pane: role, location (country only), dev_since, handle, open_to_work. |
| 3 | `#experience` | `02 … git log --author=ivan --oneline` | One pane as a git-log: hash · title @ org · impact bullets · period · city. 8 detailed roles (Pyrlyn → 111PIX UA) + compact "Earlier · 2009 — 2015" table (6 roles). |
| 4 | `#projects` | `03 … ls -la ~/projects` | 4 featured tilt panes (ketch, rtok, runa, cox) + `ls -la` pane of other repos (no language column). |
| 5 | `#contact` | `04 … cat contacts` | One pane, 2-column rows: email (mailto), linkedin, github, x. |
| — | footer | `listepo.dev▌` | © year Ivan Tuhai, `cd ~ ↑`. |

Heading semantics: one `h1`, `h2` per section, `h3` per project/job. Glitch targets: h1 + every h2 (`data-glitch`).

## 2. Visual system tokens

### Colour
Contrast = WCAG ratio. "Rain peak" = worst case behind text: brightest rain glyph composited over `--bg` (desktop reading column ≈ 7% lime `#181a0c`; mobile ≈ 17% lime `#2b3110`).

| Token | Hex | vs bg | vs surface `#141311` | vs surface-2 | rain peak desktop / mobile | Use |
|---|---|---|---|---|---|---|
| `--bg` | `#0b0a09` | — | — | — | — | Page (warm near-black) |
| `--bg-elev` | `#110f0e` | — | — | — | — | Tags |
| `--surface` | `#141311` | — | — | — | — | Panes |
| `--surface-2` | `#1c1a17` | — | — | — | — | Raised inner |
| `--line` | `rgb(236 231 223 / .09)` | — | — | — | — | Hairlines |
| `--line-strong` | `rgb(236 231 223 / .18)` | — | — | — | — | Tag/outline borders, dashed dividers |
| `--fg` | `#ece7df` | 16.07 | 15.09 | 14.11 | 14.32 / 11.01 | Body (warm off-white) |
| `--fg-strong` | `#faf7f2` | 18.51 | 17.38 | 16.25 | — | Headings |
| `--muted` | `#a8a198` | 7.74 | 7.26 | 6.79 | 6.89 / 5.30 | Secondary text |
| `--subtle` | `#9a948b` | 6.58 | 6.20 | 5.77 | 5.86 / 4.51 | Labels, line numbers |
| `--accent` (lime) | `#c8f031` | 15.04 | 14.12 | 13.20 | 13.39 / 10.30 | Prompt sigil, cursor, primary button, status "release", hashes, rain |
| `--accent-hover` | `#d8f75e` | — | — | — | — | Primary hover (ink 16.38) |
| `--accent-ink` | `#0b0a09` | 15.04 on lime | — | — | — | Text on lime |
| `--accent-soft` | `rgb(200 240 49 / .10)` | — | — | — | — | Row hover |
| `--accent-line` | `rgb(200 240 49 / .45)` | — | — | — | — | TODO border, link underline, orbit |
| `--danger` | `#ff6a4d` | 6.99 | 6.56 | 6.14 | — | State only + glitch red channel |

Rules: lime is the only hue; everything else is warm neutral. No mint, amber, cyan, teal, blue or purple. Status uses glyph + label (`● released`, `◐ active`, `◌ wip/research`), never colour alone.

### Typography
- Display / UI / code: **Geist Mono Variable** (`--font-mono`), `zero` + `ss01`.
- Body: **Geist Variable** (`--font-sans`), line-height 1.6, ≤ 40rem. Only Latin, Latin-ext and (mono) symbols subsets are shipped — see `src/styles/fonts.css`.

| Token | Size | Use |
|---|---|---|
| `--text-display` | `clamp(2.75rem, 1.4rem + 5.4vw, 5.5rem)` (44→88) | h1, mono 600, −0.06em, lh .98 |
| `--text-2xl` | `clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)` (28→40) | h2, mono 600, −0.035em |
| `--text-xl` | 1.375rem | Project name |
| `--text-lg` | 1.125rem | Lede, about, job title |
| `--text-base` | 1rem | Body |
| `--text-sm` | .875rem | Prompts, nav, buttons, rows |
| `--text-xs` | .75rem | Tags, labels, status, hashes |

### Spacing
4pt base: `--space-1…32` = 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128 px. Container 1120px; gutters 20 / 32px; sections 80 / 96px.

### Radii (sharp, editor-like)
`--radius-xs 2` (focus, TODO) · `sm 4` (tags, status tag) · `md 6` (buttons) · `lg 8` (panes) · `full` (dots only).

### Elevation
| Token | Use |
|---|---|
| `--highlight` `inset 0 1px 0 rgb(255 250 240 / .05)` | Top lip on panes |
| `--shadow-sm` (2 layers) | Panes at rest |
| `--shadow-md` (3 layers) | — reserved (popovers) |
| `--shadow-lg` (4 layers) | Hovered project panes, hero frosted pane |
| `--ring-accent` | 1px lime ring (reserved) |
| Frost (hero pane only) | `rgb(20 19 17 / .72)` + blur 12px; opaque `#141311` under `prefers-reduced-transparency` or no `backdrop-filter` |

### 2a. Hero graph cube & electrostatic hover

**Library:** OGL only (already a dependency; no Three.js). Files: `src/scripts/hero3d.ts` (cube, ray picking, loop), `src/scripts/graph-faces.ts` (2D atlas + physics), `src/scripts/cube-config.ts` (all tuning).

**How it's built**
1. A 2D canvas atlas (3×2 cells, 512 px per face; 384 px on stages < 480 px) holds six faces. Each face gets `graphsPerFace.min…max` (2–4) small graphs in a 2-row / 1+2 / 2×2 layout, mixing line, bar, scatter, area and node-graph types. Colours: warm white strokes on `--surface`, one lime highlight per graph.
2. Data morphs smoothly: every `dataChangeInterval` ms about a third of the graphs get new random-walk targets, and values ease toward them by `morphRate` each frame, so nothing jumps.
3. Every graph *element* (line vertex, bar top, scatter dot, graph node) is a particle with rest position (from data), displacement and velocity.
4. **Pull:** on hover, the cursor is ray-cast into the cube (slab test in cube-local space) to get the face-local hit point; that face's charge sits there, the other faces use their centre. Each element gets `F = min(maxForce, chargeStrength / max(d, minDistance)^falloff)` toward the charge (`falloff = 2` → inverse-square). Displacement is clamped to `maxDisplacement × faceSize`.
5. **Cling + sparks:** element pairs on a face closer than `snapDistance` attract each other (`snapStrength`, fading with distance) and draw a lime spark line with a little jitter at its midpoint (up to `maxSparksPerFace`).
6. **Relax:** a spring (`springStiffness`) always pulls elements back to rest and velocity is multiplied by `springDamping` each frame, so when the pointer leaves they settle back with a damped wobble.
7. The atlas is uploaded as an OGL `Texture` (no mipmaps, clamp) at ≤ `textureFps`; the cube itself renders every frame with a soft key light and 1px lime face edges.
8. Touch: a tap toggles the pull on/off (charge = tap hit point). Reduced motion: no rotation, no data changes, no pull — one static frame.

**Tuning (`CUBE_CONFIG`)**
| Key | Default | Effect |
|---|---|---|
| `graphsPerFace` | `{ min: 2, max: 4 }` | Graphs per face |
| `rotationSpeed` | `0.16` rad/s | Cube spin |
| `dataChangeInterval` / `morphRate` | `2800` ms / `0.035` | How often data changes / how fast it morphs |
| `chargeStrength` | `5200` | Pull strength (higher = stronger) |
| `falloff` | `2` | Distance exponent (2 = inverse-square; 1 = softer, longer reach) |
| `minDistance` / `maxForce` | `18` px / `2.4` | Force floor distance / per-frame clamp (stops "explosions") |
| `maxDisplacement` | `0.2` | Max travel from rest, as a fraction of the face |
| `snapDistance` / `snapStrength` | `26` px / `0.06` | Cling radius and pull between neighbours; sparks appear inside this radius |
| `springStiffness` / `springDamping` | `0.06` / `0.84` | Return force / velocity retention (lower damping value = calmer settle) |
| `faceSize` / `faceSizeSmall` / `textureFps` | `512` / `384` / `30` | Texture resolution and redraw cap |

For a subtler effect lower `chargeStrength` or raise `falloff`; for more sparks raise `snapDistance`. Review hook: `window.__cvCube.pull(true)`.

### Motion
`--ease-out cubic-bezier(.22,1,.36,1)`; `--dur-fast 150` · `--dur-base 300` · `--dur-slow 600` ms.
- **Hero graph cube** (OGL): see §2a. Rotation 0.16 rad/s, textures redrawn at ≤ 30 fps, DPR ≤ 2, paused offscreen / hidden tab, static cube + static graphs under reduced motion. Chunk ≈ 19 KB gzip, dynamic `import()` on idle.
- **Digital rain** (`#rain`, 2D canvas, fixed, `pointer-events: none`, `aria-hidden`): code snippets (`fn main()`, `Ok(())`, `=> {}`, `#[derive]`…) mixed with half-width katakana, digits and symbols; lime only. ~30 fps cap, DPR-aware, ≤ 64 columns desktop / ≤ 14 mobile, transparent trails via `destination-out`. Opacity .5 with a horizontal mask (edges 100% → reading column 14%); mobile .18 without mask. Paused when the tab is hidden; reduced motion = one pre-simulated static frame. Hero stage adds a dark radial scrim so the rain recedes behind the cube.
- **Glitch** (`[data-glitch]`: h1 + h2s): every 4–9 s one visible heading at random; 4 frames over ~260 ms (scramble 55% → 5%, `clip-path` slice jitter ±3px, RGB split via `text-shadow` red/lime). ≤ 1 event per 4 s — far under the 3 flashes/s limit. Scramble lives in an `aria-hidden` overlay; the real text node never changes. Disabled entirely under reduced motion.
- Panes: perspective(1000px) tilt ≤ 3°, lime rail grows on the left edge, shadow → lg.
- Hero frosted pane floats ±8px / 9 s; parallax depth 12/30 px (fine pointers only).
- Sections: CSS `animation-timeline: view()` reveal (progressive).
- `prefers-reduced-motion`: all CSS animation/transition ≈ 0; no tilt, parallax, glitch; cube + graphs + rain static, no hover pull.

## 3. Component inventory

| Component | Default | Hover | Focus-visible | Disabled |
|---|---|---|---|---|
| Top bar link | `NN label`, muted, 44px | fg-strong + lime underline grows | 2px lime outline offset 3 | — |
| Wordmark | `ivan tuhai` + lime block cursor | — | lime outline | — |
| Button primary | lime fill, ink text, r6, 44px | `--accent-hover` | lime outline | `aria-disabled`: 45% opacity, `not-allowed` |
| Button outline | transparent, `--line-strong` border | border → fg, text → fg-strong | lime outline | same |
| Open-to-work tag | lime fill, ink text | — | — | — |
| Status | glyph + label; release lime, active fg, wip/research muted | — | — | — |
| Prompt | `NN` subtle · path muted · `❯` lime · cmd fg | — | — | — |
| Pane | surface, 1px line, r8, highlight + sm; optional 36px tab strip (`file` · meta) | — | — | — |
| Project tilt pane | pane + index + status + dashed footer | tilt ≤3°, lime left rail, shadow-lg | whole pane outlined (`:has(:focus-visible)`), stretched-link hit area | — |
| ls row | name fg-strong, perm/lang columns ≥900px | lime-soft bg, name lime | inset lime outline | — |
| Git-log row | lime hash, title @ org (org links when a URL exists), dash bullets in muted, right-aligned period · city | org link: lime underline | lime outline on link | — |
| Earlier-roles table | org · title · period, 3 columns ≥768px, stacked below | — | — | — |
| Contact row | 60px, key subtle, value mono; email row uses `mailto:` and `→`, others open a new tab with `↗` | lime-soft bg, arrow lime + nudge | inset lime outline | — |
| TODO tag | dashed lime border, diagonal lime stripes, fg text | — | — | — |
| Frosted hero pane | frost + shadow-lg, `zsh` tab, `pre` listing, blinking block cursor | — | — | opaque under reduced transparency |
| Hero graph cube | OGL cube, 6 faces × 2–4 live graphs, lime edges, `aria-hidden` | mouse: electrostatic pull toward the cursor hit point, cling + sparks; leave: spring back. Touch: tap toggles the pull | — | No WebGL → CSS-3D cube with static SVG graphs; reduced motion → static frame, pull disabled |
| Digital rain | fixed canvas behind content | — | — | reduced motion → static; forced colours → hidden |
| Glitch overlay | hidden | — | — | reduced motion → never runs |
| Skip link | off-screen | — | visible, lime fill | — |

Hit targets ≥ 44px. `forced-colors`: system borders, rain/scanlines hidden.

## 4. Handoff

### CSS variables
```css
:root {
  color-scheme: dark;
  --bg: #0b0a09; --bg-elev: #110f0e; --surface: #141311; --surface-2: #1c1a17;
  --line: rgb(236 231 223 / .09); --line-strong: rgb(236 231 223 / .18);
  --fg: #ece7df; --fg-strong: #faf7f2; --muted: #a8a198; --subtle: #9a948b;
  --accent: #c8f031; --accent-hover: #d8f75e; --accent-ink: #0b0a09;
  --accent-soft: rgb(200 240 49 / .10); --accent-line: rgb(200 240 49 / .45);
  --danger: #ff6a4d;

  --font-mono: "Geist Mono Variable", ui-monospace, "SF Mono", Menlo, monospace;
  --font-sans: "Geist Variable", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --text-xs: .75rem; --text-sm: .875rem; --text-base: 1rem; --text-lg: 1.125rem; --text-xl: 1.375rem;
  --text-2xl: clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem);
  --text-display: clamp(2.75rem, 1.4rem + 5.4vw, 5.5rem);

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px; --space-6: 24px;
  --space-8: 32px; --space-10: 40px; --space-12: 48px; --space-16: 64px; --space-20: 80px; --space-24: 96px;

  --radius-xs: 2px; --radius-sm: 4px; --radius-md: 6px; --radius-lg: 8px; --radius-full: 999px;

  --highlight: inset 0 1px 0 0 rgb(255 250 240 / .05);
  --shadow-sm: 0 1px 1px rgb(0 0 0 / .4), 0 2px 6px rgb(0 0 0 / .3);
  --shadow-md: 0 1px 2px rgb(0 0 0 / .4), 0 6px 12px rgb(0 0 0 / .32), 0 16px 32px rgb(0 0 0 / .36);
  --shadow-lg: 0 1px 2px rgb(0 0 0 / .4), 0 10px 20px rgb(0 0 0 / .34), 0 28px 56px rgb(0 0 0 / .42), 0 56px 112px rgb(0 0 0 / .46);
  --frost-bg: rgb(20 19 17 / .72); --frost-blur: 12px; --frost-opaque: #141311;

  --ease-out: cubic-bezier(.22, 1, .36, 1); --dur-fast: 150ms; --dur-base: 300ms; --dur-slow: 600ms;
}
```

### Tailwind 4 `@theme`
```css
@import "tailwindcss";
@theme inline {
  --color-bg: var(--bg); --color-bg-elev: var(--bg-elev);
  --color-surface: var(--surface); --color-surface-2: var(--surface-2); --color-line: var(--line);
  --color-fg: var(--fg); --color-fg-strong: var(--fg-strong); --color-muted: var(--muted); --color-subtle: var(--subtle);
  --color-accent: var(--accent); --color-accent-ink: var(--accent-ink); --color-danger: var(--danger);
  --font-mono: var(--font-mono); --font-sans: var(--font-sans);
  --radius-sm: var(--radius-sm); --radius-md: var(--radius-md); --radius-lg: var(--radius-lg);
  --shadow-sm: var(--shadow-sm); --shadow-md: var(--shadow-md); --shadow-lg: var(--shadow-lg);
  --ease-out: var(--ease-out);
}
```

### Notes
- Content lives in `src/data/cv.ts`; every `TODO:` string renders as a TODO tag.
- `og:image` is still TODO (1200×630 PNG at `/og.png`).
- Name: English spelling is "Ivan Tuhai" (confirmed by Ivan). LinkedIn now uses the resume's vanity URL `linkedin.com/in/listepo`.
- `window.__cvGlitch(selector)` freezes a glitch frame — used only for review screenshots.
- Body has no background on purpose (html paints `--bg`), otherwise the fixed rain/backdrop layers at negative z-index would be covered.

## 5. Content sources
- **Resume PDF** (LinkedIn export, Oct 2026): role at Pyrlyn, location (Ukraine), email, LinkedIn `in/listepo`, all employers, titles, dates, cities and the few achievement notes. Rephrased into impact bullets; nothing added. Skills and spoken-language blocks deliberately omitted; framework lists ("Technologies: …") dropped. Resume content translated from Russian into English.
- `gh api users/listepo` (name, hireable, created 2012, X handle, public repo count), `gh api users/listepo/repos`, `gh repo list pyrlyn`, `gh api orgs/pyrlyn`.
- Profile README `listepo/listepo` (role "engineer", motto, X/LinkedIn/GitHub links, project one-liners).
- Org profile `pyrlyn/.github` → `profile/README.md` (product descriptions for ketch, rtok, runa, cox; translated to English, cross-checked with the English READMEs).
- READMEs: `apps/{rtok,ketch,cox,runa,bindsmith,stator}`, `packages/slint_dart`; `apps/landing` (palette only, for harmony).
- No CV/resume/about files were found in ~/Documents, ~/Desktop, ~/Downloads, ~/GitHub.
