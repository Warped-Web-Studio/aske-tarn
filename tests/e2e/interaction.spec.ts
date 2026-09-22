import { expect, test } from "@playwright/test";

test.describe("keyboard", () => {
  test("skip link is the first stop and moves focus to the content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test("title block navigation is reachable and marks the current sheet", async ({ page }) => {
    await page.goto("/studio");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link", { name: "Studio" })).toHaveAttribute("aria-current", "page");
    await nav.getByRole("link", { name: "Index" }).focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.locator("h1")).toHaveText(/Index/i);
  });

  test("focus is visible", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("link", { name: "studio@asketarn.example" }).first().focus();
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement as Element).outlineStyle);
    expect(outline).toBe("solid");
  });

  test("index filter is a native radio group", async ({ page }) => {
    await page.goto("/projects");
    const rows = page.locator("tbody tr");
    await expect(rows).toHaveCount(7);
    await page.getByRole("radio", { name: /Residential/ }).check();
    await expect(rows.filter({ visible: true })).toHaveCount(2);
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("radio", { name: /Hospitality/ })).toBeChecked();
    await expect(rows.filter({ visible: true })).toHaveCount(2);
  });

  test("plan rooms can be focused and are highlighted", async ({ page }) => {
    await page.goto("/projects/the-salt-archive");
    const row = page.locator('tr[data-room="gallery"]');
    await row.focus();
    const on = await page.locator('path[data-room="gallery"]').first().evaluate((element) => getComputedStyle(element).getPropertyValue("--on").trim());
    expect(on).toBe("1");
  });
});

test.describe("phone navigation", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("sheet index opens, takes focus, closes with Escape and on navigation", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Sheets" });
    const index = page.locator("#sheet-index");
    await trigger.tap();
    await expect(index).toBeVisible();
    await expect(index.getByRole("link", { name: /Work/ })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(index).toBeHidden();

    await trigger.tap();
    await index.getByRole("link", { name: /Studio/ }).tap();
    await expect(page).toHaveURL(/\/studio$/);
    await expect(index).toBeHidden();
  });
});

test.describe("section study", () => {
  test("three.js stays off the critical path, then scrubs with scroll", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const stage = page.locator("[data-status]").first();
    await expect(stage).toHaveAttribute("data-status", "ready", { timeout: 15_000 });

    // The model chunk is requested only after the page's load event.
    const timing = await page.evaluate(() => {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      const scripts = performance.getEntriesByType("resource").filter((entry) => entry.name.endsWith(".js"));
      return { loadEnd: navigation.loadEventEnd, lastScript: Math.max(...scripts.map((entry) => entry.startTime)) };
    });
    expect(timing.lastScript).toBeGreaterThanOrEqual(timing.loadEnd);

    await page.locator("#section-study").scrollIntoViewIfNeeded();

    const slider = page.getByRole("slider", { name: "Section plane height" });
    const start = await slider.inputValue();
    await page.mouse.wheel(0, 1400);
    await expect.poll(() => slider.inputValue()).not.toBe(start);
  });

  test("the slider drives the cut from the keyboard", async ({ page }) => {
    await page.goto("/");
    const slider = page.getByRole("slider", { name: "Section plane height" });
    await slider.scrollIntoViewIfNeeded();
    await slider.focus();
    const before = Number(await slider.inputValue());
    for (let i = 0; i < 20; i++) await page.keyboard.press("ArrowDown");
    await expect.poll(async () => Number(await slider.inputValue())).toBeLessThan(before);
    await expect(slider).toHaveAttribute("aria-valuetext", /Cut at/);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("content is present without motion and the study becomes a still, slider-driven model", async ({ page }) => {
    await page.goto("/");
    // Reveal targets are never hidden.
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll("[data-line] > *")].filter((element) => getComputedStyle(element).translate !== "none" && getComputedStyle(element).translate !== "0px").length,
    );
    expect(hidden).toBe(0);

    const readout = page.locator("#section-study [class*='readout'] span");
    await expect(readout).toHaveText("+2.60");
    const track = page.locator("#section-study [class*='track']");
    const stagePosition = await track.locator("[data-status]").evaluate((element) => getComputedStyle(element).position);
    expect(stagePosition).toBe("relative");

    const slider = page.getByRole("slider", { name: "Section plane height" });
    await slider.fill("-4");
    await expect(readout).toHaveText("−4.00");
  });
});

test.describe("images", () => {
  test("the hero photograph is the prioritised LCP image; later ones are lazy", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("section[aria-labelledby='hero-title'] img").first();
    await expect(hero).toHaveAttribute("fetchpriority", "high");
    await expect(hero).not.toHaveAttribute("loading", "lazy");
    const lazy = await page.locator("main img[loading='lazy']").count();
    expect(lazy).toBeGreaterThan(5);
    const sources = await page.locator("main img").evaluateAll((images) => images.map((image) => (image as HTMLImageElement).srcset));
    expect(sources.every((srcset) => srcset.includes("/_next/image"))).toBe(true);
  });
});

test.describe("routes", () => {
  test("a project leads to the next sheet, and back to the index", async ({ page }) => {
    await page.goto("/projects");
    await page.getByRole("link", { name: "Casa Umbra" }).click();
    await expect(page).toHaveURL(/\/projects\/casa-umbra$/);
    await expect(page.locator("h1")).toHaveText(/Casa Umbra/i);

    await page.getByRole("navigation", { name: "Next project" }).getByRole("link").click();
    await expect(page).toHaveURL(/\/projects\/hotel-lanterna$/);
    await expect(page.locator("h1")).toHaveText(/Hotel Lanterna/i);

    await page.goBack();
    await expect(page.locator("h1")).toHaveText(/Casa Umbra/i);
  });

  test("unknown sheets get the site-boundary page", async ({ page }) => {
    const response = await page.goto("/projects/not-a-project");
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toHaveText(/Beyond the\s+site boundary/i);
    await page.getByRole("link", { name: /Return to sheet 01/ }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
