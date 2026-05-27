import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  itemNames(): Locator {
    return this.page.locator('[data-test="inventory-item-name"]');
  }

  async addToCart(productName: string) {
    const id = productName.toLowerCase().replace(/ /g, '-');
    await this.page.locator(`[data-test="add-to-cart-${id}"]`).click();
  }

  cartBadge(): Locator {
    return this.page.locator('[data-test="shopping-cart-badge"]');
  }

  async goToCart(): Promise<void> {
    await this.page.locator('[data-test="shopping-cart-link"]').click();
  }

  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.page.locator('[data-test="product-sort-container"]').selectOption(value);
  }

  async allItemNames(): Promise<string[]> {
    return this.page.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  async allItemPrices(): Promise<number[]> {
    const texts = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }
}