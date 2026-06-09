import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '.auth/user.json');

setup('authenticate', async ({ page }) => {
  const baseURL = process.env.AI_PLANTZ_URL ?? 'http://localhost:8081';
  await page.goto(`${baseURL}/screens/auth`);

  await page.getByRole('textbox', { name: 'you@example.com' }).fill(process.env.AI_PLANTZ_EMAIL ?? '');
  await page.getByRole('textbox', { name: 'Enter your password' }).fill(process.env.AI_PLANTZ_PASSWORD ?? '');
  await page.getByText('Log in').nth(1).click();

  await page.waitForURL(url => url.pathname === '/' || url.pathname === '/screens/username');

  if (page.url().includes('/screens/username')) {
    await page.waitForURL(`${baseURL}/`);
  }

  await page.context().storageState({ path: authFile });
});
