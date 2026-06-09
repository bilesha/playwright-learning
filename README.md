# Playwright Test Suite

A multi-project end-to-end and API test suite built with [Playwright](https://playwright.dev/) and TypeScript. Covers UI automation, API testing, accessibility, visual regression, network interception, and more — organised into self-contained project groups, each with its own baseURL and auth state.

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
│   ├── jsonplaceholder/
│   │   ├── auth.setup.ts           # No-op setup (public API, no login)
│   │   ├── health.spec.ts          # Basic API health check
│   │   ├── api.spec.ts             # CRUD API tests (GET, POST, PUT, DELETE)
│   │   ├── api-advanced.spec.ts    # API chaining, custom contexts, schema validation
│   │   ├── posts.spec.ts           # Single resource API tests
│   │   └── .auth/                  # Stores auth state (gitignored)
│   ├── saucedemo/
│   │   ├── auth.setup.ts           # Logs in and saves session
│   │   ├── saucedemo.spec.ts       # Login, inventory, checkout flows
│   │   ├── saucedemo-advanced.spec.ts  # test.step, data-driven, sorting tests
│   │   ├── fixtures.spec.ts        # Custom fixture usage
│   │   ├── network.spec.ts         # Network interception / mocking
│   │   ├── polling.spec.ts         # expect.poll and expect.toPass
│   │   ├── visual.spec.ts          # Screenshot / visual regression
│   │   ├── mobile.spec.ts          # Mobile viewport tests (iPhone 13)
│   │   ├── downloads.spec.ts       # File download handling
│   │   ├── accessibility.spec.ts   # Axe-core accessibility scans
│   │   ├── iframes.spec.ts         # iframe interaction
│   │   ├── navigation.spec.ts      # Page navigation
│   │   ├── utils/
│   │   │   ├── LoginPage.ts        # Page Object — login
│   │   │   ├── InventoryPage.ts    # Page Object — product inventory, sorting
│   │   │   ├── CartPage.ts         # Page Object — shopping cart
│   │   │   ├── CheckoutPage.ts     # Page Object — checkout flow
│   │   │   └── fixtures.ts         # loggedInPage custom fixture
│   │   └── .auth/                  # Stores auth state (gitignored)
│   ├── ai-plantz/
│   │   ├── auth.setup.ts           # Logs in via /screens/auth
│   │   ├── search.spec.ts          # Plant search and homepage tests
│   │   └── .auth/                  # Stores auth state (gitignored)
│   └── examples/
│       └── example.spec.ts         # Reference examples (not run automatically)
├── utils/
│   └── SummaryReporter.ts          # Custom reporter — pass/fail summary
├── playwright.config.ts            # Playwright configuration
└── .github/
    └── workflows/
        └── playwright.yml          # CI pipeline (GitHub Actions)
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
SAUCE_URL=https://www.saucedemo.com
SAUCE_USERNAME=standard_user
SAUCE_PASSWORD=secret_sauce

AI_PLANTZ_URL=
AI_PLANTZ_EMAIL=
AI_PLANTZ_PASSWORD=
```

`SAUCE_*` credentials are for [saucedemo.com](https://www.saucedemo.com), a public demo site built for test automation practice. `AI_PLANTZ_*` are only needed when running the `ai-plantz` project.

---

## Running Tests

```bash
# Run all tests (all projects, all browsers)
npx playwright test

# Run a single project
npx playwright test --project=jsonplaceholder-chromium
npx playwright test --project=saucedemo-chromium
npx playwright test --project=ai-plantz-chromium

# Run a single file
npx playwright test tests/jsonplaceholder/health.spec.ts

# Run tests matching a name pattern
npx playwright test --grep "checkout"

# Run in headed mode (watch the browser)
npx playwright test --headed

# Run in headless mode
npx playwright test --headless

# Open interactive UI mode
npx playwright test --ui

# Debug a specific test
npx playwright test --debug tests/saucedemo/saucedemo.spec.ts

# Open the HTML report from the last run
npx playwright show-report

# Generate test code via browser recording
npx playwright codegen
```

---

## Key Concepts Demonstrated

### Multi-Project Structure
Each suite is self-contained with its own `testDir`, `baseURL`, and auth state. Adding a new app means adding a new project group in `playwright.config.ts` — existing suites are unaffected.

### Page Object Model (POM)
Page classes live in `tests/saucedemo/utils/`, co-located with the suite that owns them. Tests read like plain English; page interactions are defined once and reused everywhere.

### Auth State
Each suite has an `auth.setup.ts` that runs before the browser projects. It logs in once, saves the browser session to `<suite>/.auth/user.json`, and the dependent projects reuse that state — no repeated logins.

### Custom Fixtures
`tests/saucedemo/utils/fixtures.ts` extends Playwright's base `test` with a `loggedInPage` fixture that injects an already-authenticated page into any test that needs it.

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
| `baseURL` | Per-project | Each suite sets its own; no global baseURL |
| `headless` | `false` locally, `true` in CI | Controlled via `process.env.CI` |
| `retries` | 0 locally, 2 in CI | Reduces false failures in CI |
| `trace` | `on-first-retry` | Trace files recorded on retry for debugging |
| `reporter` | HTML + SummaryReporter | Two reporters run in parallel |
| `fullyParallel` | `true` | All tests run in parallel by default |
