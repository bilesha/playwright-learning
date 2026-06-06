import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '.auth/user.json');

setup('save auth state', async ({ page }) => {
  await page.context().storageState({ path: authFile });
});
