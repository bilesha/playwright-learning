import { test, expect } from '@playwright/test';

test.describe('network interception', () => {
  test('returns mocked post data', async ({ page }) => {
    await page.route('**/posts/1', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 1, title: 'Mocked title' }),
      });
    });

    await page.setContent(`
      <div id="title">Loading...</div>
      <script>
        fetch('https://jsonplaceholder.typicode.com/posts/1')
          .then(r => r.json())
          .then(data => { document.getElementById('title').textContent = data.title; });
      </script>
    `);

    await expect(page.locator('#title')).toHaveText('Mocked title');
  });
  test('handles a failed API response', async ({ page }) => {
    await page.route('**/posts/1', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' }),
      });
    });

    await page.setContent(`
      <div id="title">Loading...</div>
      <script>
        fetch('https://jsonplaceholder.typicode.com/posts/1')
          .then(r => {
            if (!r.ok) {
              document.getElementById('title').textContent = 'Something went wrong';
            } else {
              return r.json().then(data => {
                document.getElementById('title').textContent = data.title;
              });
            }
          });
      </script>
    `);

    await expect(page.locator('#title')).toHaveText('Something went wrong');
  });
  test('handles an aborted request', async ({ page }) => {
    await page.route('**/posts/1', route => {
      route.abort();
    });

    await page.setContent(`
      <div id="title">Loading...</div>
      <script>
        fetch('https://jsonplaceholder.typicode.com/posts/1')
          .then(r => r.json())
          .then(data => {
            document.getElementById('title').textContent = data.title;
          })
          .catch(() => {
            document.getElementById('title').textContent = 'No connection';
          });
      </script>
    `);

    await expect(page.locator('#title')).toHaveText('No connection');
  });
  test('modifies a request before it goes out', async ({ page }) => {
    await page.route('**/posts/1', route => {
      route.continue({ url: 'https://jsonplaceholder.typicode.com/posts/2' });
    });

    await page.setContent(`
      <div id="postId">Loading...</div>
      <script>
        fetch('https://jsonplaceholder.typicode.com/posts/1')
          .then(r => r.json())
          .then(data => {
            document.getElementById('postId').textContent = String(data.id);
          });
      </script>
    `);

    await expect(page.locator('#postId')).toHaveText('2');
  });
});