// 2D canvas atlas (3×2 faces) of small animated graphs with an electrostatic "pull" on their elements.
import type { CubeConfig } from './cube-config';

type Kind = 'line' | 'bar' | 'scatter' | 'area' | 'nodes';
type El = { rx: number; ry: number; dx: number; dy: number; vx: number; vy: number };
type Graph = {
  kind: Kind;
  label: string;
  x: number; y: number; w: number; h: number; // plot box in face px
  values: number[]; targets: number[]; // 0..1 (scatter/nodes use pairs: x0,y0,x1,y1…)
  els: El[];
  edges?: Array<[number, number]>;
  accent: number; // index of the highlighted element/series
};
type Face = { graphs: Graph[]; charge: { x: number; y: number } | null; sparks: Array<[El, El, number]> };

const COLORS = {
  bg: '#141311',
  line: 'rgba(236,231,223,0.10)',
  grid: 'rgba(236,231,223,0.06)',
  fg: 'rgba(236,231,223,0.88)',
  fgDim: 'rgba(236,231,223,0.45)',
  label: 'rgba(154,148,139,1)',
  accent: '#c8f031',
  accentSoft: 'rgba(200,240,49,0.16)',
};
const LABELS: Record<Kind, string[]> = {
  line: ['build.ms', 'p95', 'req/s'],
  bar: ['commits', 'deploys', 'queue'],
  scatter: ['tokens', 'latency', 'fit'],
  area: ['cache.hit', 'mem', 'load'],
  nodes: ['graph', 'deps', 'mesh'],
};
const KINDS: Kind[] = ['line', 'bar', 'scatter', 'area', 'nodes'];
const rnd = (a = 0, b = 1) => a + Math.random() * (b - a);
const pick = <T,>(arr: readonly T[]) => arr[(Math.random() * arr.length) | 0];

function seriesCount(kind: Kind) {
  return kind === 'bar' ? 9 : kind === 'scatter' ? 16 : kind === 'nodes' ? 8 : 14;
}
function randomValues(kind: Kind, n: number, prev?: number[]) {
  if (kind === 'scatter' || kind === 'nodes') return Array.from({ length: n * 2 }, () => rnd(0.08, 0.92));
  // smooth-ish random walk so lines look like data, not noise
  let v = prev ? prev[0] : rnd(0.3, 0.7);
  return Array.from({ length: n }, () => (v = Math.min(0.95, Math.max(0.05, v + rnd(-0.22, 0.22)))));
}

function layout(count: number, size: number) {
  const pad = size * 0.07, gap = size * 0.05;
  const inner = size - pad * 2;
  const half = (inner - gap) / 2;
  if (count <= 2) return [ { x: pad, y: pad, w: inner, h: half }, { x: pad, y: pad + half + gap, w: inner, h: half } ];
  if (count === 3) return [
    { x: pad, y: pad, w: inner, h: half },
    { x: pad, y: pad + half + gap, w: half, h: half },
    { x: pad + half + gap, y: pad + half + gap, w: half, h: half },
  ];
  return [0, 1, 2, 3].map((i) => ({ x: pad + (i % 2) * (half + gap), y: pad + ((i / 2) | 0) * (half + gap), w: half, h: half }));
}

export function createGraphAtlas(cfg: CubeConfig, faceSize: number) {
  const canvas = document.createElement('canvas');
  canvas.width = faceSize * 3;
  canvas.height = faceSize * 2;
  const ctx = canvas.getContext('2d')!;
  const S = faceSize;

  const faces: Face[] = Array.from({ length: 6 }, (_, fi) => {
    const count = cfg.graphsPerFace.min + ((Math.random() * (cfg.graphsPerFace.max - cfg.graphsPerFace.min + 1)) | 0);
    const kinds = [...KINDS].sort(() => Math.random() - 0.5);
    const boxes = layout(count, S);
    const graphs = boxes.map((b, gi) => {
      const kind = kinds[(gi + fi) % kinds.length];
      const n = seriesCount(kind);
      const values = randomValues(kind, n);
      const g: Graph = {
        kind, label: pick(LABELS[kind]),
        x: b.x, y: b.y + 18, w: b.w, h: b.h - 18,
        values, targets: [...values],
        els: Array.from({ length: n }, () => ({ rx: 0, ry: 0, dx: 0, dy: 0, vx: 0, vy: 0 })),
        accent: (Math.random() * n) | 0,
      };
      if (kind === 'nodes') {
        g.edges = [];
        for (let i = 1; i < n; i++) g.edges.push([i, (Math.random() * i) | 0]);
        g.edges.push([0, n - 1], [2, 5]);
      }
      return g;
    });
    return { graphs, charge: null, sparks: [] };
  });

  // rest positions from (morphing) data
  function restPositions(g: Graph) {
    const n = g.els.length;
    for (let i = 0; i < n; i++) {
      const e = g.els[i];
      if (g.kind === 'scatter' || g.kind === 'nodes') {
        e.rx = g.x + g.values[i * 2] * g.w;
        e.ry = g.y + g.values[i * 2 + 1] * g.h;
      } else if (g.kind === 'bar') {
        const bw = g.w / n;
        e.rx = g.x + bw * (i + 0.5);
        e.ry = g.y + g.h - g.values[i] * g.h;
      } else {
        e.rx = g.x + (i / (n - 1)) * g.w;
        e.ry = g.y + g.h - g.values[i] * g.h;
      }
    }
  }

  let lastShuffle = 0;
  function stepData(now: number) {
    if (now - lastShuffle > cfg.dataChangeInterval) {
      lastShuffle = now;
      // refresh a third of the graphs each tick so changes are staggered, never all at once
      for (const f of faces) for (const g of f.graphs) if (Math.random() < 0.34) {
        g.targets = randomValues(g.kind, g.els.length, g.values);
        if (Math.random() < 0.3) g.accent = (Math.random() * g.els.length) | 0;
      }
    }
    for (const f of faces) for (const g of f.graphs) {
      for (let i = 0; i < g.values.length; i++) g.values[i] += (g.targets[i] - g.values[i]) * cfg.morphRate;
      restPositions(g);
    }
  }

  function stepPhysics(active: boolean) {
    const maxD = cfg.maxDisplacement * S;
    const snap2 = cfg.snapDistance * cfg.snapDistance;
    for (const f of faces) {
      f.sparks.length = 0;
      const c = active ? f.charge : null;
      const all: El[] = [];
      for (const g of f.graphs) for (const e of g.els) all.push(e);
      for (const e of all) {
        if (c) {
          const px = e.rx + e.dx, py = e.ry + e.dy;
          let ux = c.x - px, uy = c.y - py;
          const d = Math.max(Math.hypot(ux, uy), 0.0001);
          ux /= d; uy /= d;
          const force = Math.min(cfg.maxForce, cfg.chargeStrength / Math.pow(Math.max(d, cfg.minDistance), cfg.falloff));
          e.vx += ux * force; e.vy += uy * force;
        }
        e.vx += -e.dx * cfg.springStiffness;
        e.vy += -e.dy * cfg.springStiffness;
      }
      if (c) {
        // static cling: close neighbours pull together and spark
        for (let i = 0; i < all.length; i++) {
          const a = all[i];
          const ax = a.rx + a.dx, ay = a.ry + a.dy;
          for (let j = i + 1; j < all.length; j++) {
            const b = all[j];
            const bx = b.rx + b.dx, by = b.ry + b.dy;
            const dx = bx - ax, dy = by - ay, d2 = dx * dx + dy * dy;
            if (d2 < snap2 && d2 > 0.01) {
              const k = cfg.snapStrength * (1 - d2 / snap2);
              a.vx += dx * k; a.vy += dy * k; b.vx -= dx * k; b.vy -= dy * k;
              if (f.sparks.length < cfg.maxSparksPerFace) f.sparks.push([a, b, 1 - Math.sqrt(d2) / cfg.snapDistance]);
            }
          }
        }
      }
      for (const e of all) {
        e.vx *= cfg.springDamping; e.vy *= cfg.springDamping;
        e.dx += e.vx; e.dy += e.vy;
        const m = Math.hypot(e.dx, e.dy);
        if (m > maxD) { e.dx *= maxD / m; e.dy *= maxD / m; e.vx *= 0.5; e.vy *= 0.5; }
      }
    }
  }

  const P = (e: El) => [e.rx + e.dx, e.ry + e.dy] as const;

  function drawGraph(g: Graph) {
    ctx.save();
    ctx.font = `500 ${Math.round(S * 0.026)}px "Geist Mono Variable", ui-monospace, monospace`;
    ctx.fillStyle = COLORS.label;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(g.label, g.x, g.y - 8);
    // frame + grid
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) { const y = g.y + (g.h * i) / 4; ctx.beginPath(); ctx.moveTo(g.x, y); ctx.lineTo(g.x + g.w, y); ctx.stroke(); }
    ctx.strokeStyle = COLORS.line;
    ctx.beginPath(); ctx.moveTo(g.x, g.y + g.h); ctx.lineTo(g.x + g.w, g.y + g.h); ctx.stroke();

    const els = g.els;
    if (g.kind === 'line' || g.kind === 'area') {
      ctx.beginPath();
      els.forEach((e, i) => { const [x, y] = P(e); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      if (g.kind === 'area') {
        const [lx] = P(els[els.length - 1]); const [fx] = P(els[0]);
        ctx.lineTo(lx, g.y + g.h); ctx.lineTo(fx, g.y + g.h); ctx.closePath();
        const grad = ctx.createLinearGradient(0, g.y, 0, g.y + g.h);
        grad.addColorStop(0, 'rgba(200,240,49,0.28)'); grad.addColorStop(1, 'rgba(200,240,49,0)');
        ctx.fillStyle = grad; ctx.fill();
        ctx.beginPath();
        els.forEach((e, i) => { const [x, y] = P(e); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
        ctx.strokeStyle = COLORS.accent;
      } else ctx.strokeStyle = COLORS.fg;
      ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();
      els.forEach((e, i) => {
        const [x, y] = P(e);
        ctx.fillStyle = i === g.accent ? COLORS.accent : COLORS.fg;
        ctx.fillRect(x - 2, y - 2, 4, 4);
      });
    } else if (g.kind === 'bar') {
      const bw = (g.w / els.length) * 0.56;
      els.forEach((e, i) => {
        const [x, y] = P(e);
        ctx.fillStyle = i === g.accent ? COLORS.accent : COLORS.fgDim;
        ctx.fillRect(x - bw / 2, y, bw, g.y + g.h - y);
        ctx.fillStyle = i === g.accent ? COLORS.accent : COLORS.fg;
        ctx.fillRect(x - bw / 2, y - 1, bw, 3); // bar top (the "element")
      });
    } else if (g.kind === 'scatter') {
      els.forEach((e, i) => {
        const [x, y] = P(e);
        ctx.fillStyle = i % 5 === g.accent % 5 ? COLORS.accent : COLORS.fg;
        ctx.beginPath(); ctx.arc(x, y, i === g.accent ? 4.5 : 3, 0, Math.PI * 2); ctx.fill();
      });
    } else if (g.kind === 'nodes') {
      ctx.strokeStyle = 'rgba(236,231,223,0.28)'; ctx.lineWidth = 1.2;
      for (const [a, b] of g.edges!) { const [x1, y1] = P(els[a]); const [x2, y2] = P(els[b]); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
      els.forEach((e, i) => {
        const [x, y] = P(e);
        ctx.fillStyle = COLORS.bg; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = i === g.accent ? COLORS.accent : COLORS.fg; ctx.lineWidth = 1.6; ctx.stroke();
      });
    }
    ctx.restore();
  }

  function draw() {
    for (let fi = 0; fi < 6; fi++) {
      const ox = (fi % 3) * S, oy = ((fi / 3) | 0) * S;
      ctx.save();
      ctx.translate(ox, oy);
      ctx.beginPath(); ctx.rect(0, 0, S, S); ctx.clip();
      ctx.fillStyle = COLORS.bg; ctx.fillRect(0, 0, S, S);
      const f = faces[fi];
      for (const g of f.graphs) drawGraph(g);
      // sparks
      if (f.sparks.length) {
        ctx.lineWidth = 1;
        for (const [a, b, s] of f.sparks) {
          ctx.strokeStyle = `rgba(200,240,49,${(0.25 + 0.6 * s).toFixed(3)})`;
          const [x1, y1] = P(a), [x2, y2] = P(b);
          const mx = (x1 + x2) / 2 + rnd(-3, 3), my = (y1 + y2) / 2 + rnd(-3, 3); // slight crackle
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(mx, my); ctx.lineTo(x2, y2); ctx.stroke();
        }
      }
      if (f.charge) {
        const gr = ctx.createRadialGradient(f.charge.x, f.charge.y, 0, f.charge.x, f.charge.y, S * 0.12);
        gr.addColorStop(0, 'rgba(200,240,49,0.18)'); gr.addColorStop(1, 'rgba(200,240,49,0)');
        ctx.fillStyle = gr; ctx.fillRect(0, 0, S, S);
      }
      ctx.restore();
    }
  }

  // initialise
  for (const f of faces) for (const g of f.graphs) restPositions(g);

  return {
    canvas,
    faces,
    /** face-local charge positions in px; null = no charge on that face */
    setCharges(ch: Array<{ x: number; y: number } | null>) { faces.forEach((f, i) => (f.charge = ch[i] ?? null)); },
    update(now: number, active: boolean, animateData: boolean) {
      if (animateData) stepData(now);
      stepPhysics(active);
      draw();
    },
  };
}
