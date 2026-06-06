import { test, expect } from '@playwright/test';

test('GET /posts/1 returns a single post', async ({ request }) => {
  const response = await request.get('/posts/1');

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body).toHaveProperty('title');
});
