# listepo.dev — CV / business card · Design system

One-page personal site for Ivan Tuhai (`listepo`, org `pyrlyn`). UI copy is Russian; code identifiers are English.
Stack: Astro 5 (static) + Tailwind 4 (`@tailwindcss/vite`) + OGL (lazy hero only). Self-hosted fonts via Fontsource.

Run: `npm i && npm run dev` (http://localhost:4321) · `npm run build` → `dist/` · `npm run preview`.

## 1. Section structure

| # | id | Prompt header | Content |
|---|---|---|---|
| — | nav | `>_ listepo.dev` | Sticky glass pill: logo, about/stack/projects/experience, `contact` button. Active link via IntersectionObserver (`aria-current`). |
| 1 | `#top` hero | `~/ivan $ whoami` | Name (h1, mono display), `listepo · engineer`, "open to work" pill, motto, 2 CTAs, stack chips. Stage: lazy OGL glass cube (CSS-3D cube fallback), floating glass terminal (`ls ~/pyrlyn`), `>_ pyrlyn` badge, mouse parallax. |
| 2 | `#about` | `cat about.md` | 3 paragraphs + `profile.toml` key/value card. Location = TODO. |
| 3 | `#stack` | `ls ~/stack` | 4 cards (languages / ui / ai / tooling) with chips. |
| 4 | `#projects` | `ls -la ~/projects` | 4 featured Pyrlyn products as tilt cards (name, status, summary, `$ cmd`, repo link) + `ls -la`-style list of other repos. |
| 5 | `#experience` | `git log --author=ivan --oneline` | Commit-log timeline; entries are TODO placeholders; root commit "GitHub since 2012". |
| 6 | `#contact` | `cat contacts` | Glass panel: GitHub, Pyrlyn, X, LinkedIn rows; Email/Telegram disabled TODO rows. |
| — | footer | `>_ listepo.dev` | © year, pyrlyn link, `cd ~ ↑` back-to-top. |

Heading semantics: one `h1` (name), `h2` per section, `h3` per project/job.

## 2. Visual system tokens

### Colour (dark only, `color-scheme: dark`)
Contrast = WCAG ratio vs `--bg #0a0c0f` / vs `--surface #151a20`.

| Token | Hex | vs bg | vs surface | Use |
|---|---|---|---|---|
| `--bg` | `#0a0c0f` | — | — | Page |
| `--bg-elev` | `#101318` | — | — | Card gradient bottom |
| `--surface` | `#151a20` | — | — | Card gradient top |
| `--surface-2` | `#1b2128` | — | — | Raised inner |
| `--line` | `rgb(255 255 255 / .08)` | — | — | Hairlines |
| `--line-strong` | `rgb(255 255 255 / .14)` | — | — | Borders on chips/ghost buttons |
| `--fg` | `#e6eaee` | 16.20 | 14.47 | Body text |
| `--fg-strong` | `#f6f8fa` | 18.39 | 16.43 | Headings |
| `--muted` | `#9aa5b1` | 7.82 | 6.99 | Secondary text |
| `--subtle` | `#808b97` | 5.65 | 5.05 | Labels, meta (AA for small text) |
| `--accent` | `#6ee7a8` | 12.74 | 11.38 | Prompt path, focus ring, primary button, status "release" |
| `--accent-ink` | `#06140c` | 12.27 on accent | — | Text on accent fill |
| `--accent-2` | `#f2c46d` | 12.02 | 10.74 | Warm: numbers, commit hashes, wip/research, TODO markers |
| info (status active) | `#8fc8ff` | 11.07 | 9.89 | Dir names, status "active" (nod to Pyrlyn landing `#7cc4ff`) |
| `--danger` | `#ff7a7a` | 7.76 | 6.93 | Reserved for errors (not used on the page yet) |

Palette rationale: graphite neutrals + terminal-phosphor mint + amber. Distinct from Pyrlyn landing (blue `#7cc4ff` / warm `#f5b454`) and rtok, but shares the cool-dark base and warm secondary. No purple gradients. Accents live in light (borders, glows, text), never in large surfaces. Status never by colour alone (always a text label).

### Typography
- Display / UI / code: **JetBrains Mono Variable** (`--font-mono`), `calt` + slashed zero.
- Body: **Inter Variable** (`--font-sans`), line-height 1.6, paragraphs ≤ 40rem.

| Token | Size | Use |
|---|---|---|
| `--text-display` | `clamp(2.5rem, 1.4rem + 4.6vw, 4.75rem)` (40→76) | h1, mono 700, tracking −0.05em, lh 1.0 |
| `--text-2xl` | `clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)` (28→40) | h2, mono 600, −0.03em, lh 1.15 |
| `--text-xl` | 1.375rem (22) | Project name |
| `--text-lg` | 1.125rem (18) | Lede, about text, job title |
| `--text-base` | 1rem (16) | Body |
| `--text-sm` | 0.875rem (14) | Prompts, buttons, list rows |
| `--text-xs` | 0.75rem (12) | Chips, labels, status |

### Spacing (4pt base, 8pt rhythm)
`--space-1…32` = 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128 px. Container 1120px, gutters 20px (<768) / 32px. Section padding 80px (mobile) / 96px.

### Radii
`--radius-xs 4` (focus, TODO tag) · `sm 8` (nav links) · `md 12` (buttons, terminal, contact rows) · `lg 16` (cards, nav) · `xl 24` (contact panel) · `full` (chips, pills).

### Elevation
| Token | Value | Use |
|---|---|---|
| `--highlight` | `inset 0 1px 0 rgb(255 255 255 / .07)` | Top lip on every raised surface |
| `--shadow-sm` | 2 layers | Cards at rest |
| `--shadow-md` | 3 layers | Nav, glass panels |
| `--shadow-lg` | 4 layers | Hovered cards, floating hero layers |
| `--glow` | accent ring + −12px spread glow | Primary CTA |
| Glass | `--glass-bg` 7%→2% white, `--glass-border` 11%, blur 14px saturate 140% | Nav, hero terminal/badge, contact panel |
| Glass fallback | `--glass-opaque #12161b` | `prefers-reduced-transparency` and no `backdrop-filter` |

### Motion
`--ease-out cubic-bezier(.22,1,.36,1)`; `--dur-fast 150ms` (colour), `--dur-base 300ms` (lift, borders), `--dur-slow 600ms` (tilt settle).
- Hero: WebGL cube rotation (~0.22 rad/s) + pointer lerp; floating layers 8–9s `--float` ±10px; mouse parallax depth 14/34/48px.
- Cards: perspective(900px) tilt ≤ 4°, lift −4px; content `translateZ(24px)`.
- Sections: CSS `animation-timeline: view()` reveal, progressive.
- `prefers-reduced-motion: reduce`: all animation/transition ≈ 0, no tilt/parallax, WebGL renders one static frame, CSS cube stops.
- WebGL loop pauses offscreen (IntersectionObserver) and on hidden tab; DPR ≤ 2; chunk loaded via dynamic `import()` on idle only when WebGL exists (15 KB gzip).

## 3. Component inventory

| Component | Default | Hover | Focus-visible | Disabled |
|---|---|---|---|---|
| Nav link | `--muted`, mono 14, 40px tall | `--fg-strong`, 5% white bg | 2px accent outline, offset 3 | — |
| Button primary | accent fill, `--accent-ink`, 44px min, accent glow | `#8af0bb`, stronger glow | accent outline offset 3 | `aria-disabled`: 45% opacity, no shadow, `not-allowed` |
| Button ghost | 4% white, `--line-strong` border, highlight | 8% white, border 22% | accent outline | same as primary |
| Chip | 28px pill, mono 12, 3% white, `--line-strong` | accent-tinted bg + border | (non-interactive) | — |
| Status | dot + label: release=accent, active=info, wip/research=amber | — | — | — |
| Prompt header | `path` accent · `$` subtle · `cmd` fg, mono 14 | — | — | — |
| Card | surface→bg-elev gradient, `--line`, r16, highlight + sm | — | — | — |
| Project tilt card | card + tilt vars | tilt ≤4°, lift −4px, shadow-lg, border-strong | whole card outlined (`:has(:focus-visible)`); full-card hit area via stretched link | — |
| ls row (repo list) | grid row, name in info blue, perm/lang columns ≥900px | 3% white bg, name → accent | inset accent outline | — |
| Commit log item | amber hash, accent node dot, card | — | — | — |
| Contact row | 56px, 50% bg, `--line` | accent tint, border accent 40%, lift −2px, arrow accent | accent outline | TODO rows: `aria-disabled`, `not-allowed`, amber dashed TODO tag |
| TODO tag | amber mono, dashed amber border, 8% amber bg | — | — | — |
| Glass terminal | glass + shadow-lg, title bar dots, `pre` body, blinking cursor (static in reduced motion) | — | — | — |
| Hero 3D | OGL Box ×2, edge-glow + grid + sweep shader in accent/amber; `aria-hidden` | pointer-driven rotation (fine pointers only) | — | No WebGL → CSS-3D cube |
| Skip link | hidden above viewport | — | visible top-left, accent fill | — |

Hit targets: all interactive elements ≥ 44px tall (nav links 40px inside a 56px bar). `forced-colors` adds system borders.

## 4. Handoff

### CSS variables
```css
:root {
  color-scheme: dark;
  --bg: #0a0c0f; --bg-elev: #101318; --surface: #151a20; --surface-2: #1b2128;
  --line: rgb(255 255 255 / .08); --line-strong: rgb(255 255 255 / .14);
  --fg: #e6eaee; --fg-strong: #f6f8fa; --muted: #9aa5b1; --subtle: #808b97;
  --accent: #6ee7a8; --accent-ink: #06140c; --accent-soft: rgb(110 231 168 / .12);
  --accent-2: #f2c46d; --info: #8fc8ff; --danger: #ff7a7a;

  --font-mono: "JetBrains Mono Variable", ui-monospace, "SF Mono", Menlo, monospace;
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --text-xs: .75rem; --text-sm: .875rem; --text-base: 1rem; --text-lg: 1.125rem; --text-xl: 1.375rem;
  --text-2xl: clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem);
  --text-display: clamp(2.5rem, 1.4rem + 4.6vw, 4.75rem);

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px; --space-6: 24px;
  --space-8: 32px; --space-10: 40px; --space-12: 48px; --space-16: 64px; --space-20: 80px; --space-24: 96px;

  --radius-xs: 4px; --radius-sm: 8px; --radius-md: 12px; --radius-lg: 16px; --radius-xl: 24px; --radius-full: 999px;

  --highlight: inset 0 1px 0 0 rgb(255 255 255 / .07);
  --shadow-sm: 0 1px 1px rgb(0 0 0 / .3), 0 2px 4px rgb(0 0 0 / .24);
  --shadow-md: 0 1px 1px rgb(0 0 0 / .24), 0 4px 8px rgb(0 0 0 / .24), 0 12px 24px rgb(0 0 0 / .3);
  --shadow-lg: 0 1px 2px rgb(0 0 0 / .24), 0 8px 16px rgb(0 0 0 / .26), 0 24px 48px rgb(0 0 0 / .34), 0 48px 96px rgb(0 0 0 / .4);
  --glow: 0 0 0 1px rgb(110 231 168 / .22), 0 12px 40px -12px rgb(110 231 168 / .45);
  --glass-bg: linear-gradient(180deg, rgb(255 255 255 / .07), rgb(255 255 255 / .02));
  --glass-border: rgb(255 255 255 / .11); --glass-blur: 14px; --glass-opaque: #12161b;

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
  --color-accent: var(--accent); --color-accent-ink: var(--accent-ink); --color-accent-2: var(--accent-2);
  --color-danger: var(--danger);
  --font-mono: var(--font-mono); --font-sans: var(--font-sans);
  --radius-sm: var(--radius-sm); --radius-md: var(--radius-md); --radius-lg: var(--radius-lg); --radius-xl: var(--radius-xl);
  --shadow-sm: var(--shadow-sm); --shadow-md: var(--shadow-md); --shadow-lg: var(--shadow-lg);
  --ease-out: var(--ease-out);
}
```
Usage: `bg-surface text-fg border-line rounded-lg shadow-md font-mono text-accent`.

### Notes
- Content lives in `src/data/cv.ts`; every `TODO:` string renders as an amber TODO tag.
- `og:image` is still TODO (1200×630 PNG at `/og.png`).
- Name: GitHub profile says "Ivan Tugay"; the site uses "Ivan Tuhai" per brief — confirm.

## 5. Content sources
- `gh api users/listepo` (name, hireable, created 2012, X handle, public repo count), `gh api users/listepo/repos`, `gh repo list pyrlyn`, `gh api orgs/pyrlyn`.
- Profile README `listepo/listepo` (role "engineer", motto, X/LinkedIn/GitHub links, project one-liners).
- Org profile `pyrlyn/.github` → `profile/README.md` (Russian product descriptions for ketch, rtok, runa, cox).
- READMEs: `apps/{rtok,ketch,cox,runa,bindsmith,stator}`, `packages/slint_dart`; `apps/landing` (palette only, for harmony).
- No CV/resume/about files were found in ~/Documents, ~/Desktop, ~/Downloads, ~/GitHub.
