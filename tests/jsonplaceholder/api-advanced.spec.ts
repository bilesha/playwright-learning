import { test, expect, request } from '@playwright/test';

// --- Pattern 1: newContext ---
// Creates a standalone API client with its own config, completely independent
// of the browser or the baseURL in playwright.config.ts
test.describe('standalone API context', () => {
  test('hits a different baseURL than the config', async () => {
    const apiContext = await request.newContext({
      baseURL: 'https://jsonplaceholder.typicode.com',
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'X-Custom-Header': 'playwright',
      },
    });

    const response = await apiContext.get('/users/1');
    expect(response.status()).toBe(200);

    const user = await response.json();
    expect(user).toMatchObject({
      id: 1,
      name: expect.any(String),
      email: expect.stringContaining('@'),
    });

    await apiContext.dispose();
  });
});

// --- Pattern 2: hybrid — API setup, then verify via API chain ---
// Create a resource via POST, then fetch it back with GET to confirm
// the server stored it correctly. No browser needed.
test.describe('hybrid API chaining', () => {
  test('fetches a user then loads their posts', async ({ request }) => {
    // Step 1 — get a user
    const userRes = await request.get('/users/1');
    expect(userRes.status()).toBe(200);
    const user = await userRes.json();

    // Step 2 — use data from step 1 to drive the next request
    const postsRes = await request.get(`/posts?userId=${user.id}`);
    expect(postsRes.status()).toBe(200);

    const posts = await postsRes.json();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((p: { userId: number }) => p.userId === user.id)).toBe(true);
  });

  test('validates full response schema with toMatchObject', async ({ request }) => {
    const response = await request.get('/posts/1');
    const post = await response.json();

    // toMatchObject checks shape — extra fields on the response are fine
    expect(post).toMatchObject({
      userId: expect.any(Number),
      id: expect.any(Number),
      title: expect.any(String),
      body: expect.any(String),
    });
  });
});
