// Light/dark theme. The inline script in Base.astro has already set html[data-theme] before first paint
// (saved choice → prefers-color-scheme → dark). This module wires the nav toggle, keeps
// <meta name="theme-color"> in sync and tells canvas/WebGL layers to re-read their colours ('cv:theme').
export type Theme = 'light' | 'dark';
export const THEME_KEY = 'cv:theme';
export const THEME_BG: Record<Theme, string> = { dark: '#0b0a09', light: '#f4f0e8' }; // == --bg of each theme

export const currentTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

/** "r g b" channel CSS variable → [r, g, b] in 0..1 */
export function readRgb(name: string, fallback: [number, number, number]): [number, number, number] {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).map(Number);
  return v.length === 3 && v.every((n) => Number.isFinite(n)) ? [v[0] / 255, v[1] / 255, v[2] / 255] : fallback;
}

export function mountTheme() {
  const root = document.documentElement;
  const btn = document.querySelector<HTMLButtonElement>('.theme-toggle');
  const osLight = matchMedia('(prefers-color-scheme: light)');
  const saved = (): Theme | null => {
    try { const v = localStorage.getItem(THEME_KEY); return v === 'light' || v === 'dark' ? v : null; } catch { return null; }
  };

  const sync = () => {
    if (!btn) return;
    const dark = currentTheme() === 'dark';
    btn.setAttribute('aria-pressed', String(dark));
    btn.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
  };
  const apply = (t: Theme) => {
    root.dataset.theme = t;
    root.style.colorScheme = t;
    // manual choice: both media-specific metas carry the chosen colour; following the OS: each keeps its own
    const manual = saved() !== null;
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
      const own: Theme = (m.media || '').includes('light') ? 'light' : 'dark';
      m.content = THEME_BG[manual ? t : own];
    });
    sync();
    dispatchEvent(new CustomEvent<Theme>('cv:theme', { detail: t }));
  };

  btn?.addEventListener('click', () => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(THEME_KEY, next); } catch { /* private mode: still switch for this page */ }
    apply(next);
  });
  // no saved choice → keep following the OS live
  osLight.addEventListener('change', () => { if (!saved()) apply(osLight.matches ? 'light' : 'dark'); });
  if (btn) btn.hidden = false;
  sync();
}
