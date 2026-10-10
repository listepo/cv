# cv — Ivan Tuhai (listepo)

One-page personal CV site.

Astro 5 (static) + Tailwind 4 + OGL: a dark code/terminal aesthetic, a WebGL "graph cube" hero with an electrostatic hover effect, a digital-rain background and rare heading glitches, all respecting `prefers-reduced-motion`.

```sh
npm ci
npm run dev       # http://localhost:4321/
npm run build     # static site in dist/
npm run preview
```

## Run with Docker

The `Dockerfile` builds the site and the PDF for the domain root (`SITE_URL=https://listepo.dev`,
`SITE_BASE=/`) in a Node 22 stage and serves `dist/` with nginx (`docker/nginx.conf`: static files, gzip,
long-lived cache headers for `/_astro/`). The build stage installs Debian's Chromium for
`scripts/build-pdf.mjs` (`CHROME_PATH=/usr/bin/chromium`, `CI=true`, so a PDF failure fails the build).
The container listens on port 80.

```sh
docker build -t listepo-cv .
docker run -d --name listepo-cv -p 127.0.0.1:8081:80 listepo-cv   # http://localhost:8081/
```

Build args: `SITE_URL`, `SITE_BASE` (`--build-arg SITE_BASE=/cv` to serve under a subpath),
`NODE_VERSION` (22), `NGINX_VERSION` (`1.30-alpine`).

- Content: `src/data/cv.ts`
- Design system and tuning notes: [DESIGN.md](DESIGN.md)
- CI: pull requests and pushes run `.github/workflows/ci.yml`, a caller of [pyrlyn/ci](https://github.com/pyrlyn/ci). It installs Node from `mise.toml`, then `npm ci`, `npm test`, and `npm run build` (site and PDF).
- Another origin or subpath: `SITE_URL=https://example.com SITE_BASE=/cv npm run build`. Both variables are read in `site.config.mjs` and default to `https://listepo.dev` and `/`.
