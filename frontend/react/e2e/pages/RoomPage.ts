import { Page, Locator, expect } from "@playwright/test";

export class RoomPage {
  readonly page: Page;
  readonly participants: Locator;
  readonly deleteButtons: Locator;
  readonly toasterMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.participants = page.locator(".participant-card");
    this.deleteButtons = page.locator('img[alt="Delete"]');
    this.toasterMessage = page.locator(".toaster__message");
  }

  async goto(roomCode: string) {
    await this.page.goto(`https://nuochkasecret.onrender.com/room/${roomCode}`);
    await this.page.waitForSelector(".participant-list__cards", { timeout: 10000 });
  }

  async deleteUserByName(name: string) {
    const user = this.page.locator(`text=${name}`);
    if (await user.count()) {
      await expect(user).toBeVisible();
      await user.scrollIntoViewIfNeeded();
      await this.deleteButtons.first().click();
      await expect(this.toasterMessage).toContainText("successfully removed");
    } else {
      console.log(`User '${name}' not found.`);
    }
  }

  async expectNoDeleteButtons() {
    await expect(this.deleteButtons).toHaveCount(0);
  }
}
