import type { Solid } from "@/content/models/salt-archive";

type Point = readonly [number, number];

function toPath(points: readonly Point[]): string {
  return `M${points.map(([x, y]) => `${round(x)} ${round(y)}`).join("L")}Z`;
}

const round = (value: number) => Math.round(value * 1000) / 1000;

function range(solid: Solid, axis: 0 | 1 | 2): readonly [number, number] {
  const half = solid.size[axis] / 2;
  return [solid.position[axis] - half, solid.position[axis] + half];
}

/** A solid's outline in elevation (x, y), with SVG's y axis flipped. */
function elevationOutline(solid: Solid): string {
  const [sx, sy] = solid.size;
  const [px, py] = solid.position;
  const angle = solid.tilt ?? 0;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const corners: Point[] = [
    [-sx / 2, -sy / 2],
    [sx / 2, -sy / 2],
    [sx / 2, sy / 2],
    [-sx / 2, sy / 2],
  ];
  return toPath(corners.map(([x, y]) => [px + x * cos - y * sin, -(py + x * sin + y * cos)]));
}

export type SectionShape = { d: string; kind: "cut" | "beyond"; group: Solid["group"] };

/**
 * Long section A–A, cut at z = cutZ and looking toward +z:
 * solids the plane passes through are cut (poché); solids beyond it are
 * drawn in outline; anything in front of the plane is omitted.
 */
export function sectionShapes(solids: readonly Solid[], cutZ = 0): SectionShape[] {
  const shapes: SectionShape[] = [];
  for (const solid of solids) {
    const [z0, z1] = range(solid, 2);
    if (z0 <= cutZ && z1 >= cutZ) shapes.push({ d: elevationOutline(solid), kind: "cut", group: solid.group });
    else if (z0 > cutZ && solid.group === "building") shapes.push({ d: elevationOutline(solid), kind: "beyond", group: solid.group });
  }
  // Beyond first, so cut poché sits on top.
  return shapes.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "beyond" ? -1 : 1));
}

export type PlanShape = { d: string; kind: "cut" | "below" | "overhead" };

/** A plan rectangle (x, z) with north (+z) up. */
function planOutline(solid: Solid): string {
  const [x0, x1] = range(solid, 0);
  const [z0, z1] = range(solid, 2);
  return toPath([
    [x0, -z0],
    [x1, -z0],
    [x1, -z1],
    [x0, -z1],
  ]);
}

/**
 * Plan cut at height cutY: walls the plane passes through are poché,
 * ramps below are outlined, roof beams above are shown dashed.
 */
export function planShapes(solids: readonly Solid[], cutY = 1): PlanShape[] {
  const shapes: PlanShape[] = [];
  for (const solid of solids) {
    if (solid.group !== "building") continue;
    const [y0, y1] = range(solid, 1);
    const slab = solid.size[1] <= 0.8 && !solid.tilt;
    if (y0 <= cutY && y1 >= cutY) shapes.push({ d: planOutline(solid), kind: "cut" });
    else if (solid.tilt && y1 < cutY && y0 > -4.5) shapes.push({ d: planOutline(solid), kind: "below" });
    else if (y0 > 8 && !slab) shapes.push({ d: planOutline(solid), kind: "overhead" });
  }
  return shapes;
}

export function rectPath([x0, z0, x1, z1]: readonly [number, number, number, number]): string {
  return toPath([
    [x0, -z0],
    [x1, -z0],
    [x1, -z1],
    [x0, -z1],
  ]);
}
