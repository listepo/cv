// Lazy-loaded WebGL hero ornament: a "dot-matrix globe" — a sphere of square
// pixel-points with a tilted orbit ring. Matches the digital-rain cells.
// Decorative only (host is aria-hidden). Pauses offscreen / hidden tab; static frame under reduced motion.
import { Renderer, Camera, Transform, Program, Mesh, Geometry } from 'ogl';

const vertex = /* glsl */ `
attribute vec3 position;
attribute float aSeed;
attribute float aKind;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uDpr;
varying float vAlpha;
varying float vLit;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = clamp((-mv.z - 4.6) / 2.6, 0.0, 1.0); // 0 = front, 1 = back
  float tw = 0.5 + 0.5 * sin(uTime * (0.6 + aSeed * 1.8) + aSeed * 40.0);
  vLit = aKind > 0.5 ? 1.0 : step(0.93, aSeed) * step(0.45, tw);
  vAlpha = mix(1.0, 0.16, depth) * (aKind > 0.5 ? 0.85 : 0.55 + 0.45 * tw);
  gl_PointSize = (aKind > 0.5 ? 2.2 : 2.8) * uDpr * (1.25 - depth * 0.5);
}`;

const fragment = /* glsl */ `
precision highp float;
uniform vec3 uFg;
uniform vec3 uAccent;
varying float vAlpha;
varying float vLit;
void main() {
  vec3 col = mix(uFg, uAccent, vLit);
  gl_FragColor = vec4(col, vAlpha);
}`;

function buildPoints(sphereCount: number, ringCount: number) {
  const n = sphereCount + ringCount;
  const position = new Float32Array(n * 3);
  const seed = new Float32Array(n);
  const kind = new Float32Array(n);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < sphereCount; i++) {
    const y = 1 - (i / (sphereCount - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    position.set([Math.cos(t) * r, y, Math.sin(t) * r], i * 3);
    seed[i] = Math.random();
  }
  const tilt = -0.42;
  for (let j = 0; j < ringCount; j++) {
    const i = sphereCount + j;
    const a = (j / ringCount) * Math.PI * 2;
    const x = Math.cos(a) * 1.55, z = Math.sin(a) * 1.55;
    position.set([x, -z * Math.sin(tilt), z * Math.cos(tilt)], i * 3);
    seed[i] = Math.random();
    kind[i] = 1;
  }
  return { position, seed, kind };
}

export function mountHero3D(host: HTMLElement, opts: { reduceMotion: MediaQueryList }) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const renderer = new Renderer({ alpha: true, antialias: false, dpr });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  host.prepend(gl.canvas as HTMLCanvasElement);

  const camera = new Camera(gl, { fov: 30 });
  camera.position.z = 5.9;
  const scene = new Transform();

  const small = host.getBoundingClientRect().width < 360;
  const pts = buildPoints(small ? 900 : 1500, small ? 160 : 240);
  const geometry = new Geometry(gl, {
    position: { size: 3, data: pts.position },
    aSeed: { size: 1, data: pts.seed },
    aKind: { size: 1, data: pts.kind },
  });
  const program = new Program(gl, {
    vertex,
    fragment,
    transparent: true,
    depthTest: false,
    uniforms: {
      uTime: { value: 0 },
      uDpr: { value: dpr },
      uFg: { value: [0.925, 0.906, 0.875] }, // --fg #ece7df
      uAccent: { value: [0.784, 0.941, 0.192] }, // --accent #c8f031
    },
  });
  const globe = new Mesh(gl, { mode: gl.POINTS, geometry, program });
  globe.setParent(scene);

  let px = 0, py = 0, tx = 0, ty = 0, lastT = 0;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  addEventListener('pointermove', (e: PointerEvent) => {
    if (!fine.matches || opts.reduceMotion.matches) return;
    tx = e.clientX / innerWidth - 0.5;
    ty = e.clientY / innerHeight - 0.5;
  }, { passive: true });

  function render(t: number) {
    lastT = t;
    const s = t * 0.001;
    program.uniforms.uTime.value = s;
    px += (tx - px) * 0.05;
    py += (ty - py) * 0.05;
    globe.rotation.y = s * 0.12 + px * 0.5;
    globe.rotation.x = 0.28 + py * 0.3;
    globe.rotation.z = -0.12;
    renderer.render({ scene, camera });
  }

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height);
    camera.perspective({ aspect: width / height });
    render(lastT || 3000);
  };

  let raf = 0, visible = true;
  const loop = (t: number) => { render(t); raf = requestAnimationFrame(loop); };
  const update = () => {
    const run = visible && !document.hidden && !opts.reduceMotion.matches;
    if (run && !raf) raf = requestAnimationFrame(loop);
    if (!run && raf) { cancelAnimationFrame(raf); raf = 0; render(lastT || 3000); }
  };
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; update(); }, { rootMargin: '80px' }).observe(host);
  document.addEventListener('visibilitychange', update);
  opts.reduceMotion.addEventListener('change', update);
  resize();
  update();
}
