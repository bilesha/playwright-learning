import { test, expect, devices } from '@playwright/test';
import { LoginPage } from '../../utils/LoginPage';

// Strip defaultBrowserType so this test runs on whichever browser the project specifies
const { defaultBrowserType: _, ...iPhoneSettings } = devices['iPhone 13'];
test.use({ ...iPhoneSettings });

test('inventory page loads on mobile', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);

  await expect(page).toHaveURL(/inventory/);

  if (!process.env.CI) {
    await expect(page).toHaveScreenshot('inventory-mobile.png');
  }
});
