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
    // Verify the info badge shows the tool name
    await expect(page.getByText(/Source: Salesforce/)).toBeVisible();
  });

  test("can navigate to compare page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Compare" }).click();
    await page.waitForURL("**/compare");
    await expect(page.locator("h1")).toContainText("Compare Tools");
  });

  test("can navigate to canonical model page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Canonical Model" }).click();
    await page.waitForURL("**/model");
    await expect(page.locator("h1")).toContainText("Canonical Revenue Data Model");
    await expect(page.locator("h2").first()).toBeVisible();
  });

  test("can navigate to export page and generate content", async ({ page }) => {
    await page.goto("/");
    const exportLink = page.getByRole("link", { name: "Export" });
    await exportLink.click();
    await page.waitForURL("**/export");
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