---
paths:
  - "tests/**/*.ts"
---

# Test conventions

- Import `test`/`expect` from `@fixtures/site.fixture`, never directly from `@playwright/test`.
- Tag every test with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@regression`, `@visual`, `@responsive`.
- Never hardcode the site URL — use `siteConfig.url` (from the fixture) or Playwright's `baseURL`.
- Never submit a form, create an account, or log in (unless `siteConfig.auth.required` is true and credentials are supplied).
- Never use `page.waitForTimeout()` for synchronization — use `waitForSelector`, `waitForLoadState`, or Playwright's auto-waiting. A short, fixed `waitForTimeout` is only acceptable to let a CSS transition/animation settle before a screenshot.
- One `describe` block per page or feature area; keep tests independent (no shared mutable state between tests).
- Prefer soft warnings (`console.warn`) over hard failures for best-practice-but-not-broken issues (e.g. missing meta description) — reserve `expect()` failures for things that are actually broken.
- `tests/functional/` covers one feature/page in isolation; `tests/regression/` covers cross-page journeys and site-wide invariants (link integrity, legal-page reachability) that only make sense checked end-to-end.
