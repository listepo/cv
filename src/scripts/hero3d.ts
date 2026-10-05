// Lazy-loaded WebGL hero: one big, slowly rotating 3D network graph that keeps changing
// (edges and nodes fade in/out, the force layout morphs). Hover (or tap on touch) turns on an
// electrostatic pull: nodes drift toward the charge, cling together with lime sparks, and spring back.
// Decorative only (host is aria-hidden). Pauses offscreen / hidden tab; static graph under reduced motion.
import { Renderer, Camera, Transform, Program, Mesh, Geometry, Mat4, Vec3 } from 'ogl';
import { GRAPH_CONFIG as CFG } from './graph-config';
import { createNetwork } from './network-sim';
import { readRgb } from './theme';

const pointVertex = /* glsl */ `
attribute vec3 position;
attribute float aSize;
attribute float aAlpha;
attribute float aLit;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uScale;
varying float vAlpha;
varying float vLit;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = clamp((-mv.z - 4.6) / 2.8, 0.0, 1.0);
  vAlpha = aAlpha * mix(1.0, 0.35, depth);
  vLit = aLit;
  gl_PointSize = aSize * uScale / -mv.z;
}`;
const pointFragment = /* glsl */ `
precision highp float;
uniform vec3 uFg;
uniform vec3 uAccent;
varying float vAlpha;
varying float vLit;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float disc = smoothstep(0.5, 0.36, r);
  float glow = vLit > 1.5 ? smoothstep(0.5, 0.0, r) * 0.5 : 0.0; // the charge marker
  vec3 col = mix(uFg, uAccent, clamp(vLit, 0.0, 1.0));
  gl_FragColor = vec4(col, (vLit > 1.5 ? glow : disc) * vAlpha);
}`;
const lineVertex = /* glsl */ `
attribute vec3 position;
attribute float aAlpha;
attribute float aLit;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying float vAlpha;
varying float vLit;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = clamp((-mv.z - 4.6) / 2.8, 0.0, 1.0);
  vAlpha = aAlpha * mix(1.0, 0.45, depth);
  vLit = aLit;
}`;
const lineFragment = /* glsl */ `
precision highp float;
uniform vec3 uFg;
uniform vec3 uAccent;
varying float vAlpha;
varying float vLit;
void main() { gl_FragColor = vec4(mix(uFg, uAccent, vLit), vAlpha); }`;

export function mountHero3D(host: HTMLElement, opts: { reduceMotion: MediaQueryList }) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const renderer = new Renderer({ alpha: true, antialias: true, dpr });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  host.prepend(gl.canvas as HTMLCanvasElement);

  const camera = new Camera(gl, { fov: 30 });
  camera.position.z = 6;
  const scene = new Transform();
  const graph = new Transform();
  graph.setParent(scene);

  const small = matchMedia('(max-width: 767px)').matches || host.getBoundingClientRect().width < 320;
  const count = small ? CFG.nodeCountSmall : CFG.nodeCount;
  const net = createNetwork(CFG, count);

  // fixed-capacity dynamic buffers
  const MAXN = count * 2 + 8;
  const MAXL = (MAXN * 3 + CFG.maxSparks) * 2;
  const pPos = new Float32Array(MAXN * 3), pSize = new Float32Array(MAXN), pAlpha = new Float32Array(MAXN), pLit = new Float32Array(MAXN);
  const lPos = new Float32Array(MAXL * 3), lAlpha = new Float32Array(MAXL), lLit = new Float32Array(MAXL);
  const pointGeo = new Geometry(gl, {
    position: { size: 3, data: pPos }, aSize: { size: 1, data: pSize }, aAlpha: { size: 1, data: pAlpha }, aLit: { size: 1, data: pLit },
  });
  const lineGeo = new Geometry(gl, { position: { size: 3, data: lPos }, aAlpha: { size: 1, data: lAlpha }, aLit: { size: 1, data: lLit } });
  // colours come from the active theme's tokens; swapped as uniforms on 'cv:theme' (no WebGL re-init)
  const colors = {
    uFg: { value: readRgb('--fg-rgb', [0.925, 0.906, 0.875]) },
    uAccent: { value: readRgb('--graph-accent-rgb', [0.784, 0.941, 0.192]) },
  };
  const uScale = { value: 0 };
  const pointProg = new Program(gl, { vertex: pointVertex, fragment: pointFragment, transparent: true, depthTest: false, uniforms: { ...colors, uScale } });
  const lineProg = new Program(gl, { vertex: lineVertex, fragment: lineFragment, transparent: true, depthTest: false, uniforms: colors });
  const lines = new Mesh(gl, { mode: gl.LINES, geometry: lineGeo, program: lineProg, renderOrder: 0, frustumCulled: false });
  const points = new Mesh(gl, { mode: gl.POINTS, geometry: pointGeo, program: pointProg, renderOrder: 1, frustumCulled: false });
  lines.setParent(graph);
  points.setParent(graph);

  let charge: { x: number; y: number; z: number } | null = null;

  function upload() {
    let i = 0;
    for (const n of net.nodes) {
      if (i >= MAXN - 1) break;
      pPos.set([n.x + n.dx, n.y + n.dy, n.z + n.dz], i * 3);
      pSize[i] = (n.hub ? 10 : 6.5) * n.size;
      pAlpha[i] = n.fade * (n.hub ? 1 : 0.85);
      pLit[i] = n.hub ? 1 : 0;
      i++;
    }
    if (charge) { // soft lime marker where the charge sits
      pPos.set([charge.x, charge.y, charge.z], i * 3); pSize[i] = 70; pAlpha[i] = 0.35; pLit[i] = 2; i++;
    }
    pointGeo.setDrawRange(0, i);
    let v = 0;
    const put = (x: number, y: number, z: number, a: number, lit: number) => {
      if (v >= MAXL) return;
      lPos.set([x, y, z], v * 3); lAlpha[v] = a; lLit[v] = lit; v++;
    };
    for (const e of net.edges) {
      const { a, b } = e;
      const lit = a.hub || b.hub ? 0.35 : 0;
      const alpha = 0.4 * e.fade;
      put(a.x + a.dx, a.y + a.dy, a.z + a.dz, alpha, lit);
      put(b.x + b.dx, b.y + b.dy, b.z + b.dz, alpha, lit);
    }
    for (const [a, b, s] of net.sparks) {
      const alpha = 0.55 + 0.45 * s;
      put(a.x + a.dx, a.y + a.dy, a.z + a.dz, alpha, 1);
      put(b.x + b.dx, b.y + b.dy, b.z + b.dz, alpha, 1);
    }
    lineGeo.setDrawRange(0, v);
    for (const g of [pointGeo, lineGeo]) for (const k in g.attributes) if (k !== 'index') g.attributes[k].needsUpdate = true;
  }

  // ── pointer → charge on the graph's mid-plane (world z = 0), in graph-local space ──
  let pull = false, touchToggled = false;
  let ndc: [number, number] | null = null;
  const inv = new Mat4(), hit = new Vec3();
  function computeCharge() {
    if (!pull) return null;
    if (!ndc) return { x: 0, y: 0, z: 0 }; // tap without position / review hook: charge at the centre
    const { width, height } = host.getBoundingClientRect();
    const tanH = Math.tan(((camera.fov as number) * Math.PI) / 360);
    const dx = ndc[0] * tanH * (width / height), dy = ndc[1] * tanH; // ray dir (dx, dy, -1)
    const t = camera.position.z; // reaches z = 0
    hit.set(camera.position.x + dx * t, camera.position.y + dy * t, 0);
    inv.inverse(graph.worldMatrix);
    hit.applyMatrix4(inv);
    return { x: hit[0], y: hit[1], z: hit[2] };
  }
  const toNdc = (e: PointerEvent): [number, number] => {
    const r = host.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1)];
  };
  host.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { pull = true; ndc = toNdc(e); kick(); } });
  host.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') ndc = toNdc(e); });
  host.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { pull = false; ndc = null; kick(); } });
  host.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    touchToggled = !touchToggled; pull = touchToggled; ndc = pull ? toNdc(e) : null; kick();
  });

  // ── loop ──
  let raf = 0, visible = true, angle = 0.5, lastT = 0, lastChange = 0;
  function frame(t: number, animate: boolean) {
    const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0;
    lastT = t;
    if (animate) {
      angle += dt * CFG.rotationSpeed;
      if (t - lastChange > CFG.changeInterval) { lastChange = t; net.mutate(); }
      net.stepLayout();
      net.stepFades();
    }
    graph.rotation.y = angle;
    graph.rotation.x = 0.22 + Math.sin(angle * 0.6) * 0.12;
    graph.updateMatrixWorld();
    charge = animate ? computeCharge() : null;
    if (animate) net.stepPull(charge);
    upload();
    renderer.render({ scene, camera });
  }
  const loop = (t: number) => { frame(t, true); raf = requestAnimationFrame(loop); };
  const running = () => visible && !document.hidden && !opts.reduceMotion.matches;
  function update() {
    if (running() && !raf) { lastT = 0; raf = requestAnimationFrame(loop); }
    if (!running() && raf) { cancelAnimationFrame(raf); raf = 0; }
    if (!running()) frame(performance.now(), false); // static graph; no pull under reduced motion
  }
  function kick() { if (!raf && running()) update(); }

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height);
    camera.perspective({ aspect: width / height });
    uScale.value = height * dpr * 0.0105; // node px size scales with the stage
    if (!raf) frame(performance.now(), false);
  };
  addEventListener('cv:theme', () => {
    colors.uFg.value = readRgb('--fg-rgb', colors.uFg.value);
    colors.uAccent.value = readRgb('--graph-accent-rgb', colors.uAccent.value);
    if (!raf) frame(performance.now(), false);
  });
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; update(); }, { rootMargin: '80px' }).observe(host);
  document.addEventListener('visibilitychange', update);
  opts.reduceMotion.addEventListener('change', update);
  resize();
  update();

  // review/screenshot hook: window.__cvGraph.pull(true)
  (window as unknown as { __cvGraph: { pull: (on: boolean) => void; count: () => number; sparks: () => number; displaced: () => number } }).__cvGraph = {
    pull(on) { pull = on; touchToggled = on; ndc = null; kick(); },
    count: () => net.nodes.length,
    sparks: () => net.sparks.length,
    displaced: () => net.nodes.filter((n) => Math.hypot(n.dx, n.dy, n.dz) > 0.05).length,
  };
}
