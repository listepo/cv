# Toolchain

| Program | How to install | Why here | Source |
| --- | --- | --- | --- |
| node | nodejs.org | Run Astro, the PDF script, and the tests | https://nodejs.org/ |
| npm | bundled with node | Install packages and run scripts | https://github.com/npm/cli |
| Google Chrome | google.com/chrome, or the browser on the GitHub-hosted runner | `scripts/build-pdf.mjs` drives it through `playwright-core`. `CHROME_PATH` overrides the lookup | https://www.google.com/chrome/ |

| Package | Where | Source | Why here |
| --- | --- | --- | --- |
| astro | local | https://github.com/withastro/astro | Static site |
| tailwindcss | local | https://github.com/tailwindlabs/tailwindcss | Utilities |
| @tailwindcss/vite | local | https://github.com/tailwindlabs/tailwindcss | Tailwind Vite plugin |
| ogl | local | https://github.com/oframe/ogl | WebGL hero graph |
| @fontsource-variable/geist | local | https://github.com/fontsource/fontsource | UI font |
| @fontsource-variable/geist-mono | local | https://github.com/fontsource/fontsource | Mono font |
| playwright-core | local | https://github.com/microsoft/playwright | Headless Chrome for the PDF |
