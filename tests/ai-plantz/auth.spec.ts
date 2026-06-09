import { test, expect } from '@playwright/test';

test.describe('Auth screen — unauthenticated', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('shows login form by default', async ({ page }) => {
    await page.goto('/screens/auth');
    await expect(page.getByTestId('auth-email-input')).toBeVisible();
    await expect(page.getByTestId('auth-password-input')).toBeVisible();
    await expect(page.getByTestId('auth-login-button')).toBeVisible();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/screens/auth');
    await page.getByTestId('auth-email-input').fill('wrong@example.com');
    await page.getByTestId('auth-password-input').fill('wrongpassword');
    await page.getByTestId('auth-login-button').click();
    await expect(page.getByText('Invalid login credentials')).toBeVisible({ timeout: 10000 });
  });

  test('switches to signup form', async ({ page }) => {
    await page.goto('/screens/auth');
    await page.getByTestId('auth-signup-tab').click();
    await expect(page.getByTestId('auth-signup-button')).toBeVisible();
  });

  test('shows error on signup with short password', async ({ page }) => {
    await page.goto('/screens/auth');
    await page.getByTestId('auth-signup-tab').click();
    await page.getByTestId('auth-email-input').fill('newuser@72icfo45.mailosaur.net');
    await page.getByTestId('auth-password-input').fill('123');
    await page.getByTestId('auth-signup-button').click();
    await expect(page.getByText(/password/i)).toBeVisible({ timeout: 10000 });
  });

  test('can log in with valid credentials', async ({ page }) => {
    await page.goto('/screens/auth');
    await page.getByTestId('auth-email-input').fill(process.env.AI_PLANTZ_EMAIL ?? '');
    await page.getByTestId('auth-password-input').fill(process.env.AI_PLANTZ_PASSWORD ?? '');
    await page.getByTestId('auth-login-button').click();
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });
});

test.describe('Auth screen — authenticated', () => {
  test('logs out and redirects to auth screen', async ({ page }) => {
    await page.goto('/screens/settings');
    await page.getByTestId('settings-logout').click();
    await page.getByTestId('confirm-modal-confirm').click();
    await expect(page).toHaveURL(/screens\/auth/, { timeout: 10000 });
  });
});
