import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const hero = readFileSync(new URL("../src/components/Hero.astro", import.meta.url), "utf8");
const pdf = readFileSync(new URL("../scripts/build-pdf.mjs", import.meta.url), "utf8");

test("dev links the CV button to the print page; production still downloads the PDF", () => {
  assert.match(hero, /const cvHref = import\.meta\.env\.DEV \? `\$\{base\}print\/` : `\$\{base\}ivan-tuhai-cv\.pdf`/);
  assert.match(hero, /import\.meta\.env\.BASE_URL/);
  assert.doesNotMatch(hero, /href=["']\/cv/);
});

test("build-pdf resolves dist with fileURLToPath", () => {
  assert.match(pdf, /const DIST = fileURLToPath\(new URL\('\.\.\/dist\/', import\.meta\.url\)\)/);
  assert.doesNotMatch(pdf, /new URL\('\.\.\/dist\/', import\.meta\.url\)\.pathname/);
});

test("fileURLToPath decodes spaces and non-ASCII characters in a dist path", () => {
  const meta = new URL("file:///tmp/My%20Projects/%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88/cv/scripts/build-pdf.mjs");
  const dist = fileURLToPath(new URL("../dist/", meta));
  assert.equal(dist, "/tmp/My Projects/プロジェクト/cv/dist/");
  assert.notEqual(new URL("../dist/", meta).pathname, dist);
});
