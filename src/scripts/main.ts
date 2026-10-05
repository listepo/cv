import { mountRain } from './rain';
import { mountGlitch } from './glitch';
import { mountSound } from './sound';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

// 0. Digital rain (after fonts so glyph metrics are stable)
const rain = document.querySelector<HTMLCanvasElement>('#rain');
if (rain) document.fonts.ready.then(() => mountRain(rain, { reduceMotion }));

// 0b. Rare heading/button glitches
mountGlitch({ reduceMotion });

// 0c. Quiet hover tick (Web Audio, off by default, enabled from the nav speaker toggle)
mountSound({ finePointer });

// 1. Lazy WebGL hero graph (static SVG graph stays as fallback)
const host = document.querySelector<HTMLElement>('#hero-3d');
if (host) {
  const probe = document.createElement('canvas');
  const hasGL = !!(probe.getContext('webgl2') || probe.getContext('webgl'));
  if (hasGL) {
    const idle = (cb: () => void) =>
      'requestIdleCallback' in window ? requestIdleCallback(cb, { timeout: 1200 }) : setTimeout(cb, 200);
    idle(() => {
      import('./hero3d')
        .then(({ mountHero3D }) => {
          mountHero3D(host, { reduceMotion });
          host.classList.add('has-webgl');
        })
        .catch(() => { /* keep CSS fallback */ });
    });
  }
}

// 2. Perspective tilt on panes
document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
  const max = Number(el.dataset.tilt) || 4;
  el.addEventListener('pointermove', (e) => {
    if (reduceMotion.matches || !finePointer.matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${x * max * 2}deg`);
    el.style.setProperty('--rx', `${-y * max * 2}deg`);
  });
  el.addEventListener('pointerleave', () => {
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  });
});

// 3. Hero parallax layers
const layers = [...document.querySelectorAll<HTMLElement>('[data-depth]')];
let tx = 0, ty = 0, cx = 0, cy = 0, frame = 0;
const tick = () => {
  cx += (tx - cx) * 0.08;
  cy += (ty - cy) * 0.08;
  for (const l of layers) {
    const d = Number(l.dataset.depth) || 0;
    l.style.translate = `${-cx * d}px ${-cy * d}px`;
  }
  frame = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.0005 ? requestAnimationFrame(tick) : 0;
};
addEventListener('pointermove', (e) => {
  if (reduceMotion.matches || !finePointer.matches) return;
  tx = e.clientX / innerWidth - 0.5;
  ty = e.clientY / innerHeight - 0.5;
  if (!frame) frame = requestAnimationFrame(tick);
}, { passive: true });

// 4. Active nav link
const links = new Map<string, HTMLAnchorElement>();
document.querySelectorAll<HTMLAnchorElement>('.nav__link').forEach((a) => links.set(a.hash.slice(1), a));
const io = new IntersectionObserver((entries) => {
  for (const en of entries) {
    if (!en.isIntersecting) continue;
    links.forEach((a, id) => a.toggleAttribute('aria-current', id === en.target.id));
    links.get(en.target.id)?.setAttribute('aria-current', 'true');
  }
}, { rootMargin: '-45% 0px -50% 0px' });
links.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });

// 5. Scroll reveals (progressive enhancement: nothing is hidden unless this code runs)
const root = document.documentElement;
const revealed: HTMLElement[] = [];
if (!reduceMotion.matches && 'IntersectionObserver' in window) {
  document.querySelectorAll<HTMLElement>('main > section:not(.hero)').forEach((s) => { s.dataset.reveal = ''; revealed.push(s); });
  document.querySelectorAll<HTMLElement>('.about__text, .about__facts .kv, .log, .featured, .ls ul, .contact').forEach((list) => {
    list.dataset.stagger = '';
    [...list.children].forEach((c, i) => (c as HTMLElement).style.setProperty('--i', String(Math.min(i, 8))));
    revealed.push(list);
  });
  const rio = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) { en.target.classList.add('is-in'); rio.unobserve(en.target); }
  }, { rootMargin: '0px 0px -8% 0px' });
  revealed.forEach((el) => rio.observe(el));
  root.classList.add('motion');
}

// 6. Scroll progress bar + light depth parallax (graph drifts and fades out, rain shifts a little)
const bar = document.querySelector<HTMLElement>('.progress > span');
const stage = document.querySelector<HTMLElement>('.hero__stage');
const rainEl = document.querySelector<HTMLElement>('#rain');
let stageTop = 0, stageH = 1, shift = 0, sFrame = 0;
const measure = () => {
  if (!stage) return;
  const r = stage.getBoundingClientRect();
  stageTop = r.top + scrollY - shift;
  stageH = r.height || 1;
};
const onScroll = () => {
  sFrame = 0;
  const y = scrollY;
  const max = root.scrollHeight - innerHeight;
  if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, y / max)).toFixed(4) : 0})`;
  if (reduceMotion.matches) {
    shift = 0;
    stage?.style.removeProperty('transform'); stage?.style.removeProperty('opacity'); rainEl?.style.removeProperty('translate');
    return;
  }
  if (stage) {
    shift = Math.min(y, stageTop + stageH) * 0.14;
    // fade once the top quarter of the graph has scrolled under the top bar
    const out = (y + 56 - (stageTop + stageH * 0.25)) / (stageH * 0.75);
    stage.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
    stage.style.opacity = (1 - Math.min(1, Math.max(0, out))).toFixed(3);
  }
  if (rainEl) rainEl.style.translate = `0 ${(-Math.min(y * 0.03, 48)).toFixed(1)}px`;
};
const requestScroll = () => { if (!sFrame) sFrame = requestAnimationFrame(onScroll); };
measure(); onScroll();
addEventListener('scroll', requestScroll, { passive: true });
addEventListener('resize', () => { measure(); requestScroll(); }, { passive: true });
reduceMotion.addEventListener('change', () => {
  if (reduceMotion.matches) revealed.forEach((el) => el.classList.add('is-in'));
  requestScroll();
});
