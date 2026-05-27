# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

No npm scripts are defined — run Playwright directly:

```bash
# Run all tests (all browsers)
npx playwright test

# Run a single test file
npx playwright test tests/health.spec.ts

# Run tests matching a name pattern
npx playwright test --grep "API health"

# Run a single browser only
npx playwright test --project=chromium

# Run in headed mode (override config default)
npx playwright test --headed

# Run in headless mode
npx playwright test --headless

# Open interactive UI mode
npx playwright test --ui

# Debug a specific test
npx playwright test --debug tests/health.spec.ts

# Open the HTML report from the last run
npx playwright show-report

# Generate test code via browser recording
npx playwright codegen
```

## Architecture

**Tech stack:** Playwright Test (1.52.0) + TypeScript (strict mode). No additional test utilities, linting, or formatting tools are configured.

**Config (`playwright.config.ts`):**
- `baseURL` is `https://jsonplaceholder.typicode.com` — UI tests that target other origins must use full URLs
- Runs **non-headless** by default locally; headed/headless can be overridden per run
- CI behavior is gated on `process.env.CI`: 2 retries, 1 worker, `forbidOnly` enabled
- Trace files are collected on first retry only; the HTML report is written to `playwright-report/`
- All three browsers (Chromium, Firefox, WebKit) are enabled by default

**Directory layout:**
- `tests/` — active test suite; `tests/ui/` for browser-based tests, flat files for API/integration tests
- `tests-examples/` — reference TodoMVC suite showing advanced patterns (describe blocks, beforeEach, localStorage assertions, test.step); not run-tested in CI but useful as a pattern reference
- `api/`, `utils/`, `types/` — empty scaffolding directories intended for page objects/API wrappers, shared helpers, and custom TypeScript types respectively

**CI (`/.github/workflows/playwright.yml`):** Runs on push/PR to `main`/`master`. Installs dependencies, installs browsers, runs the full suite, and uploads the HTML report as an artifact (30-day retention).
