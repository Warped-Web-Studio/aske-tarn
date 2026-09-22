import type { Coordinates, Project } from "./types";

function dms(value: number, positive: string, negative: string): string {
  const hemisphere = value >= 0 ? positive : negative;
  const absolute = Math.abs(value);
  const degrees = Math.floor(absolute);
  const minutes = Math.round((absolute - degrees) * 60);
  // Rounding can carry a full 60′ into the degree.
  const [d, m] = minutes === 60 ? [degrees + 1, 0] : [degrees, minutes];
  return `${d}°${String(m).padStart(2, "0")}′${hemisphere}`;
}

/** 56°58′N 8°42′E */
export function formatCoordinates({ lat, lng }: Coordinates): string {
  return `${dms(lat, "N", "S")} ${dms(lng, "E", "W")}`;
}

const areaFormat = new Intl.NumberFormat("en-GB");

/** 4,860 m² */
export function formatArea(squareMetres: number): string {
  return `${areaFormat.format(squareMetres)} m²`;
}

/** Architectural dimension notation: 72.40 */
export function formatMetres(metres: number): string {
  return metres.toFixed(2);
}

/** Signed level notation: +3.00, ±0.00, −2.80 (true minus sign). */
export function formatLevel(metres: number): string {
  if (Math.abs(metres) < 0.005) return "±0.00";
  return `${metres > 0 ? "+" : "−"}${Math.abs(metres).toFixed(2)}`;
}

/** 2019–2024, or 2022– for work on site. */
export function formatYears({ years, status }: Pick<Project, "years" | "status">): string {
  if (years.end === undefined) return status === "On site" ? `${years.start}–` : String(years.start);
  if (years.end === years.start) return String(years.start);
  return `${years.start}–${years.end}`;
}

export function yearLabel(project: Pick<Project, "years">): number {
  return project.years.end ?? project.years.start;
}
