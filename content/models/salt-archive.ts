/**
 * The Salt Archive as massing data, in metres.
 * x runs along the long wall (72.40 m), y is height above the ground line
 * (±0.00), z runs across the building (the fjord lies toward −z).
 *
 * The same solids drive the three.js section study, the long-section SVG
 * and the ground-floor plan, so every drawing of the building agrees.
 */

export type SolidGroup = "building" | "earth" | "water";

export type Solid = {
  group: SolidGroup;
  size: readonly [number, number, number];
  position: readonly [number, number, number];
  /** Rotation about z, in radians (used for the ramps). */
  tilt?: number;
};

export type Level = { y: number; name: string };

export type Room = {
  id: string;
  name: string;
  /** Plan rectangle: [x0, z0, x1, z1]. */
  rect: readonly [number, number, number, number];
};

const box = (
  group: SolidGroup,
  size: readonly [number, number, number],
  position: readonly [number, number, number],
  tilt?: number,
): Solid => ({ group, size, position, tilt });

const LENGTH = 72.4;
const WIDTH = 18;
const HALF_L = LENGTH / 2;
const WALL = 0.9;
const INNER_W = WIDTH - 2 * WALL;

/** Roof beams: 0.4 m deep fins at 1.8 m centres, the rooflights between them. */
const beams: Solid[] = Array.from({ length: 39 }, (_, index) =>
  box("building", [0.4, 1.8, INNER_W], [-34.2 + index * 1.8, 9.5, 0]),
);

/** South facade piers at 7.2 m centres. */
const piers: Solid[] = Array.from({ length: 10 }, (_, index) =>
  box("building", [0.6, 10.4, WALL], [-32.4 + index * 7.2, 5.2, -8.55]),
);

/** A floor slab with the ramp void (x 18–30, z 2.4–8.1) left open. */
function slabWithRampVoid(yTop: number): Solid[] {
  const t = 0.4;
  const y = yTop - t / 2;
  return [
    box("building", [18 + HALF_L - WALL, t, INNER_W], [(-HALF_L + WALL + 18) / 2, y, 0]),
    box("building", [12, t, 2.4 + 8.1], [24, y, (-8.1 + 2.4) / 2]),
    box("building", [HALF_L - WALL - 30, t, INNER_W], [(30 + HALF_L - WALL) / 2, y, 0]),
  ];
}

export const solids: readonly Solid[] = [
  // ── Below ground: the watertight tank that holds the collection
  box("building", [LENGTH, 0.8, WIDTH], [0, -8.0, 0]),
  box("building", [LENGTH, 8.4, WALL], [0, -4.2, 8.55]),
  box("building", [LENGTH, 8.4, WALL], [0, -4.2, -8.55]),
  box("building", [WALL, 8.4, INNER_W], [-HALF_L + WALL / 2, -4.2, 0]),
  box("building", [WALL, 8.4, INNER_W], [HALF_L - WALL / 2, -4.2, 0]),
  ...slabWithRampVoid(-4.2),
  // Vault cross walls
  box("building", [0.4, 3.4, INNER_W], [-18, -5.9, 0]),
  box("building", [0.4, 3.4, INNER_W], [0, -5.9, 0]),
  box("building", [0.4, 3.8, INNER_W], [-18, -2.3, 0]),
  box("building", [0.4, 3.8, 10], [0, -2.3, -3.1]),
  // Ramps down to the vaults
  box("building", [12.72, 0.4, 4.8], [24, -2.1, 5.3], -Math.atan2(4.2, 12)),
  box("building", [12.47, 0.4, 4.8], [24, -5.9, 5.3], Math.atan2(3.4, 12)),

  // ── The ground floor
  ...slabWithRampVoid(0),
  box("building", [0.3, 4.8, 10.1], [-12, 2.4, 3.05]),
  box("building", [18, 4.8, 0.3], [-3, 2.4, 0]),
  box("building", [0.3, 4.8, 8.1], [6, 2.4, 4.05]),
  box("building", [0.3, 4.8, 13.1], [30, 2.4, -1.55]),
  box("building", [2.4, 10.4, 4], [-13.2, 5.2, 6.05]),

  // ── Above ground: the long wall, end walls, piers, reading room, roof
  box("building", [LENGTH, 10.4, WALL], [0, 5.2, 8.55]),
  box("building", [WALL, 10.4, INNER_W], [-HALF_L + WALL / 2, 5.2, 0]),
  box("building", [WALL, 10.4, INNER_W], [HALF_L - WALL / 2, 5.2, 0]),
  ...piers,
  // Reading-room floor, from the stair core to the east end; the hall below it is double height.
  box("building", [HALF_L - WALL + 12, 0.4, INNER_W], [(-12 + HALF_L - WALL) / 2, 5.0, 0]),
  ...beams,

  // ── The site: a model block of earth around the tank, and the fjord
  box("earth", [92, 1.6, 34], [0, -9.2, 3]),
  box("earth", [9.8, 8.4, 34], [-41.1, -4.2, 3]),
  box("earth", [9.8, 8.4, 34], [41.1, -4.2, 3]),
  box("earth", [LENGTH, 8.4, 11], [0, -4.2, 14.5]),
  box("earth", [LENGTH, 8.4, 5], [0, -4.2, -11.5]),
  box("water", [92, 8.8, 10], [0, -5.6, -19]),
];

export const levels: readonly Level[] = [
  { y: 10.4, name: "Roof" },
  { y: 5.2, name: "Reading room" },
  { y: 0, name: "Entrance hall" },
  { y: -4.2, name: "Upper vault" },
  { y: -7.6, name: "Lower vault" },
];

/** The cutting plane's travel, from above the roof to just above the lower vault floor. */
export const cutRange = { top: 11.6, bottom: -7.0 } as const;

/** Ground-floor rooms, for the plan. */
export const rooms: readonly Room[] = [
  { id: "hall", name: "Entrance hall", rect: [-35.3, -8.1, -12, 8.1] },
  { id: "gallery", name: "Exhibition gallery", rect: [-12, -8.1, 30, 0] },
  { id: "conservation", name: "Conservation studio", rect: [-12, 0, 6, 8.1] },
  { id: "lockers", name: "Lockers and cloaks", rect: [6, 0, 18, 8.1] },
  { id: "ramp", name: "Ramp to the collection", rect: [18, 2.4, 30, 8.1] },
  { id: "loading", name: "Loading and quarantine", rect: [30, -8.1, 35.3, 8.1] },
];

export function roomArea({ rect: [x0, z0, x1, z1] }: Room): number {
  return Math.round((x1 - x0) * (z1 - z0));
}

export const modelBounds = { x: [-46, 46], y: [-10, 10.4], z: [-24, 20] } as const;
