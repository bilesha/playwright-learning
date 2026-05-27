import { Page, Locator } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto(process.env.SAUCE_URL ?? 'https://www.saucedemo.com');
  }

  async login(username: string, password: string) {
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  errorMessage(): Locator {
    return this.page.locator('[data-test="error"]');
  }
}