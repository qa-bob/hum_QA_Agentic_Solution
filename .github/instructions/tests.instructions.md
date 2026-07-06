---
applyTo: "tests/**/*.ts"
---

# Test conventions

Mirrors [`.claude/rules/testing-conventions.md`](../../.claude/rules/testing-conventions.md) for Copilot/other tools that read `.github/instructions/` instead.

- Import `test`/`expect` from `@fixtures/site.fixture`, never directly from `@playwright/test`.
- Tag every test with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@regression`, `@visual`, `@responsive`.
- Never hardcode the site URL — use `siteConfig.url` (from the fixture) or Playwright's `baseURL`.
- Never submit a form, join a waitlist, create an account, or log in (unless `siteConfig.auth.required` is true and credentials are supplied).
- Never use `page.waitForTimeout()` for synchronization — use `waitForSelector`, `waitForLoadState`, or `expect.poll()`. A short, fixed wait is only acceptable to let a CSS animation settle before a screenshot.
- One `describe` block per page or feature area; keep tests independent.
- Prefer `console.warn` over a hard `expect()` failure for best-practice-but-not-broken issues (e.g. missing meta description).
- `tests/functional/` covers one feature/page in isolation; `tests/regression/` covers cross-page journeys and site-wide invariants.
