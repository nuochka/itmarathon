import { test, expect } from "@playwright/test";
import { RoomPage } from "../pages/RoomPage";

test.describe("User deletion feature (BDD)", () => {
  let roomPage: RoomPage;

  test.beforeEach(async ({ page }) => {
    roomPage = new RoomPage(page);
  });

  test("Admin deletes a user", async () => {
    await roomPage.goto("3c9efc15882a49ffa1a96fe6340246d2");
    await roomPage.deleteUserByName("Vasya Pupkin");
  });

  test("Non-admin cannot delete users", async () => {
    await roomPage.goto("de7ea383b9f64b4bb129cb224850e3fd");
    await roomPage.expectNoDeleteButtons();
  });
});
