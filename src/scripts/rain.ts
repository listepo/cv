// Digital rain: columns of code glyphs + katakana + digits falling behind the page.
// Fixed full-page canvas (aria-hidden, pointer-events: none), DPR-aware, capped at ~30fps,
// paused on hidden tabs, single static frame under prefers-reduced-motion.

const SNIPPETS = [
  'fn main()', 'let mut', '=> {}', 'impl Drop', 'pub struct', '&str', 'Ok(())', '?;', 'async', 'await',
  'cargo run', 'match x', 'Some(v)', 'const', 'import', 'export', 'void', '<T>', '[];', '!= null',
  'git push', 'λ', '0xff', '#[derive]', 'use std', '::new()', '|x|', '&&', '||', '++', '/* */', '//', '{ }',
];
const KATAKANA = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
const SYMBOLS = '0123456789{}[]()<>=+-*/;:_|&!?#$%^~.';

type Column = { x: number; y: number; speed: number; queue: string; trail: number };

const pick = (s: string) => s[(Math.random() * s.length) | 0];
const nextGlyphs = () => {
  const r = Math.random();
  if (r < 0.35) return SNIPPETS[(Math.random() * SNIPPETS.length) | 0];
  let out = '';
  const n = 4 + ((Math.random() * 10) | 0);
  for (let i = 0; i < n; i++) out += Math.random() < 0.5 ? pick(KATAKANA) : pick(SYMBOLS);
  return out;
};

export function mountRain(canvas: HTMLCanvasElement, opts: { reduceMotion: MediaQueryList; color?: string }) {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;
  const color = opts.color ?? '200 240 49'; // --accent #c8f031
  const fps = 30;
  const step = 1000 / fps;
  let cols: Column[] = [];
  let font = 15, cell = 22, w = 0, h = 0, dpr = 1;

  const layout = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const mobile = w < 768;
    font = mobile ? 13 : 15;
    const maxCols = mobile ? 14 : 64;
    cell = Math.max(font * 1.5, w / maxCols);
    const n = Math.ceil(w / cell);
    cols = Array.from({ length: n }, (_, i) => ({
      x: i * cell + cell / 2,
      y: -Math.random() * h * 1.2,
      speed: 0.35 + Math.random() * 0.65,
      queue: nextGlyphs(),
      trail: 0,
    }));
    ctx.font = `500 ${font}px "Geist Mono Variable", ui-monospace, Menlo, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.clearRect(0, 0, w, h);
  };

  const tick = () => {
    // fade previous frame without painting a background (canvas stays transparent)
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgb(0 0 0 / 0.09)';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    for (const c of cols) {
      const prevRow = Math.floor(c.y / font);
      c.y += c.speed * font * 0.55;
      const row = Math.floor(c.y / font);
      if (row !== prevRow && c.y > 0) {
        if (!c.queue.length) c.queue = Math.random() < 0.25 ? '' : nextGlyphs();
        const ch = c.queue ? c.queue[0] : pick(SYMBOLS);
        c.queue = c.queue.slice(1);
        ctx.fillStyle = `rgb(${color} / ${Math.random() < 0.08 ? 0.95 : 0.6})`;
        ctx.fillText(ch, c.x, row * font);
      }
      if (c.y > h + font * 4 && Math.random() > 0.975) {
        c.y = -Math.random() * h * 0.5;
        c.speed = 0.35 + Math.random() * 0.65;
      }
    }
  };

  let raf = 0, last = 0;
  const loop = (t: number) => {
    raf = requestAnimationFrame(loop);
    if (t - last < step) return;
    last = t - ((t - last) % step);
    tick();
  };
  const staticFrame = () => { for (let i = 0; i < 160; i++) tick(); };
  const update = () => {
    const run = !document.hidden && !opts.reduceMotion.matches;
    if (run && !raf) raf = requestAnimationFrame(loop);
    if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
  };

  let rt = 0;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = window.setTimeout(() => { layout(); if (opts.reduceMotion.matches) staticFrame(); }, 150);
  });
  document.addEventListener('visibilitychange', update);
  opts.reduceMotion.addEventListener('change', () => { if (opts.reduceMotion.matches) staticFrame(); update(); });

  layout();
  staticFrame(); // pre-fill so the first paint already has rain (and reduced motion gets a still frame)
  update();
}
