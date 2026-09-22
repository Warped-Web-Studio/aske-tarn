import { test } from "node:test";
import assert from "node:assert/strict";
import { formatArea, formatCoordinates, formatLevel, formatMetres, formatYears } from "../../lib/format.ts";

test("coordinates use degrees and minutes with hemispheres", () => {
  assert.equal(formatCoordinates({ lat: 56.9712, lng: 8.7034 }), "56°58′N 8°42′E");
  assert.equal(formatCoordinates({ lat: -24.1412, lng: -69.9338 }), "24°08′S 69°56′W");
});

test("rounding up to 60 minutes carries into the degree", () => {
  assert.equal(formatCoordinates({ lat: 10.9999, lng: 0 }), "11°00′N 0°00′E");
});

test("levels are signed with a true minus and a ± datum", () => {
  assert.equal(formatLevel(0), "±0.00");
  assert.equal(formatLevel(10.4), "+10.40");
  assert.equal(formatLevel(-2.8), "−2.80");
  assert.equal(formatLevel(0.001), "±0.00");
});

test("areas and dimensions", () => {
  assert.equal(formatArea(4860), "4,860 m²");
  assert.equal(formatMetres(72.4), "72.40");
});

test("years describe completed, ongoing and single-year work", () => {
  assert.equal(formatYears({ years: { start: 2019, end: 2024 }, status: "Completed" }), "2019–2024");
  assert.equal(formatYears({ years: { start: 2022 }, status: "On site" }), "2022–");
  assert.equal(formatYears({ years: { start: 2025, end: 2025 }, status: "Temporary" }), "2025");
});
