// Rare "bad signal" glitch on headings marked [data-glitch].
// - one element at a time, every 4–9s at random, each glitch ~240ms (≤ 1 flash per second)
// - scramble + RGB split + slice jitter happen in an aria-hidden overlay; the real text node is never changed
// - fully disabled under prefers-reduced-motion
const GLYPHS = '01<>/{}[]=+*#$%&?ｱｶｻﾀﾅﾊﾏﾔﾗﾜ';

type Target = { el: HTMLElement; text: string; layer: HTMLSpanElement };

function prepare(el: HTMLElement): Target {
  const text = el.textContent ?? '';
  el.innerHTML = '';
  const real = document.createElement('span');
  real.className = 'glitch-real';
  real.textContent = text;
  const layer = document.createElement('span');
  layer.className = 'glitch-layer';
  layer.setAttribute('aria-hidden', 'true');
  layer.hidden = true;
  el.append(real, layer);
  return { el, text, layer };
}

const scramble = (text: string, amount: number) =>
  [...text].map((ch) => (ch !== ' ' && Math.random() < amount ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : ch)).join('');

const slice = () => {
  const top = Math.random() * 70;
  const bottom = Math.max(0, 100 - top - (12 + Math.random() * 30));
  return `inset(${top.toFixed(0)}% 0 ${bottom.toFixed(0)}% 0)`;
};

export function mountGlitch(opts: { reduceMotion: MediaQueryList }) {
  const targets = [...document.querySelectorAll<HTMLElement>('[data-glitch]')].map(prepare);
  if (!targets.length) return;
  let busy = false;
  let timer = 0;

  const frame = (t: Target, amount: number, jitter: boolean) => {
    t.layer.textContent = scramble(t.text, amount);
    t.layer.style.clipPath = jitter ? slice() : 'none';
    t.layer.style.transform = jitter ? `translateX(${(Math.random() * 6 - 3).toFixed(1)}px)` : 'none';
  };

  const run = (t: Target, hold = false) => {
    if (busy || opts.reduceMotion.matches) return;
    busy = true;
    t.layer.hidden = false;
    t.el.classList.add('is-glitching');
    if (hold) { frame(t, 0.5, true); return; } // screenshot/debug: freeze mid-glitch
    const seq: Array<[number, number, boolean]> = [[0, 0.55, true], [70, 0.35, true], [140, 0.15, false], [200, 0.05, true]];
    for (const [at, amount, jitter] of seq) setTimeout(() => frame(t, amount, jitter), at);
    setTimeout(() => {
      t.layer.hidden = true;
      t.el.classList.remove('is-glitching');
      busy = false;
    }, 260);
  };

  const visible = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight;
  };
  const schedule = () => {
    clearTimeout(timer);
    if (opts.reduceMotion.matches) return;
    timer = window.setTimeout(() => {
      if (!document.hidden) {
        const pool = targets.filter((t) => visible(t.el));
        if (pool.length) run(pool[(Math.random() * pool.length) | 0]);
      }
      schedule();
    }, 4000 + Math.random() * 5000);
  };
  opts.reduceMotion.addEventListener('change', schedule);
  schedule();

  // debug hook used only for the review screenshots: window.__cvGlitch('#hero-title')
  (window as unknown as { __cvGlitch: (sel: string) => void }).__cvGlitch = (sel) => {
    const t = targets.find((x) => x.el.matches(sel));
    if (t) run(t, true);
  };
}
