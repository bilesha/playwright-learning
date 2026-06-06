import { test as setup } from '@playwright/test';
import { LoginPage } from './utils/LoginPage';

setup('save auth state', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
  await page.context().storageState({ path: 'tests/saucedemo/.auth/user.json' });
});
