// Tuning for the hero "graph cube". All units are face pixels (one face = faceSize px square) unless noted.
export const CUBE_CONFIG = {
  /** Graphs per face: each face gets a random count in [min, max] (mix of line/bar/scatter/area/nodes). */
  graphsPerFace: { min: 2, max: 4 },
  /** Face texture resolution (px). Smaller stages (<480px wide) use faceSizeSmall. */
  faceSize: 512,
  faceSizeSmall: 384,
  /** Cube rotation speed (radians per second, around Y; X wobbles at half amplitude). */
  rotationSpeed: 0.16,
  /** How often each graph picks new target data (ms) and how fast values morph toward it (0..1 per frame). */
  dataChangeInterval: 2800,
  morphRate: 0.035,

  /** Electrostatic pull (active on hover, or toggled by tap on touch). */
  chargeStrength: 5200, // numerator of the force law
  falloff: 2, // exponent: 2 = inverse-square
  minDistance: 18, // distance floor so the force never explodes near the charge
  maxForce: 2.4, // clamp per frame
  maxDisplacement: 0.2, // fraction of faceSize an element may travel from its rest position
  /** Elements closer than snapDistance attract each other and draw a lime spark line. */
  snapDistance: 26,
  snapStrength: 0.06,
  maxSparksPerFace: 48,

  /** Spring back to rest (always on; dominates when the pull is off). */
  springStiffness: 0.06,
  springDamping: 0.84, // velocity multiplier per frame (lower = more damping)

  /** Texture redraw cap (fps); the cube itself renders every animation frame. */
  textureFps: 30,
} as const;

export type CubeConfig = typeof CUBE_CONFIG;
