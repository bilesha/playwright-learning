import { test, expect } from '@playwright/test';

test('interacts with content inside an iframe', async ({ page }) => {
  await page.route('https://example.com/iframe', route => {
    route.fulfill({
      contentType: 'text/html',
      body: `
        <html><body>
          <input id="name" placeholder="Enter name" />
          <button id="submit">Submit</button>
          <div id="result"></div>
          <script>
            document.getElementById('submit').addEventListener('click', function() {
              document.getElementById('result').textContent = 'Hello ' + document.getElementById('name').value;
            });
          </script>
        </body></html>
      `,
    });
  });

  await page.setContent(`
    <iframe id="my-frame" src="https://example.com/iframe"></iframe>
  `);

  const frame = page.frameLocator('#my-frame');
  await frame.locator('#name').fill('Playwright');
  await frame.locator('#submit').click();
  await expect(frame.locator('#result')).toHaveText('Hello Playwright');
});
