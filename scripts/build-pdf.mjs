// Post-build: render dist/print/index.html to dist/ivan-tuhai-cv.pdf (A4) with headless Chrome via playwright-core.
// Runs locally (`npm run build`) and in CI (withastro/action runs the same build script; ubuntu runners ship Google Chrome).
// Set CHROME_PATH to use a specific browser binary. In CI a missing browser fails the build; locally it only warns.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';

const DIST = new URL('../dist/', import.meta.url).pathname;
const BASE = '/cv/';
const OUT = join(DIST, 'ivan-tuhai-cv.pdf');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };

const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (!p.startsWith(BASE)) throw new Error('outside base');
    p = normalize(p.slice(BASE.length)).replace(/^(\.\.[/\\])+/, '');
    let file = join(DIST, p);
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, 'index.html');
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}${BASE}print/`;

let browser;
try {
  browser = process.env.CHROME_PATH
    ? await chromium.launch({ executablePath: process.env.CHROME_PATH })
    : await chromium.launch({ channel: 'chrome' });
} catch (e) {
  server.close();
  const msg = `[build-pdf] no Chrome available (${e.message.split('\n')[0]})`;
  if (process.env.CI) { console.error(msg); process.exit(1); }
  console.warn(`${msg} — skipping PDF locally`);
  process.exit(0);
}
try {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: OUT, format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true, outline: true });
  const pdf = await readFile(OUT);
  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log(`[build-pdf] ${OUT.replace(DIST, 'dist/')} — ${pages} page(s), ${(pdf.length / 1024).toFixed(0)} KB`);
  if (pages > 2) console.warn('[build-pdf] warning: CV is longer than 2 pages');
} finally {
  await browser.close();
  server.close();
}
