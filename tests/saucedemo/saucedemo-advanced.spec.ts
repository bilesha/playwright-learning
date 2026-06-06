import { test, expect } from '@playwright/test';
import { LoginPage } from './utils/LoginPage';
import { InventoryPage } from './utils/InventoryPage';
import { CartPage } from './utils/CartPage';
import { CheckoutPage } from './utils/CheckoutPage';

const loginCases = [
  { username: 'standard_user',   expectInventory: true  },
  { username: 'problem_user',    expectInventory: true  },
  { username: 'locked_out_user', expectInventory: false },
];

test.describe('checkout with test.step', () => {
  test('completes checkout flow', async ({ page }) => {
    const loginPage    = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage     = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await test.step('log in', async () => {
      await loginPage.goto();
      await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
      await expect(page).toHaveURL(/inventory/);
    });

    await test.step('add item to cart', async () => {
      await inventoryPage.addToCart('Sauce Labs Backpack');
      await expect(inventoryPage.cartBadge()).toHaveText('1');
    });

    await test.step('proceed to checkout', async () => {
      await inventoryPage.goToCart();
      await expect(cartPage.pageTitle).toHaveText('Your Cart');
      await cartPage.checkout();
    });

    await test.step('fill shipping information', async () => {
      await expect(checkoutPage.pageTitle).toHaveText('Checkout: Your Information');
      await checkoutPage.fillCheckoutInformation('Jane', 'Doe', '99999');
      await checkoutPage.clickContinue();
    });

    await test.step('confirm order', async () => {
      await expect(checkoutPage.pageTitle).toHaveText('Checkout: Overview');
      await expect(checkoutPage.overviewItemTitle).toHaveText('Sauce Labs Backpack');
      await checkoutPage.clickFinish();
    });

    await test.step('verify order complete', async () => {
      await expect(checkoutPage.pageTitle).toHaveText('Checkout: Complete!');
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    });
  });
});

test.describe('product sorting', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
    await expect(page).toHaveURL(/inventory/);
  });

  test('sorts by name A to Z', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('az');

    const names = await inventoryPage.allItemNames();
    expect(names).toEqual([...names].sort());
  });

  test('sorts by name Z to A', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('za');

    const names = await inventoryPage.allItemNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('sorts by price low to high', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.allItemPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorts by price high to low', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('hilo');

    const prices = await inventoryPage.allItemPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});

test.describe('negative login scenarios', () => {
  const cases = [
    { username: '',             password: '',            expectedError: 'Username is required'                        },
    { username: 'standard_user', password: '',           expectedError: 'Password is required'                        },
    { username: 'standard_user', password: 'wrongpass',  expectedError: 'Username and password do not match'          },
  ];

  for (const { username, password, expectedError } of cases) {
    test(`shows error: ${expectedError}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(username, password);
      await expect(loginPage.errorMessage()).toContainText(expectedError);
    });
  }
});

test.describe('login behaviour across user types', () => {
  for (const { username, expectInventory } of loginCases) {
    test(username, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(username, process.env.SAUCE_PASSWORD!);

      if (expectInventory) {
        await expect(page).toHaveURL(/inventory/);
      } else {
        await expect(loginPage.errorMessage()).toBeVisible();
      }
    });
  }
});
