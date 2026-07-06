# Copilot Instructions

This repo's canonical, tool-agnostic instructions live in [`/AGENTS.md`](../AGENTS.md) at the repo root — read that file in full before generating code here. The essentials, inlined in case your tool doesn't follow the link:

- This is a **Playwright + TypeScript** regression suite for the site in `site.config.json`, using the **Page Object Model** pattern.
- Page object classes (`src/pages/*.ts`) extend `BasePage`, expose typed `readonly Locator` properties and user-action methods, and **never contain `expect()` assertions**.
- Tests (`tests/**/*.spec.ts`) import `test`/`expect` from `src/fixtures/site.fixture.ts`, not directly from `@playwright/test`.
- Every test is tagged with at least one of `@smoke @navigation @forms @functional @regression @visual @responsive`.
- **Never generate code that submits a form, joins a waitlist, creates an account, or logs in** — this suite only verifies fields, validation, and rendered content.
- Never hardcode the site URL; use `siteConfig.url`.
- Never use a fixed `waitForTimeout()` for synchronization — use `waitForSelector`, `waitForLoadState`, or `expect.poll()`.
- TypeScript strict mode is on; avoid `any` without justification.

For path-scoped detail, see [`.github/instructions/`](instructions/) (mirrors `.claude/rules/`), and for contributor workflow see [`CONTRIBUTING.md`](CONTRIBUTING.md).
