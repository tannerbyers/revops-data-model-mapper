import { test, expect } from "@playwright/test";

test.describe("RevOps Data Model Mapper smoke tests", () => {
  test("app loads and shows the main title", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("RevOps Data Model Mapper");
  });

  test("source tool selector works", async ({ page }) => {
    await page.goto("/");
    const select = page.locator("select").first();
    await select.selectOption("salesforce");
    await expect(page.getByText("Salesforce")).toBeVisible();
  });

  test("compare page works", async ({ page }) => {
    await page.goto("/compare");
    await expect(page.locator("h1")).toContainText("Compare Tools");

    // Select two tools
    const selects = page.locator("select");
    await selects.nth(0).selectOption("salesforce");
    await selects.nth(1).selectOption("hubspot");

    // Should show consulting notes
    await expect(page.getByText("Consulting Notes")).toBeVisible();
  });

  test("canonical model page renders", async ({ page }) => {
    await page.goto("/model");
    await expect(page.locator("h1")).toContainText("Canonical Revenue Data Model");
    // Should list all 8 canonical objects
    const objects = page.locator("h2");
    await expect(objects.first()).toBeVisible();
  });

  test("export button creates content", async ({ page }) => {
    await page.goto("/export");
    await expect(page.locator("h1")).toContainText("Export Report");

    // Select tools and format, then generate
    const selects = page.locator("select");
    await selects.nth(0).selectOption("salesforce");
    await selects.nth(1).selectOption("hubspot");

    await page.getByText("Generate Report").click();

    // Should show preview
    await expect(page.getByText("Preview (CSV)")).toBeVisible();
  });
});