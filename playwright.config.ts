import { defineConfig, devices } from '@playwright/test';

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/ct/**'],
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['./utils/SummaryReporter.ts'],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    headless: !!process.env.CI,
  },
   
  /* Configure projects for major browsers */
  projects: [
    // jsonplaceholder
    { name: 'jsonplaceholder-setup', testMatch: '**/jsonplaceholder/auth.setup.ts' },
    { name: 'jsonplaceholder-chromium', testDir: './tests/jsonplaceholder', use: { ...devices['Desktop Chrome'], baseURL: 'https://jsonplaceholder.typicode.com', storageState: 'tests/jsonplaceholder/.auth/user.json' }, dependencies: ['jsonplaceholder-setup'] },
    { name: 'jsonplaceholder-firefox', testDir: './tests/jsonplaceholder', use: { ...devices['Desktop Firefox'], baseURL: 'https://jsonplaceholder.typicode.com' } },
    { name: 'jsonplaceholder-webkit', testDir: './tests/jsonplaceholder', use: { ...devices['Desktop Safari'], baseURL: 'https://jsonplaceholder.typicode.com' } },

    // saucedemo
    { name: 'saucedemo-setup', testMatch: '**/saucedemo/auth.setup.ts' },
    { name: 'saucedemo-chromium', testDir: './tests/saucedemo', use: { ...devices['Desktop Chrome'], baseURL: 'https://www.saucedemo.com', storageState: 'tests/saucedemo/.auth/user.json' }, dependencies: ['saucedemo-setup'] },
    { name: 'saucedemo-firefox', testDir: './tests/saucedemo', use: { ...devices['Desktop Firefox'], baseURL: 'https://www.saucedemo.com' } },
    { name: 'saucedemo-webkit', testDir: './tests/saucedemo', use: { ...devices['Desktop Safari'], baseURL: 'https://www.saucedemo.com' } },

    // ai-plantz
    { name: 'ai-plantz-setup', testMatch: '**/ai-plantz/auth.setup.ts', use: { baseURL: process.env.AI_PLANTZ_URL ?? 'http://localhost:8081' } },
    { name: 'ai-plantz-chromium', testDir: './tests/ai-plantz', use: { ...devices['Desktop Chrome'], baseURL: process.env.AI_PLANTZ_URL ?? 'http://localhost:8081', storageState: 'tests/ai-plantz/.auth/user.json' }, dependencies: ['ai-plantz-setup'] },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
