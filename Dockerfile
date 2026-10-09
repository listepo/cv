# syntax=docker/dockerfile:1
# Root build of the CV (site + PDF) served by nginx. See "Run with Docker" in README.md.
#   docker build -t listepo-cv .
#   docker run -d --name listepo-cv -p 8081:80 listepo-cv     # http://localhost:8081/

ARG NODE_VERSION=22
ARG NGINX_VERSION=1.30-alpine

FROM node:${NODE_VERSION}-bookworm-slim AS build
# Debian's Chromium prints the PDF (scripts/build-pdf.mjs reads CHROME_PATH); CI=true makes a missing
# or broken browser fail the build instead of silently skipping the PDF.
RUN apt-get update \
 && apt-get install -y --no-install-recommends chromium \
 && rm -rf /var/lib/apt/lists/*
ENV CHROME_PATH=/usr/bin/chromium CI=true
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# Served at the domain root by default; SITE_BASE=/cv builds the GitHub Pages layout instead.
ARG SITE_URL=https://listepo.dev
ARG SITE_BASE=/
ENV SITE_URL=${SITE_URL} SITE_BASE=${SITE_BASE}
RUN npm run build && test -f dist/index.html && test -f dist/404.html && test -f dist/ivan-tuhai-cv.pdf

FROM nginx:${NGINX_VERSION}
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
