// Hover "tick" for buttons and button-like links. Synthesised with Web Audio (no audio file).
export const SOUND_CONFIG = {
  gain: 0.04,            // peak gain (0.03–0.05 = quiet)
  freqMin: 1300,         // Hz, random pitch per tick in [freqMin, freqMax] so repeats don't grate
  freqMax: 1900,
  glide: 0.82,           // pitch at the end of the tick, as a fraction of the start (soft downward "tic")
  duration: 0.045,       // s, total length (30–60 ms)
  attack: 0.003,         // s, fast attack, exponential decay for the rest
  wave: 'triangle' as OscillatorType,
  throttleMs: 80,        // at most one tick per 80 ms
  storageKey: 'cv:hover-sound', // 'on' | 'off' once the visitor uses the toggle
  selector: '.btn, .nav__link, .wordmark, .contact__row:not(.contact__row--disabled), .sound-toggle',
};
export type SoundConfig = typeof SOUND_CONFIG;
