// Downloads the temporary photography listed in content/images/sources.json
// and applies one shared grade so the set reads as a single photographer's
// work. Output is committed; this only needs re-running when sources change.
//
//   npm run images            fetch missing files
//   npm run images -- --force re-fetch and re-grade everything

import { mkdir, readFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const imageDir = join(root, "content/images");
const { images } = JSON.parse(await readFile(join(imageDir, "sources.json"), "utf8"));
const force = process.argv.includes("--force");

const LONG_EDGE = 2560;

/** The house grade: slightly muted, a touch warm, shadows lifted like matte print. */
function grade(pipeline) {
  return pipeline
    .modulate({ saturation: 0.74 })
    .recomb([
      [1.03, 0.0, 0.0],
      [0.0, 1.0, 0.0],
      [0.0, 0.01, 0.94],
    ])
    .linear(0.94, 8);
}

const exists = (path) => access(path).then(() => true, () => false);

for (const image of images) {
  const target = join(imageDir, image.file);
  if (!force && (await exists(target))) continue;

  const url = `https://images.unsplash.com/${image.id}?w=${LONG_EDGE}&q=90&fm=jpg`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${image.file}: ${response.status} ${url}`);
  const source = Buffer.from(await response.arrayBuffer());

  await mkdir(dirname(target), { recursive: true });
  await grade(sharp(source).rotate().resize({ width: LONG_EDGE, height: LONG_EDGE, fit: "inside" }))
    .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: "4:2:0" })
    .toFile(target);

  console.log(`✓ ${image.file}`);
}
