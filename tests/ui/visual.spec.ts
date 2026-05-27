import { test, expect } from '@playwright/test';
import { LoginPage } from '../../utils/LoginPage';

test('inventory page matches screenshot', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);

  await expect(page).toHaveScreenshot('inventory.png');
});