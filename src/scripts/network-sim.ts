// Living 3D network: force-directed layout + topology changes that fade in/out,
// plus a separate displacement layer for the electrostatic pull (cling + sparks, spring back).
import type { GraphConfig } from './graph-config';

export type Node = {
  // layout position / velocity
  x: number; y: number; z: number; vx: number; vy: number; vz: number;
  // pull displacement / velocity
  dx: number; dy: number; dz: number; ux: number; uy: number; uz: number;
  fade: number; target: 0 | 1;
  size: number; sizeT: number;
  hub: boolean;
};
export type Edge = { a: Node; b: Node; fade: number; target: 0 | 1 };

const rnd = (a = 0, b = 1) => a + Math.random() * (b - a);

export function createNetwork(cfg: GraphConfig, count: number) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const sparks: Array<[Node, Node, number]> = [];

  const spawn = (near?: Node): Node => {
    const r = cfg.layoutRadius;
    const n: Node = {
      x: near ? near.x + rnd(-0.1, 0.1) : rnd(-r, r) * 0.7,
      y: near ? near.y + rnd(-0.1, 0.1) : rnd(-r, r) * 0.7,
      z: near ? near.z + rnd(-0.1, 0.1) : rnd(-r, r) * 0.7,
      vx: 0, vy: 0, vz: 0, dx: 0, dy: 0, dz: 0, ux: 0, uy: 0, uz: 0,
      fade: near ? 0 : 1, target: 1, size: 1, sizeT: 1, hub: false,
    };
    nodes.push(n);
    return n;
  };
  const degree = (n: Node) => edges.reduce((k, e) => k + (e.target && (e.a === n || e.b === n) ? 1 : 0), 0);
  const connected = (a: Node, b: Node) => edges.some((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a));
  const link = (a: Node, b: Node, fade = 0) => { if (a !== b && !connected(a, b)) edges.push({ a, b, fade, target: 1 }); };

  // preferential attachment → a few natural hubs
  const m = Math.max(1, Math.round(cfg.edgeDensity));
  for (let i = 0; i < count; i++) {
    const n = spawn();
    if (i === 0) continue;
    const links = i < 3 ? 1 : Math.random() < cfg.edgeDensity - Math.floor(cfg.edgeDensity) ? m + 1 : m;
    for (let k = 0; k < links; k++) {
      // pick a target proportional to degree + 1
      const pool = nodes.slice(0, i);
      const w = pool.map((p) => degree(p) + 1);
      let t = Math.random() * w.reduce((s, v) => s + v, 0);
      let j = 0;
      while ((t -= w[j]) > 0 && j < pool.length - 1) j++;
      link(n, pool[j], 1);
    }
  }

  function refreshWeights() {
    const live = nodes.filter((n) => n.target === 1);
    const deg = new Map<Node, number>();
    for (const e of edges) if (e.target) { deg.set(e.a, (deg.get(e.a) ?? 0) + 1); deg.set(e.b, (deg.get(e.b) ?? 0) + 1); }
    const sorted = [...live].sort((p, q) => (deg.get(q) ?? 0) - (deg.get(p) ?? 0));
    const hubs = new Set(sorted.slice(0, Math.max(3, Math.round(live.length * cfg.hubShare))));
    for (const n of live) {
      const d = deg.get(n) ?? 0;
      n.hub = hubs.has(n);
      n.sizeT = 0.7 + Math.min(1.8, Math.sqrt(d) * 0.45) + rnd(-0.08, 0.08);
    }
  }
  refreshWeights();

  // settle the initial layout so the first frame is already a graph, not a cloud
  for (let i = 0; i < 260; i++) stepLayout();
  for (const n of nodes) n.size = n.sizeT;

  function stepLayout() {
    const live = nodes;
    for (let i = 0; i < live.length; i++) {
      const a = live[i];
      for (let j = i + 1; j < live.length; j++) {
        const b = live[j];
        let dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
        const d2 = dx * dx + dy * dy + dz * dz + 0.01;
        const f = (cfg.repulsion * a.fade * b.fade) / d2;
        const inv = 1 / Math.sqrt(d2);
        dx *= inv * f; dy *= inv * f; dz *= inv * f;
        a.vx += dx; a.vy += dy; a.vz += dz; b.vx -= dx; b.vy -= dy; b.vz -= dz;
      }
    }
    for (const e of edges) {
      const { a, b } = e;
      const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + 1e-4;
      const f = ((d - cfg.linkLength) / d) * cfg.linkStrength * e.fade;
      a.vx += dx * f; a.vy += dy * f; a.vz += dz * f; b.vx -= dx * f; b.vy -= dy * f; b.vz -= dz * f;
    }
    const R = cfg.layoutRadius;
    for (const n of live) {
      n.vx -= n.x * cfg.centering; n.vy -= n.y * cfg.centering; n.vz -= n.z * cfg.centering;
      const r = Math.hypot(n.x, n.y, n.z);
      if (r > R) { const k = ((r - R) / r) * 0.05; n.vx -= n.x * k; n.vy -= n.y * k; n.vz -= n.z * k; }
      n.vx *= cfg.layoutDamping; n.vy *= cfg.layoutDamping; n.vz *= cfg.layoutDamping;
      n.x += n.vx; n.y += n.vy; n.z += n.vz;
    }
  }

  let tick = 0;
  function mutate() {
    tick++;
    const live = nodes.filter((n) => n.target === 1);
    const active = edges.filter((e) => e.target === 1);
    // fade out a few edges that won't orphan a node
    for (let k = 0; k < cfg.edgesPerChange && active.length; k++) {
      const e = active[(Math.random() * active.length) | 0];
      if (degree(e.a) > 1 && degree(e.b) > 1) e.target = 0;
    }
    // fade in a few new edges between nearby nodes
    for (let k = 0; k < cfg.edgesPerChange; k++) {
      const a = live[(Math.random() * live.length) | 0];
      let best: Node | null = null, bestD = Infinity;
      for (let s = 0; s < 12; s++) {
        const b = live[(Math.random() * live.length) | 0];
        if (b === a || connected(a, b)) continue;
        const d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
        if (d < bestD) { bestD = d; best = b; }
      }
      if (best) link(a, best, 0);
    }
    // replace a leaf node now and then: old one fades out, a new one buds off a random node
    if (tick % cfg.nodeSwapEvery === 0) {
      const leaves = live.filter((n) => degree(n) === 1 && !n.hub);
      if (leaves.length) {
        const leaf = leaves[(Math.random() * leaves.length) | 0];
        leaf.target = 0;
        for (const e of edges) if (e.a === leaf || e.b === leaf) e.target = 0;
      }
      const parent = live[(Math.random() * live.length) | 0];
      const child = spawn(parent);
      link(child, parent, 0);
    }
    refreshWeights();
  }

  function stepFades() {
    for (const n of nodes) {
      n.fade += (n.target - n.fade) * cfg.fadeRate * 2;
      n.size += (n.sizeT - n.size) * cfg.sizeMorphRate;
    }
    for (const e of edges) {
      const lim = Math.min(e.a.fade, e.b.fade);
      e.fade += ((e.target ? lim : 0) - e.fade) * cfg.fadeRate * 2;
    }
    // drop fully faded items
    for (let i = edges.length - 1; i >= 0; i--) if (edges[i].target === 0 && edges[i].fade < 0.01) edges.splice(i, 1);
    for (let i = nodes.length - 1; i >= 0; i--) if (nodes[i].target === 0 && nodes[i].fade < 0.01) nodes.splice(i, 1);
  }

  /** charge in graph-local space, or null when the pull is off */
  function stepPull(charge: { x: number; y: number; z: number } | null) {
    sparks.length = 0;
    for (const n of nodes) {
      if (charge) {
        const px = n.x + n.dx, py = n.y + n.dy, pz = n.z + n.dz;
        let gx = charge.x - px, gy = charge.y - py, gz = charge.z - pz;
        const d = Math.max(Math.hypot(gx, gy, gz), 1e-5);
        gx /= d; gy /= d; gz /= d;
        const f = Math.min(cfg.maxForce, cfg.chargeStrength / Math.pow(Math.max(d, cfg.minDistance), cfg.falloff));
        n.ux += gx * f; n.uy += gy * f; n.uz += gz * f;
      }
      n.ux -= n.dx * cfg.springStiffness; n.uy -= n.dy * cfg.springStiffness; n.uz -= n.dz * cfg.springStiffness;
    }
    if (charge) {
      const s2 = cfg.snapDistance * cfg.snapDistance;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const ax = a.x + a.dx, ay = a.y + a.dy, az = a.z + a.dz;
        const aPulled = a.dx * a.dx + a.dy * a.dy + a.dz * a.dz > 0.0025;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x + b.dx - ax, dy = b.y + b.dy - ay, dz = b.z + b.dz - az;
          const d2 = dx * dx + dy * dy + dz * dz;
          // only nodes the charge has actually moved cling/spark (not every naturally close pair)
          if (d2 < s2 && d2 > 1e-6 && (aPulled || b.dx * b.dx + b.dy * b.dy + b.dz * b.dz > 0.0025)) {
            const k = cfg.snapStrength * (1 - d2 / s2);
            a.ux += dx * k; a.uy += dy * k; a.uz += dz * k; b.ux -= dx * k; b.uy -= dy * k; b.uz -= dz * k;
            if (sparks.length < cfg.maxSparks) sparks.push([a, b, 1 - Math.sqrt(d2) / cfg.snapDistance]);
          }
        }
      }
    }
    const maxD = cfg.maxDisplacement;
    for (const n of nodes) {
      n.ux *= cfg.springDamping; n.uy *= cfg.springDamping; n.uz *= cfg.springDamping;
      n.dx += n.ux; n.dy += n.uy; n.dz += n.uz;
      const m2 = Math.hypot(n.dx, n.dy, n.dz);
      if (m2 > maxD) { const s = maxD / m2; n.dx *= s; n.dy *= s; n.dz *= s; n.ux *= 0.5; n.uy *= 0.5; n.uz *= 0.5; }
    }
  }

  return { nodes, edges, sparks, stepLayout, stepFades, stepPull, mutate };
}
