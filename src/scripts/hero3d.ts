// Lazy-loaded WebGL hero ornament: a glass "code block" cube with glowing edges.
// Decorative only (host is aria-hidden). Pauses offscreen / hidden tab; one static frame under reduced motion.
import { Renderer, Camera, Transform, Program, Mesh, Box } from 'ogl';

const vertex = /* glsl */ `
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vViewPos;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec3 uAccent;
uniform vec3 uWarm;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vViewPos;
void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(-vViewPos);
  float fres = pow(1.0 - abs(dot(n, v)), 2.0);

  // glowing edges
  vec2 e = min(vUv, 1.0 - vUv);
  float edge = 1.0 - smoothstep(0.0, 0.035, min(e.x, e.y));
  // faint inner code grid
  vec2 g = abs(fract(vUv * 8.0) - 0.5);
  float grid = smoothstep(0.46, 0.5, max(g.x, g.y));
  // slow scan sweep
  float sweep = exp(-pow((fract(uTime * 0.07) - vUv.y) * 18.0, 2.0));

  vec3 base = vec3(0.06, 0.075, 0.09);
  vec3 col = base + uAccent * (grid * 0.10 + fres * 0.22 + sweep * 0.12) + uWarm * fres * 0.05;
  col += uAccent * edge * 0.95;
  float a = 0.38 + fres * 0.35 + edge * 0.6 + grid * 0.06;
  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
}`;

export function mountHero3D(host: HTMLElement, opts: { reduceMotion: MediaQueryList }) {
  const renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  host.prepend(gl.canvas as HTMLCanvasElement);

  const camera = new Camera(gl, { fov: 32 });
  camera.position.z = 6.2;
  const scene = new Transform();

  const program = new Program(gl, {
    vertex,
    fragment,
    transparent: true,
    cullFace: false,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uAccent: { value: [0.431, 0.906, 0.659] }, // --accent #6ee7a8
      uWarm: { value: [0.949, 0.769, 0.427] }, // --accent-2 #f2c46d
    },
  });
  const outer = new Mesh(gl, { geometry: new Box(gl, { width: 1.5, height: 1.5, depth: 1.5 }), program });
  outer.setParent(scene);
  const inner = new Mesh(gl, { geometry: new Box(gl, { width: 0.62, height: 0.62, depth: 0.62 }), program });
  inner.setParent(scene);

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height);
    camera.perspective({ aspect: width / height });
    render(lastT);
  };

  let px = 0, py = 0, tx = 0, ty = 0, lastT = 0;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const onPointer = (e: PointerEvent) => {
    if (!fine.matches || opts.reduceMotion.matches) return;
    tx = e.clientX / innerWidth - 0.5;
    ty = e.clientY / innerHeight - 0.5;
  };
  addEventListener('pointermove', onPointer, { passive: true });

  function render(t: number) {
    lastT = t;
    const s = t * 0.001;
    program.uniforms.uTime.value = s;
    px += (tx - px) * 0.05;
    py += (ty - py) * 0.05;
    outer.rotation.y = s * 0.22 + px * 0.6 + 0.6;
    outer.rotation.x = -0.42 + py * 0.4;
    inner.rotation.y = -s * 0.5 + 0.3;
    inner.rotation.x = s * 0.35 + 0.4;
    renderer.render({ scene, camera });
  }

  let raf = 0, visible = true;
  const loop = (t: number) => { render(t); raf = requestAnimationFrame(loop); };
  const update = () => {
    const run = visible && !document.hidden && !opts.reduceMotion.matches;
    if (run && !raf) raf = requestAnimationFrame(loop);
    if (!run && raf) { cancelAnimationFrame(raf); raf = 0; render(lastT || 2400); }
  };

  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; update(); }, { rootMargin: '80px' }).observe(host);
  document.addEventListener('visibilitychange', update);
  opts.reduceMotion.addEventListener('change', update);
  resize();
  render(2400);
  update();
}
