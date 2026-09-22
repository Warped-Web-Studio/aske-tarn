import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { heroFiles } from "../../content/images/heroes.ts";

const root = join(import.meta.dirname, "../..");
const manifest = JSON.parse(readFileSync(join(root, "content/images/sources.json"), "utf8")) as {
  images: { file: string; id: string; page: string; by: string }[];
};
const projectsSource = readFileSync(join(root, "content/projects.ts"), "utf8");

test("every image in the manifest exists on disk and is credited", () => {
  for (const image of manifest.images) {
    assert.ok(existsSync(join(root, "content/images", image.file)), `missing ${image.file}`);
    assert.ok(image.by.trim().length > 0, `${image.file} has no photographer`);
    assert.match(image.page, /^[\w-]+$/, `${image.file} has no photo page`);
  }
});

test("every image imported by the content is in the manifest", () => {
  const listed = new Set(manifest.images.map((image) => image.file));
  const imported = [...projectsSource.matchAll(/from "\.\/images\/([^"]+)"/g)].map((match) => match[1]);
  assert.ok(imported.length > 0);
  for (const file of imported) assert.ok(listed.has(file), `${file} is not credited in sources.json`);
});

test("social-card heroes match each project's hero photograph", () => {
  // Map import identifiers to files, then read each project's `hero: { src: identifier`.
  const files = new Map(
    [...projectsSource.matchAll(/import (\w+) from "\.\/images\/([^"]+)"/g)].map((match) => [match[1], match[2]]),
  );
  const slugs = [...projectsSource.matchAll(/slug: "([^"]+)"/g)].map((match) => match[1]);
  const heroes = [...projectsSource.matchAll(/hero: \{ src: (\w+)|hero: \{\s*src: (\w+)/g)].map((match) => match[1] ?? match[2]);

  assert.equal(slugs.length, heroes.length, "every project has a hero");
  assert.deepEqual(Object.keys(heroFiles).sort(), [...slugs].sort());
  slugs.forEach((slug, index) => {
    assert.equal(heroFiles[slug], files.get(heroes[index]), `${slug} social card uses a different photograph`);
  });
});

test("the site identifies itself as a concept and uses a reserved domain", () => {
  const site = readFileSync(join(root, "content/site.ts"), "utf8");
  assert.match(site, /fictional practice/);
  assert.match(site, /Warped Web Studio/);
  assert.match(site, /@asketarn\.example"/);
});
