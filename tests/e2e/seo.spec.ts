import { expect, test } from "@playwright/test";

test("each sheet has its own title, description, canonical and social image", async ({ page }) => {
  const pages = [
    { path: "/", title: /^Aske Tarn — Architects$/ },
    { path: "/projects", title: /^Index — Aske Tarn$/ },
    { path: "/projects/the-salt-archive", title: /^The Salt Archive — Aske Tarn$/ },
    { path: "/studio", title: /^Studio — Aske Tarn$/ },
  ];
  for (const { path, title } of pages) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{60,}/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${path === "/" ? "" : path}$`));
    await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute("content", /opengraph-image/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  }
});

test("structured data identifies the practice as a concept", async ({ page }) => {
  await page.goto("/projects/the-salt-archive");
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const data = blocks.map((block) => JSON.parse(block) as Record<string, unknown>);
  const organization = data.find((item) => item["@type"] === "Organization");
  expect(String(organization?.description)).toContain("fictional");
  expect(data.some((item) => item["@type"] === "CreativeWork" && item.name === "The Salt Archive")).toBe(true);
});

test("sitemap, robots and social images are served", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/projects/the-salt-archive");
  expect(sitemap.match(/<url>/g)?.length).toBe(11);

  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/);

  const og = await request.get("/projects/the-salt-archive/opengraph-image");
  expect(og.headers()["content-type"]).toBe("image/png");
});
