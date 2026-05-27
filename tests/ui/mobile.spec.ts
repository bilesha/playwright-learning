import { test, expect, devices } from '@playwright/test';
import { LoginPage } from '../../utils/LoginPage';

test.use({ ...devices['iPhone 13'] });

test('inventory page loads on mobile', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/inventory/);
  await expect(page).toHaveScreenshot('inventory-mobile.png');
});