# Contributing

Thanks for helping maintain the HUM QA suite. This is a short, practical guide — the full rule set lives in [`AGENTS.md`](../AGENTS.md).

## Setup

```bash
npm install
npx playwright install
npm run typecheck
npm test
```

See the root [`README.md`](../README.md) for details and first-time visual baseline setup.

## Before opening a PR

1. `npx tsc --noEmit` — must be clean.
2. `npm run lint` — must be clean.
3. `npm test` (or the relevant `test:*` subset for your change) — must pass, or failures must be pre-existing and noted in your PR description.
4. If you touched `tests/visual/` or changed layout, run `npm run baseline` and **visually review** every changed screenshot before committing it — see `/update-baseline` in [`SKILLS.md`](../SKILLS.md).

## Hard rules

These are non-negotiable, not style preferences:

- **Never submit a form, join a waitlist, create an account, or log in** as part of a test, fixture, or one-off script — including manual testing against production. HUM's contact form and state-checker waitlist are real, monitored inboxes.
- **No assertions in page objects.** If you find yourself writing `expect()` in `src/pages/`, move it to the test.
- **No hardcoded URLs.** Use `siteConfig.url` (from the fixture) so the suite stays portable if this repo is re-pointed at a staging environment or a different site.
- **Tag every test.** CI and the `/generate-report` command both key off `@smoke @navigation @forms @functional @regression @visual @responsive`.

## Where things go

| Change type | File(s) |
|---|---|
| New page or reusable UI component | `src/pages/<name>.page.ts`, extends `BasePage` |
| New page object needs to be usable from tests | Add it to `src/fixtures/site.fixture.ts` |
| New site-wide helper (not page-specific) | `src/utils/` |
| Single-feature test | `tests/functional/` |
| Cross-page journey or site-wide invariant | `tests/regression/` |
| Site metadata changed (new nav item, new page) | Update `site.config.json` |

## Review checklist for reviewers

- [ ] No `expect()` in `src/pages/`
- [ ] No hardcoded URLs or credentials
- [ ] No form submission / account creation / login in test code
- [ ] Every new test has at least one tag
- [ ] Selectors are resilient (role/label/text-based) rather than brittle CSS class chains, where the live DOM allows it
- [ ] `npx tsc --noEmit` and `npm run lint` pass
