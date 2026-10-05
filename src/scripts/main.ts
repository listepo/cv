import { mountRain } from './rain';
import { mountGlitch } from './glitch';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

// 0. Digital rain (after fonts so glyph metrics are stable)
const rain = document.querySelector<HTMLCanvasElement>('#rain');
if (rain) document.fonts.ready.then(() => mountRain(rain, { reduceMotion }));

// 0b. Rare heading glitches
mountGlitch({ reduceMotion });

// 1. Lazy WebGL hero (CSS-3D cube stays as fallback)
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
