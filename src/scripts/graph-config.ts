// Tuning for the hero network graph. Distances are in world units (the graph spans ≈ 2 × layoutRadius).
export const GRAPH_CONFIG = {
  /** Node count: desktop / mobile (viewport < 768px or stage < 320px). */
  nodeCount: 120,
  nodeCountSmall: 64,
  /** Edges per node (≈ average degree / 2). Built by preferential attachment, so a few hubs emerge. */
  edgeDensity: 1.5,
  /** Share of highest-degree nodes drawn as lime hubs. */
  hubShare: 0.06,

  /** Force-directed layout (always running gently, so topology changes morph the shape). */
  layoutRadius: 1.25,
  repulsion: 0.0016,
  linkLength: 0.32,
  linkStrength: 0.018,
  centering: 0.0025,
  layoutDamping: 0.86,

  /** Living data: every changeInterval ms a few edges fade out/in; every few ticks a leaf node is replaced. */
  changeInterval: 1600,
  edgesPerChange: 3,
  nodeSwapEvery: 3, // ticks
  fadeRate: 0.025, // per frame, 0..1
  sizeMorphRate: 0.03,

  /** Electrostatic pull (hover, or tap-toggle on touch). The charge sits where the pointer ray meets the graph's mid-plane. */
  chargeStrength: 0.0045,
  falloff: 2, // 2 = inverse-square
  minDistance: 0.12,
  maxForce: 0.018, // per frame clamp
  maxDisplacement: 0.55,
  /** Nodes closer than snapDistance cling together and draw lime spark lines. */
  snapDistance: 0.2,
  snapStrength: 0.08,
  maxSparks: 90,

  /** Spring back to the layout position. */
  springStiffness: 0.05,
  springDamping: 0.84,

  /** Rotation (rad/s around Y; X wobbles gently). */
  rotationSpeed: 0.12,
} as const;

export type GraphConfig = typeof GRAPH_CONFIG;
