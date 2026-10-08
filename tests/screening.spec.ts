import {expect, test} from "@playwright/test";

test("screens a conflicting fence and builds its packet", async ({page}) => {
  await page.goto("/");
  await page.getByLabel("Height / profile (feet)").fill("8");
  await page.getByLabel("Primary material").fill("Vinyl");
  await page.getByRole("button", {name: "Screen project"}).click();
  await expect(page.getByText("Resolve before submission")).toBeVisible();
  await expect(page.getByText("Reduce fence height to 6 ft or request a variance.")).toBeVisible();
  await page.getByLabel("Labeled site plan with dimensions").check();
  await expect(page.getByText("1 of 5 ready")).toBeVisible();
});

test("shows validation and a compliant state", async ({page}) => {
  await page.goto("/");
  await page.getByLabel("Height / profile (feet)").fill("0");
  await page.getByRole("button", {name: "Screen project"}).click();
  await expect(page.locator(".error")).toHaveText("Enter a height from 1 to 12 feet.");
  await page.getByLabel("Height / profile (feet)").fill("6");
  await page.getByLabel("Touches a shared property line").uncheck();
  await page.getByRole("button", {name: "Screen project"}).click();
  await expect(page.getByText("No rule conflicts detected")).toBeVisible();
});

test("mobile view has no horizontal overflow", async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile-only overflow assertion");
  await page.goto("/");
  const dimensions = await page.evaluate(() => ({scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth}));
  expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1);
});
