import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/projects", "/projects/the-salt-archive", "/projects/casa-umbra", "/studio", "/contact"];
const WIDTHS = [320, 375, 390, 430, 768, 1024, 1440, 1920];

for (const width of WIDTHS) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: width < 768 ? 800 : 900 }, hasTouch: width < 1024 });

    for (const route of ROUTES) {
      test(`${route} has no horizontal overflow or console errors`, async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("console", (message) => {
          if (message.type() === "error") errors.push(message.text());
        });

        await page.goto(route, { waitUntil: "networkidle" });

        // Walk the page so every reveal, lazy image and the model get a chance to run.
        await page.evaluate(async () => {
          for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.8) {
            window.scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 60));
          }
        });

        const { scrollWidth, innerWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
        }));
        expect(scrollWidth, "document is wider than the viewport").toBeLessThanOrEqual(innerWidth);
        await expect(page.locator("h1")).toHaveCount(1);
        expect(errors).toEqual([]);
      });
    }
  });
}

test.describe("labels stay legible on phones", () => {
  test.use({ viewport: { width: 320, height: 640 }, hasTouch: true });

  test("no text renders below 11px", async ({ page }) => {
    for (const route of ["/", "/projects/the-salt-archive", "/projects"]) {
      await page.goto(route);
      const tiny = await page.evaluate(() =>
        [...document.querySelectorAll("body *")]
          .filter((element) => {
            const node = [...element.childNodes].find((child) => child.nodeType === 3 && child.textContent?.trim());
            if (!node) return false;
            const style = getComputedStyle(element);
            return style.display !== "none" && style.visibility !== "hidden" && parseFloat(style.fontSize) < 11;
          })
          .map((element) => `${element.tagName}.${element.className}: ${getComputedStyle(element).fontSize}`),
      );
      expect(tiny, route).toEqual([]);
    }
  });
});
