import { test } from "node:test";
import assert from "node:assert/strict";
import { cutRange, levels, modelBounds, roomArea, rooms, solids } from "../../content/models/salt-archive.ts";
import { planShapes, sectionShapes } from "../../lib/drawing.ts";

test("every solid has a positive size and sits inside the model bounds", () => {
  for (const solid of solids) {
    solid.size.forEach((dimension) => assert.ok(dimension > 0, `non-positive size ${solid.size}`));
    const [x, y, z] = solid.position;
    assert.ok(x >= modelBounds.x[0] && x <= modelBounds.x[1], `x ${x} outside bounds`);
    assert.ok(y >= modelBounds.y[0] && y <= modelBounds.y[1], `y ${y} outside bounds`);
    assert.ok(z >= modelBounds.z[0] && z <= modelBounds.z[1], `z ${z} outside bounds`);
  }
});

test("levels run from the roof down, and the cut travels through all of them", () => {
  const heights = levels.map((level) => level.y);
  assert.deepEqual([...heights].sort((a, b) => b - a), heights);
  assert.ok(cutRange.top > heights[0], "cut starts above the roof");
  assert.ok(cutRange.bottom > modelBounds.y[0], "cut stays above the model base");
  assert.ok(cutRange.bottom > heights.at(-1)!, "cut ends inside the lowest level");
});

test("rooms lie inside the building footprint and their areas are plausible", () => {
  for (const room of rooms) {
    const [x0, z0, x1, z1] = room.rect;
    assert.ok(x0 < x1 && z0 < z1, `${room.id} rectangle is inverted`);
    assert.ok(x0 >= -36.2 && x1 <= 36.2 && z0 >= -9 && z1 <= 9, `${room.id} is outside the building`);
  }
  const total = rooms.reduce((sum, room) => sum + roomArea(room), 0);
  // The ground floor is 72.4 × 18 m gross.
  assert.ok(total < 72.4 * 18, `ground-floor rooms (${total} m²) exceed the footprint`);
});

test("the long section cuts material and shows the building beyond", () => {
  const shapes = sectionShapes(solids, -1.2);
  assert.ok(shapes.some((shape) => shape.kind === "cut" && shape.group === "building"));
  assert.ok(shapes.some((shape) => shape.kind === "cut" && shape.group === "earth"));
  assert.ok(shapes.some((shape) => shape.kind === "beyond"));
  // Beyond is drawn first so poché sits on top.
  const firstCut = shapes.findIndex((shape) => shape.kind === "cut");
  assert.ok(shapes.slice(firstCut).every((shape) => shape.kind === "cut"));
});

test("the plan cut at +1.00 finds walls, the ramp below and the roof beams overhead", () => {
  const kinds = new Set(planShapes(solids, 1).map((shape) => shape.kind));
  assert.deepEqual([...kinds].sort(), ["below", "cut", "overhead"]);
});
