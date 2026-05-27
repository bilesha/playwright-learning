import { test, expect } from '../../utils/fixtures';

test('inventory page loads after login', async ({ loggedInPage }) => {
  await expect(loggedInPage).toHaveURL(/inventory/);
});

test('can add item to cart after login', async ({ loggedInPage }) => {
  await loggedInPage.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
});
