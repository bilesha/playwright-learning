import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';

test('downloads a file and checks the filename', async ({ page }) => {
  await page.setContent(`
    <a id="download" href="data:text/plain,Hello world" download="hello.txt">Download</a>
  `);

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#download').click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('hello.txt');
});

test('downloads a file and checks the contents', async ({ page }) => {
  await page.setContent(`
    <a id="download" href="data:text/plain,Hello world" download="hello.txt">Download</a>
  `);

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#download').click();
  const download = await downloadPromise;

  const path = await download.path();
  const contents = readFileSync(path!, 'utf-8');
  expect(contents).toBe('Hello world');
});

