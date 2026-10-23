import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const base = read("../src/layouts/Base.astro");

test("robots.txt points at the sitemap index", () => {
  assert.match(read("../public/robots.txt"), /^Sitemap: https:\/\/listepo\.dev\/sitemap-index\.xml$/m);
});

test("sitemap integration is configured and skips the print page", () => {
  const config = read("../astro.config.mjs");
  assert.match(config, /@astrojs\/sitemap/);
  assert.match(config, /print/);
});

test("Base layout ships a large social preview and structured data", () => {
  assert.ok(existsSync(new URL("../public/og.png", import.meta.url)));
  assert.match(base, /twitter:card" content="summary_large_image"/);
  for (const key of ['og:image"', "og:image:width", "og:image:height", "og:image:alt", "twitter:image"]) assert.ok(base.includes(key), key);
  assert.doesNotMatch(base, /TODO/);
  for (const type of ["ProfilePage", "SoftwareApplication", "DeveloperApplication"]) assert.ok(base.includes(type), type);
});
