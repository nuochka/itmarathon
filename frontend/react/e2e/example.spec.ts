import { test, expect } from "@playwright/test";

test.describe("User Deletion feature", () => {
  test("Admin can delete a user", async ({ page }) => {
    await page.goto("https://nuochkasecret.onrender.com/room/3c9efc15882a49ffa1a96fe6340246d2");
    await expect(page.locator("text=Vasya Pupkin")).toBeVisible();

    await page.locator('img[alt="Delete"]').first().click();

    await expect(page.locator(".toaster__message")).toHaveText("User successfully removed!");
  });

  test("Non-admin cannot see delete button", async ({ page }) => {
    await page.goto("https://nuochkasecret.onrender.com/room/3c9efc15882a49ffa1a96fe6340246d2");
    await expect(page.locator('img[alt="Delete"]')).toHaveCount(0);
  });
});
