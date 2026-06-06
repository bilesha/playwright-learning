import { test, expect } from '@playwright/test';

test('homepage loads and shows search input', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'LeafyAI' })).toBeVisible();
  await expect(page.getByRole('searchbox')).toBeVisible();
});

test('can search for a plant', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('searchbox').fill('Monstera');
  await page.getByRole('button', { name: 'Get Tips' }).click();

  await expect(page.locator('[data-testid="summary"], p, .summary').first()).toBeVisible({ timeout: 15000 });
});

test('Random button searches a plant', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Random' }).click();

  const loading = page.getByRole('progressbar').or(page.getByText(/loading/i));
  await expect(loading).toBeVisible({ timeout: 5000 });
  await expect(loading).not.toBeVisible({ timeout: 15000 });
});
