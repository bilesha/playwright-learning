import { test, expect } from '@playwright/test';

test('navigate to books page', async ({ page }) => {
  // Go to the books page
  await page.goto('https://demoqa.com/books', { timeout: 60000 });

  // Assert the "Book Store" link is visible
  await expect(page.getByRole('link', { name: 'Book Store', exact: true })).toBeVisible();

  // Wait for a specific book link to appear (stable locator)
  const firstBookLink = page.getByRole('link', { name: 'Git Pocket Guide' });
  await firstBookLink.waitFor({ state: 'visible', timeout: 20000 });

  // Click the first book
  await firstBookLink.click();

  // Assert the book details page header
  await expect(page.getByRole('heading', { name: 'Book Store', level: 1 })).toBeVisible();
});