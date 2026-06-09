import { test, expect } from '@playwright/test';

test.describe('Home screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows heading and search input', async ({ page }) => {
    await expect(page.getByText('🌿 LeafyAI')).toBeVisible();
    await expect(page.getByTestId('plant-search-input')).toBeVisible();
    await expect(page.getByTestId('get-tips-button')).toBeVisible();
    await expect(page.getByTestId('potd-card')).toBeVisible();
  });

  test('can search for a plant and see results', async ({ page }) => {
    await page.getByTestId('plant-search-input').fill('Monstera');
    await page.getByTestId('get-tips-button').click();
    await expect(page.getByTestId('plant-summary')).toBeVisible({ timeout: 15000 });
  });

  test('random button triggers a search', async ({ page }) => {
    await page.getByTestId('random-plant-button').click();
    await expect(page.getByTestId('plant-summary')).toBeVisible({ timeout: 15000 });
  });
});
