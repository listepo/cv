// Manual script (not part of the build): renders public/og.png (1200×630) with headless Chrome.
//   node scripts/make-og.mjs      (set CHROME_PATH to pick a browser)
// Colors and fonts follow DESIGN.md: --bg #0b0a09, --fg-strong #faf7f2, --muted #a8a198, --accent #c8f031, Geist / Geist Mono.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const font = async (pkg, file) =>
  (await readFile(fileURLToPath(new URL(`../node_modules/@fontsource-variable/${pkg}/files/${file}`, import.meta.url)))).toString('base64');
const [geist, mono] = await Promise.all([
  font('geist', 'geist-latin-wght-normal.woff2'),
  font('geist-mono', 'geist-mono-latin-wght-normal.woff2'),
]);

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:G;src:url(data:font/woff2;base64,${geist});font-weight:100 900}
@font-face{font-family:M;src:url(data:font/woff2;base64,${mono});font-weight:100 900}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0b0a09;color:#ece7df;font-family:G;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between;border-left:8px solid #c8f031}
.prompt{font:500 28px M;color:#c8f031}
h1{font:700 88px/1.05 G;color:#faf7f2;letter-spacing:-0.03em;margin-top:28px}
p{font:400 38px/1.3 G;color:#a8a198;margin-top:20px}
.tags{display:flex;gap:16px}
.tags span{font:500 30px M;color:#ece7df;border:2px solid rgb(236 231 223/.18);background:#110f0e;padding:10px 22px;border-radius:8px}
.foot{font:500 28px M;color:#9a948b;display:flex;justify-content:space-between}
</style><body><div><div class="prompt">$ whoami</div><h1>Ivan Tuhai</h1><p>Founder &amp; CTO of Pyrlyn</p></div>
<div class="tags"><span>ketch</span><span>rtok</span><span>runa</span><span>cox</span></div>
<div class="foot"><span>@listepo</span><span>listepo.dev</span></div></body>`;

const browser = process.env.CHROME_PATH
  ? await chromium.launch({ executablePath: process.env.CHROME_PATH })
  : await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await writeFile(fileURLToPath(new URL('../public/og.png', import.meta.url)), await page.screenshot({ type: 'png' }));
await browser.close();
