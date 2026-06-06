import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('SauceDemo login page has no accessibility violations', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  const results = await new AxeBuilder({ page })
    .disableRules(['landmark-one-main', 'page-has-heading-one', 'region'])
    .analyze();

  expect(results.violations).toHaveLength(0);
});