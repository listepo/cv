// Quiet hover tick (see SOUND_CONFIG / DESIGN.md "Sound").
// - OFF by default; the nav speaker toggle turns it on, and that click creates/resumes the AudioContext.
// - choice persisted in localStorage; returning visitors with sound on get audio unlocked on their first
//   pointerdown/keydown (browser autoplay rules), silent before that.
// - mouse pointers only (never touch/pen), throttled to one tick per SOUND_CONFIG.throttleMs.
import { SOUND_CONFIG as C } from './sound-config';

type Win = Window & { webkitAudioContext?: typeof AudioContext };

export function mountSound(opts: { finePointer: MediaQueryList }) {
  const AC = window.AudioContext || (window as Win).webkitAudioContext;
  const toggle = document.querySelector<HTMLButtonElement>('.sound-toggle');
  if (!AC) return;

  const read = () => { try { return localStorage.getItem(C.storageKey); } catch { return null; } };
  const write = (v: 'on' | 'off') => { try { localStorage.setItem(C.storageKey, v); } catch { /* private mode */ } };
  let on = read() === 'on'; // default off
  const enabled = () => on;

  let ctx: AudioContext | null = null;
  let last = 0;

  const unlock = () => {
    if (!ctx) { try { ctx = new AC(); } catch { return; } }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  };
  // returning visitor with sound on: unlock on the first interaction anywhere
  const firstUnlock = () => { if (on) unlock(); };
  addEventListener('pointerdown', firstUnlock, { capture: true, passive: true });
  addEventListener('keydown', firstUnlock, { capture: true });

  const tick = (force = false) => {
    if (!ctx || ctx.state !== 'running') return;
    if (!force && !enabled()) return;
    const now = performance.now();
    if (now - last < C.throttleMs) return;
    last = now;
    const t = ctx.currentTime;
    const f = C.freqMin + Math.random() * (C.freqMax - C.freqMin);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = C.wave;
    osc.frequency.setValueAtTime(f, t);
    osc.frequency.exponentialRampToValueAtTime(f * C.glide, t + C.duration);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(C.gain, t + C.attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + C.duration);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + C.duration + 0.02);
    osc.onended = () => { osc.disconnect(); g.disconnect(); };
  };

  document.addEventListener('pointerover', (e) => {
    if (e.pointerType !== 'mouse') return; // no sound on touch or pen
    const el = (e.target as Element | null)?.closest?.(C.selector);
    if (!el) return;
    const from = e.relatedTarget as Node | null;
    if (from && el.contains(from)) return; // moving inside the same control
    tick();
  }, { passive: true });

  // Speaker toggle (shown on fine-pointer devices only, since the tick is mouse-only).
  // While off it gets .is-nudging (CSS bounce every ~3.5 s, none under reduced motion); on stops it.
  if (toggle) {
    const sync = () => {
      toggle.setAttribute('aria-pressed', String(on));
      toggle.setAttribute('aria-label', on ? 'Mute sound' : 'Enable sound');
      toggle.title = on ? 'Mute sound' : 'Enable sound';
      toggle.classList.toggle('is-nudging', !on);
    };
    const show = () => { toggle.hidden = !opts.finePointer.matches; };
    sync(); show();
    opts.finePointer.addEventListener('change', show);
    toggle.addEventListener('click', () => {
      on = !on;
      write(on ? 'on' : 'off');
      sync();
      if (on) { unlock(); last = 0; setTimeout(() => tick(true), 40); } // confirmation tick
    });
  }
}
