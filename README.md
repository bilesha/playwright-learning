# Playwright Test Suite

A comprehensive end-to-end and API test suite built with [Playwright](https://playwright.dev/) and TypeScript. Covers UI automation, API testing, accessibility, visual regression, component testing, and more.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Playwright | 1.52.0 | Test framework and browser automation |
| TypeScript | strict mode | Language |
| axe-core | 4.11.x | Accessibility testing |
| dotenv | 17.x | Environment variable management |
| React | 19.x | Component testing target |

---

## Project Structure

```
├── tests/
│   ├── auth.setup.ts           # Saves login session to auth.json before tests run
│   ├── health.spec.ts          # Basic API health check
│   ├── api.spec.ts             # CRUD API tests (GET, POST, PUT, DELETE)
│   ├── api-advanced.spec.ts    # API chaining, custom contexts, schema validation
│   ├── api/
│   │   └── posts.spec.ts       # Single resource API tests
│   └── ui/
│       ├── saucedemo.spec.ts         # Login, inventory, checkout flows
│       ├── saucedemo-advanced.spec.ts # test.step, data-driven, sorting tests
│       ├── fixtures.spec.ts          # Custom fixture usage
│       ├── network.spec.ts           # Network interception / mocking
│       ├── polling.spec.ts           # expect.poll and expect.toPass
│       ├── visual.spec.ts            # Screenshot / visual regression
│       ├── mobile.spec.ts            # Mobile viewport tests (iPhone 13)
│       ├── downloads.spec.ts         # File download handling
│       ├── accessibility.spec.ts     # Axe-core accessibility scans
│       ├── iframes.spec.ts           # iframe interaction
│       └── navigation.spec.ts        # Page navigation
├── utils/
│   ├── fixtures.ts             # Custom Playwright fixtures (loggedInPage)
│   ├── LoginPage.ts            # Page Object — SauceDemo login
│   ├── InventoryPage.ts        # Page Object — product inventory, sorting
│   ├── CartPage.ts             # Page Object — shopping cart
│   ├── CheckoutPage.ts         # Page Object — checkout flow
│   └── SummaryReporter.ts      # Custom reporter — pass/fail summary
├── playwright.config.ts        # Playwright configuration
└── .github/
    └── workflows/
        └── playwright.yml      # CI pipeline (GitHub Actions)
```

---

## Setup

### Prerequisites

- Node.js LTS
- npm

### Install dependencies

```bash
npm ci
npx playwright install --with-deps
```

### Environment variables

Create a `.env` file in the project root:

```env
SAUCE_USERNAME=standard_user
SAUCE_PASSWORD=secret_sauce
```

These credentials are for [saucedemo.com](https://www.saucedemo.com), a public demo site built for test automation practice.

---

## Running Tests

```bash
# Run all tests (all browsers)
npx playwright test

# Run a single file
npx playwright test tests/health.spec.ts

# Run tests matching a name pattern
npx playwright test --grep "checkout"

# Run a single browser only
npx playwright test --project=chromium

# Run in headed mode (watch the browser)
npx playwright test --headed

# Run in headless mode
npx playwright test --headless

# Open interactive UI mode
npx playwright test --ui

# Debug a specific test
npx playwright test --debug tests/ui/saucedemo.spec.ts

# Open the HTML report from the last run
npx playwright show-report

# Generate test code via browser recording
npx playwright codegen
```

---

## Key Concepts Demonstrated

### Page Object Model (POM)
Test logic is separated into reusable page classes in `utils/`. Tests read like plain English and page interactions are defined once, reused everywhere.

### Auth State
`auth.setup.ts` logs in once and saves the browser session to `auth.json`. The Chromium project reuses this state so tests skip the login step entirely — faster and less flaky.

### Custom Fixtures
`utils/fixtures.ts` extends Playwright's base `test` with a `loggedInPage` fixture that injects an already-authenticated page into any test that needs it.

### Network Interception
`page.route()` intercepts HTTP requests and returns mocked responses. Used to test UI behaviour without depending on a real backend.

### Custom Reporter
`utils/SummaryReporter.ts` implements Playwright's `Reporter` interface and prints a clean pass/fail summary to the console after every run. Runs alongside the HTML reporter.

### Data-Driven Tests
`saucedemo-advanced.spec.ts` uses `for...of` loops to run the same test logic across multiple inputs — login scenarios, sort orders — without duplicating test code.

---

## CI / CD

Tests run automatically on GitHub Actions on every push and pull request to `main`/`master`, and on a weekly schedule (Saturdays at 2am UTC).

The pipeline:
1. Installs Node.js LTS
2. Installs dependencies (`npm ci`)
3. Installs Chromium with system dependencies
4. Runs the full suite against Chromium (snapshots skipped in CI)
5. Uploads the HTML report as an artifact (30-day retention)

Credentials are stored as GitHub repository secrets (`SAUCE_USERNAME`, `SAUCE_PASSWORD`, `SAUCE_URL`).

---

## Configuration

`playwright.config.ts` highlights:

| Setting | Value | Notes |
|---------|-------|-------|
| `baseURL` | `https://jsonplaceholder.typicode.com` | Used by API tests |
| `headless` | `false` locally, `true` in CI | Controlled via `process.env.CI` |
| `retries` | 0 locally, 2 in CI | Reduces false failures in CI |
| `trace` | `on-first-retry` | Trace files recorded on retry for debugging |
| `reporter` | HTML + SummaryReporter | Two reporters run in parallel |
| `fullyParallel` | `true` | All tests run in parallel by default |
