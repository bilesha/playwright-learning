import { test, expect } from '@playwright/test';
import { LoginPage } from '../../utils/LoginPage';
import { InventoryPage } from '../../utils/InventoryPage';
import { CartPage } from '../../utils/CartPage';
import { CheckoutPage } from '../../utils/CheckoutPage';

test.describe('login', () => {
  test('fails with incorrect credentials @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('f', 'f');

    await expect(loginPage.errorMessage()).toBeVisible();
  });
});

test.describe('inventory', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
    await expect(page).toHaveURL(/inventory/);
  });

  test('shows 6 products @smoke', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.itemNames()).toHaveCount(6);
  });

  test('add to cart updates badge @regression', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge()).toHaveText('1');
  });
});

test.describe('checkout', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
    await inventoryPage.addToCart('Sauce Labs Backpack');
  });

  test('successfully completes the checkout flow @smoke', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.goToCart(); 

    // Cart Page: Assert title here in the test block
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
    await cartPage.checkout();

    // Checkout Step 1: Information
    await expect(checkoutPage.pageTitle).toHaveText('Checkout: Your Information');
    await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');
    await checkoutPage.clickContinue();

    // Checkout Step 2: Overview (Re-added the verification correctly!)
    await expect(checkoutPage.pageTitle).toHaveText('Checkout: Overview');
    await expect(checkoutPage.overviewItemTitle).toHaveText('Sauce Labs Backpack');
    await checkoutPage.clickFinish();

    // Checkout Step 3: Complete
    await expect(checkoutPage.pageTitle).toHaveText('Checkout: Complete!');
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await checkoutPage.clickBackHome();
  });
});