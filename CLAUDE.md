# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

No npm scripts are defined — run Playwright directly:

```bash
# Run all tests (all projects, all browsers)
npx playwright test

# Run a single project
npx playwright test --project=jsonplaceholder-chromium
npx playwright test --project=saucedemo-chromium
npx playwright test --project=ai-plantz-chromium

# Run a single test file
npx playwright test tests/jsonplaceholder/health.spec.ts

# Run tests matching a name pattern
npx playwright test --grep "checkout"

# Run in headed mode (override config default)
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

## Architecture

**Tech stack:** Playwright Test (1.52.0) + TypeScript (strict mode). No additional test utilities, linting, or formatting tools are configured.

**Config (`playwright.config.ts`):**
- Multi-project structure — each suite (`jsonplaceholder`, `saucedemo`, `ai-plantz`) has its own `testDir` and `baseURL`; there is no global `baseURL`
- Each suite has a `-setup` project that runs `auth.setup.ts` and saves browser state to `<suite>/.auth/user.json` before the browser projects run
- Runs **non-headless** by default locally; headed/headless can be overridden per run
- CI behaviour is gated on `process.env.CI`: 2 retries, 1 worker, `forbidOnly` enabled
- Trace files are collected on first retry only; the HTML report is written to `playwright-report/`

**Project groups:**

| Group | Setup project | Browser projects | baseURL |
|---|---|---|---|
| jsonplaceholder | `jsonplaceholder-setup` | `jsonplaceholder-chromium/firefox/webkit` | `https://jsonplaceholder.typicode.com` |
| saucedemo | `saucedemo-setup` | `saucedemo-chromium/firefox/webkit` | `https://www.saucedemo.com` |
| ai-plantz | `ai-plantz-setup` | `ai-plantz-chromium` | `AI_PLANTZ_URL` env var (default `http://localhost:8081`) |

**Directory layout:**
```
tests/
  jsonplaceholder/          # API tests against jsonplaceholder.typicode.com
    auth.setup.ts           # No-op setup (public API, no login needed)
    .auth/                  # Stores auth state (gitignored user.json)
  saucedemo/                # UI tests against saucedemo.com
    auth.setup.ts           # Logs in and saves session to .auth/user.json
    utils/                  # Page Objects co-located with the suite that owns them
      LoginPage.ts
      InventoryPage.ts
      CartPage.ts
      CheckoutPage.ts
      fixtures.ts           # loggedInPage custom fixture
    .auth/                  # Stores auth state (gitignored user.json)
  ai-plantz/                # Tests for the ai-plantz app
    auth.setup.ts           # Logs in via /screens/auth
    .auth/                  # Stores auth state (gitignored user.json)
  examples/                 # Reference examples — not wired into any project, not run in CI
utils/
  SummaryReporter.ts        # Custom reporter shared across all projects
types/                      # Shared TypeScript types (empty scaffolding)
```

**CI (`/.github/workflows/playwright.yml`):** Runs on push/PR to `main`/`master` and on a weekly schedule (Saturdays 2am UTC). Installs dependencies, installs Chromium, runs the full suite, and uploads the HTML report as an artifact (30-day retention).
