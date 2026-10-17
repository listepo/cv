import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(new URL("../src/pages/404.astro", import.meta.url), "utf8");
const nginx = readFileSync(new URL("../docker/nginx.conf", import.meta.url), "utf8");
const pdf = readFileSync(new URL("../scripts/build-pdf.mjs", import.meta.url), "utf8");

test("404 page links home through the configurable base and stays out of search and the PDF", () => {
  assert.match(page, /import\.meta\.env\.BASE_URL/);
  assert.doesNotMatch(page, /href=["']\/cv/);
  assert.match(page, /robots="noindex"/);
  assert.match(nginx, /^[ \t]*error_page 404 \/404\.html;$/m);
  assert.match(pdf, /\$\{BASE\}print\//);
  assert.doesNotMatch(pdf, /404\.html/);
});

test("robots.txt points at the sitemap and the build generates it without the print page", () => {
  const robots = readFileSync(new URL("../public/robots.txt", import.meta.url), "utf8");
  const config = readFileSync(new URL("../astro.config.mjs", import.meta.url), "utf8");
  assert.match(robots, /^Sitemap: https:\/\/listepo\.dev\/sitemap-index\.xml$/m);
  assert.match(config, /sitemap\(\{ filter: \(page\) => !page\.includes\('\/print'\) \}\)/);
});
