import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '.auth/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto('/screens/auth');

  await page.getByLabel('Email').fill(process.env.AI_PLANTZ_EMAIL ?? '');
  await page.getByLabel('Password').fill(process.env.AI_PLANTZ_PASSWORD ?? '');
  await page.getByRole('button', { name: 'Log in' }).click();

  await page.waitForURL('/');

  await page.context().storageState({ path: authFile });
});
