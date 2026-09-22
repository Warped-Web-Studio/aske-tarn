import type { StaticImageData } from "next/image";

export type Photo = {
  src: StaticImageData;
  alt: string;
  /** CSS object-position, used when a frame crops the photograph. */
  focus?: string;
};

export type ProjectType =
  | "Cultural"
  | "Residential"
  | "Hospitality"
  | "Gallery"
  | "Pavilion";

export type ProjectStatus = "Completed" | "On site" | "Temporary";

export type Material = {
  code: string;
  name: string;
  spec: string;
  photo?: Photo;
};

export type NarrativeSection = {
  /** Drawing reference shown beside the heading, e.g. "S-01". */
  ref: string;
  heading: string;
  body: string[];
};

export type Coordinates = { lat: number; lng: number };

export type Project = {
  slug: string;
  /** Practice job number, e.g. "AT-021". */
  number: string;
  name: string;
  type: ProjectType;
  /** Plain-language programme, e.g. "Archive and reading rooms". */
  programme: string;
  region: string;
  country: string;
  coordinates: Coordinates;
  years: { start: number; end?: number };
  status: ProjectStatus;
  /** Gross floor area in m². */
  area: number;
  levels: string;
  /** One governing dimension, drawn as a dimension string on imagery. */
  dimension: { label: string; metres: number };
  structure: string;
  summary: string;
  intro: string;
  narrative: NarrativeSection[];
  materials: Material[];
  hero: Photo;
  gallery: Photo[];
};
