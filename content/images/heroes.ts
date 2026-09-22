/**
 * Hero photograph file for each project, by slug, for places that need a
 * path on disk rather than an imported image (social cards).
 * Tests keep this in step with content/projects.ts and the image manifest.
 */
export const heroFiles: Readonly<Record<string, string>> = {
  "the-salt-archive": "salt-archive/exterior.jpg",
  "hollin-house": "hollin-house/sea.jpg",
  "refuge-bregaglia": "bregaglia/refuge.jpg",
  "casa-umbra": "casa-umbra/dunes.jpg",
  "hotel-lanterna": "lanterna/stone.jpg",
  "nave-gallery": "nave/hall.jpg",
  "threshold-pavilion": "threshold/lattice.jpg",
};
