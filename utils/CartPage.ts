import { Page, Locator } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) { }

  // Expose the title element as a raw locator
  get pageTitle(): Locator {
    return this.page.locator('[data-test="secondary-header"]');
  }

  async checkout() {
    await this.page.locator('[data-test="checkout"]').click();
  }
}