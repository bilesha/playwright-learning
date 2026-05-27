import { test, expect } from '@playwright/test';
import { LoginPage } from '../../utils/LoginPage';
import { InventoryPage } from '../../utils/InventoryPage';

test.describe('expect.poll and expect.toPass', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
    await expect(page).toHaveURL(/inventory/);
  });

  test('expect.poll — cart count reaches 2', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.addToCart('Sauce Labs Bike Light');

    // poll keeps calling this function until the result satisfies the matcher
    await expect.poll(async () => {
      const text = await inventoryPage.cartBadge().textContent();
      return Number(text);
    }).toBe(2);
  });

  test('expect.toPass — cart badge and URL are both correct', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCart('Sauce Labs Backpack');

    // toPass retries the entire block until all assertions inside pass
    await expect(async () => {
      await expect(inventoryPage.cartBadge()).toHaveText('1');
      await expect(page).toHaveURL(/inventory/);
    }).toPass();
  });
});
