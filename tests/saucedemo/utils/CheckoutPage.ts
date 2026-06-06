// utils/CheckoutPage.ts
import { Page, Locator } from '@playwright/test'; 

export class CheckoutPage {
  constructor(private page: Page) {}

  // --- LOCATORS (Getters) ---
  get pageTitle(): Locator {
    return this.page.locator('[data-test="secondary-header"]');
  }

  get completeHeader(): Locator {
    return this.page.locator('[data-test="complete-header"]');
  }

  // Locates the product title inside the summary overview list
  get overviewItemTitle(): Locator {
    return this.page.locator('[data-test="inventory-item"]').locator('[data-test="inventory-item-name"]');
  }

  // --- ACTIONS ---
  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.page.locator('[data-test="firstName"]').fill(firstName);
    await this.page.locator('[data-test="lastName"]').fill(lastName);
    await this.page.locator('[data-test="postalCode"]').fill(postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.page.locator('[data-test="continue"]').click();
  }

  async clickFinish(): Promise<void> {
    await this.page.locator('[data-test="finish"]').click();
  }

  async clickBackHome(): Promise<void> {
    await this.page.locator('[data-test="back-to-products"]').click();
  }
}