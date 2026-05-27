import { test, expect } from '@playwright/test';

test.describe('posts API', () => {
  test('GET fetches a single post', async ({ request }) => {
    const response = await request.get('/posts/1');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(1);
  });

  test('POST creates a new post', async ({ request }) => {
    const response = await request.post('/posts', {
      data: {
        title: 'My new post',
        body: 'Some content',
        userId: 1,
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.title).toBe('My new post');
    expect(body.id).toBeDefined();
  });

  test('PUT updates an existing post', async ({ request }) => {
    const response = await request.put('/posts/1', {
      data: {
        id: 1,
        title: 'Updated title',
        body: 'Updated content',
        userId: 1,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.title).toBe('Updated title');
  });

  test('DELETE removes a post', async ({ request }) => {
    const response = await request.delete('/posts/1');

    expect(response.status()).toBe(200);
  });
});