// Lazy-loaded WebGL hero: a slowly rotating cube whose faces are small live graphs
// (2D canvas atlas → OGL texture). Hover (or tap on touch) turns on an electrostatic pull:
// graph elements drift toward the charge (cursor hit point on the face), cling together and spark.
// Decorative only (host is aria-hidden). Pauses offscreen / hidden tab; static frame under reduced motion.
import { Renderer, Camera, Transform, Program, Mesh, Geometry, Texture, Mat4, Vec3 } from 'ogl';
import { CUBE_CONFIG as CFG } from './cube-config';
import { createGraphAtlas } from './graph-faces';

const vertex = /* glsl */ `
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 aLocal;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
varying vec2 vUv;
varying vec2 vLocal;
varying vec3 vNormal;
void main() {
  vUv = uv; vLocal = aLocal;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragment = /* glsl */ `
precision highp float;
uniform sampler2D tMap;
uniform vec3 uAccent;
varying vec2 vUv;
varying vec2 vLocal;
varying vec3 vNormal;
void main() {
  vec3 tex = texture2D(tMap, vUv).rgb;
  vec3 n = normalize(vNormal);
  float key = max(dot(n, normalize(vec3(-0.35, 0.6, 0.75))), 0.0);
  vec3 col = tex * (0.62 + 0.45 * key);
  vec2 e = min(vLocal, 1.0 - vLocal);
  float edge = 1.0 - smoothstep(0.0, 0.008, min(e.x, e.y));
  col = mix(col, uAccent, edge * 0.55);
  gl_FragColor = vec4(col, 1.0);
}`;

// Face order matches the atlas cells 0..5 (3×2). u = right, v = up when viewed from outside.
const FACES: Array<{ n: number[]; u: number[]; v: number[] }> = [
  { n: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] },
  { n: [1, 0, 0], u: [0, 0, -1], v: [0, 1, 0] },
  { n: [0, 0, -1], u: [-1, 0, 0], v: [0, 1, 0] },
  { n: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0] },
  { n: [0, 1, 0], u: [1, 0, 0], v: [0, 0, -1] },
  { n: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1] },
];

function cubeGeometry(gl: WebGLRenderingContext | WebGL2RenderingContext, size: number) {
  const h = size / 2;
  const position: number[] = [], normal: number[] = [], uv: number[] = [], local: number[] = [], index: number[] = [];
  FACES.forEach((f, fi) => {
    const cx = fi % 3, cy = (fi / 3) | 0;
    const base = fi * 4;
    for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      for (let k = 0; k < 3; k++) position.push((f.n[k] + f.u[k] * a + f.v[k] * b) * h);
      normal.push(...f.n);
      const s = (a + 1) / 2, t = (1 - b) / 2; // t = 0 at the top of the face image
      uv.push((cx + s) / 3, 1 - (cy + t) / 2);
      local.push(s, t);
    }
    index.push(base, base + 1, base + 2, base + 2, base + 1, base + 3);
  });
  return new Geometry(gl, {
    position: { size: 3, data: new Float32Array(position) },
    normal: { size: 3, data: new Float32Array(normal) },
    uv: { size: 2, data: new Float32Array(uv) },
    aLocal: { size: 2, data: new Float32Array(local) },
    index: { data: new Uint16Array(index) },
  });
}

export function mountHero3D(host: HTMLElement, opts: { reduceMotion: MediaQueryList }) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const renderer = new Renderer({ alpha: true, antialias: true, dpr });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  const canvasEl = gl.canvas as HTMLCanvasElement;
  host.prepend(canvasEl);

  const camera = new Camera(gl, { fov: 30 });
  camera.position.z = 6;
  const scene = new Transform();

  const faceSize = host.getBoundingClientRect().width < 480 ? CFG.faceSizeSmall : CFG.faceSize;
  const atlas = createGraphAtlas(CFG, faceSize);
  const texture = new Texture(gl, {
    image: atlas.canvas,
    generateMipmaps: false,
    minFilter: gl.LINEAR,
    magFilter: gl.LINEAR,
    wrapS: gl.CLAMP_TO_EDGE,
    wrapT: gl.CLAMP_TO_EDGE,
  });
  const SIZE = 1.5;
  const program = new Program(gl, {
    vertex, fragment,
    uniforms: { tMap: { value: texture }, uAccent: { value: [0.784, 0.941, 0.192] } },
  });
  const cube = new Mesh(gl, { geometry: cubeGeometry(gl, SIZE), program });
  cube.setParent(scene);

  // ── pointer → ray → face-local charge ──────────────────────────────
  let pull = false; // hover or tap toggle
  let touchToggled = false;
  let ndc: [number, number] | null = null;
  const inv = new Mat4();
  const o = new Vec3(), d = new Vec3(), tmp = new Vec3();

  function charges(): Array<{ x: number; y: number } | null> {
    const centre = { x: faceSize / 2, y: faceSize / 2 };
    const out: Array<{ x: number; y: number } | null> = FACES.map(() => centre);
    if (!ndc) return out;
    const { width, height } = host.getBoundingClientRect();
    const tanH = Math.tan(((camera.fov as number) * Math.PI) / 360);
    // ray in world space (camera has no rotation)
    o.set(camera.position.x, camera.position.y, camera.position.z);
    d.set(ndc[0] * tanH * (width / height), ndc[1] * tanH, -1).normalize();
    // into cube local space
    inv.inverse(cube.worldMatrix);
    tmp.copy(o).add(d);
    o.applyMatrix4(inv); tmp.applyMatrix4(inv);
    d.copy(tmp).sub(o).normalize();
    const h = SIZE / 2;
    let tmin = -Infinity, tmax = Infinity;
    for (let k = 0; k < 3; k++) {
      const ok = o[k], dk = d[k];
      if (Math.abs(dk) < 1e-6) { if (ok < -h || ok > h) return out; continue; }
      let t1 = (-h - ok) / dk, t2 = (h - ok) / dk;
      if (t1 > t2) [t1, t2] = [t2, t1];
      tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
    }
    if (tmax < Math.max(tmin, 0)) return out; // miss → every face pulls to its centre
    const p = [o[0] + d[0] * tmin, o[1] + d[1] * tmin, o[2] + d[2] * tmin];
    FACES.forEach((f, fi) => {
      const dn = p[0] * f.n[0] + p[1] * f.n[1] + p[2] * f.n[2];
      if (Math.abs(dn - h) < 1e-3) {
        const s = ((p[0] * f.u[0] + p[1] * f.u[1] + p[2] * f.u[2]) / h + 1) / 2;
        const t = (1 - (p[0] * f.v[0] + p[1] * f.v[1] + p[2] * f.v[2]) / h) / 2;
        out[fi] = { x: s * faceSize, y: t * faceSize };
      }
    });
    return out;
  }

  const toNdc = (e: PointerEvent): [number, number] => {
    const r = host.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1)];
  };
  host.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { pull = true; ndc = toNdc(e); kick(); } });
  host.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') { ndc = toNdc(e); } });
  host.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { pull = false; ndc = null; kick(); } });
  host.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    touchToggled = !touchToggled;
    pull = touchToggled;
    ndc = pull ? toNdc(e) : null;
    kick();
  });

  // ── loop ───────────────────────────────────────────────────────────
  let raf = 0, visible = true, lastTex = 0, angle = 0.6, lastT = 0;
  const texStep = 1000 / CFG.textureFps;

  function frame(t: number, animate: boolean) {
    const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0;
    lastT = t;
    if (animate) angle += dt * CFG.rotationSpeed;
    cube.rotation.y = angle;
    cube.rotation.x = -0.42 + Math.sin(angle * 0.5) * 0.18;
    cube.updateMatrixWorld();
    if (!animate || t - lastTex >= texStep) {
      lastTex = t;
      atlas.setCharges(pull ? charges() : FACES.map(() => null));
      atlas.update(t, pull, animate);
      texture.needsUpdate = true;
    }
    renderer.render({ scene, camera });
  }

  const loop = (t: number) => { frame(t, true); raf = requestAnimationFrame(loop); };
  const running = () => visible && !document.hidden && !opts.reduceMotion.matches;
  function update() {
    if (running() && !raf) { lastT = 0; raf = requestAnimationFrame(loop); }
    if (!running() && raf) { cancelAnimationFrame(raf); raf = 0; }
    if (!running()) staticFrame();
  }
  function staticFrame() {
    // reduced motion / paused: one still frame; under reduced motion graphs stay static and the pull is ignored
    if (opts.reduceMotion.matches) pull = false;
    frame(performance.now(), false);
  }
  // under reduced motion a hover/tap shouldn't animate; elsewhere the running loop picks changes up
  function kick() { if (!raf && !opts.reduceMotion.matches && visible && !document.hidden) update(); }

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height);
    camera.perspective({ aspect: width / height });
    if (!raf) staticFrame();
  };
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; update(); }, { rootMargin: '80px' }).observe(host);
  document.addEventListener('visibilitychange', update);
  opts.reduceMotion.addEventListener('change', update);
  resize();
  update();

  // review/screenshot hook: window.__cvCube.pull(true)
  (window as unknown as { __cvCube: { pull: (on: boolean) => void } }).__cvCube = {
    pull(on) { pull = on; touchToggled = on; ndc = null; kick(); },
  };
}
