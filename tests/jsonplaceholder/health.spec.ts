import { test, expect } from '@playwright/test';

test('GET /posts returns 200', async ({ request }) => {
  const response = await request.get('/posts');

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);
});