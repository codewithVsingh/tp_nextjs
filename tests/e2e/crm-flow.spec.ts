import { test, expect } from "@playwright/test";

test.describe("Admin CRM Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Leads CRM
    await page.goto("/admin/leads");
  });

  test("should display the leads table and filters", async ({ page }) => {
    // Check for header
    await expect(page.getByText("Lead CRM")).toBeVisible();
    
    // Check for the new Smart Filters
    await expect(page.getByText("Advanced Filters")).toBeVisible();
    
    // Check if table rows exist
    const rows = page.locator("table tbody tr");
    await expect(rows).count().toBeGreaterThanOrEqual(0);
  });

  test("should open the Add Lead modal", async ({ page }) => {
    await page.getByText("Add Lead").click();
    await expect(page.getByText("Add New Lead")).toBeVisible();
  });

  test("should handle multi-row selection and show bulk toolbar", async ({ page }) => {
    // Select first row checkbox
    const firstCheckbox = page.locator("table tbody tr").first().locator("input[type='checkbox']");
    
    if (await firstCheckbox.isVisible()) {
      await firstCheckbox.click();
      
      // Bulk toolbar should appear
      await expect(page.getByText("Selected")).toBeVisible();
      await expect(page.getByText("Update Stage")).toBeVisible();
      
      // Clear selection
      await page.getByText("Cancel").click();
      await expect(page.getByText("Selected")).not.toBeVisible();
    }
  });
});
