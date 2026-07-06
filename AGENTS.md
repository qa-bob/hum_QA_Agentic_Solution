# HUM QA Agentic Solution — Agent Instructions

This repository is a **Playwright + TypeScript regression test suite** for the website defined in `site.config.json` (currently [HUM](https://www.humrideshare.com)). It follows a **Page Object Model (POM)** architecture with object-oriented conventions, and is structured for agentic execution by AI coding assistants (Claude Code, GitHub Copilot, Cursor, or a human contributor).

This file is the tool-agnostic source of truth. Claude Code loads it via the `@AGENTS.md` import in `CLAUDE.md`; other tools should read it directly.

---

## Project Purpose

Build and maintain a comprehensive GUI, functional, and regression test suite for one B2B/consumer web app. Tests must cover every discoverable feature of the site **without requiring account creation or actual form/waitlist submission**.

---

## Key Files

| File | Purpose |
|------|---------|
| `site.config.json` | Site URL, name, flags (`hasContactForm`, `skipVisual`, etc.) |
| `playwright.config.ts` | Playwright projects: desktop, mobile, tablet |
| `src/pages/` | Page Object Model classes, one per page/section/component |
| `src/fixtures/site.fixture.ts` | Custom Playwright fixtures exposing page objects |
| `src/utils/` | Helpers: link-checker, visual-helper, accordion |
| `src/types/` | TypeScript interfaces |
| `tests/smoke/` | `@smoke` — availability and basic load tests |
| `tests/navigation/` | `@navigation` — nav links, routing, menus |
| `tests/forms/` | `@forms` — form fields, validation (no submission) |
| `tests/functional/` | `@functional` — one feature/page verified in isolation |
| `tests/regression/` | `@regression` — cross-page journeys and site-wide invariants |
| `tests/visual/` | `@visual` — screenshot regression |
| `tests/responsive/` | `@responsive` — layout at mobile/tablet/desktop |
| `.claude/commands/` | Slash commands (skills) for agentic tasks |
| `.claude/agents/` | Custom subagents (site-analyzer, test-generator) |
| `.claude/rules/` | Path-scoped rules for POM architecture and test conventions |

---

## Architecture Rules

### Page Object Model
- Every page, major section, or reusable UI component (e.g. a modal) has its own class in `src/pages/`.
- Page classes extend `BasePage` from `./base.page`.
- Locators are `readonly Locator` properties on the class, or getter methods for locators that depend on runtime state.
- Methods represent user actions, not assertions.
- No `expect()` calls inside page objects — assertions belong in tests.
- Pages that share an identical structure (e.g. informational marketing pages) use one parametrized class (`ContentPage`) instead of one class per near-identical page.
- Full detail: `.claude/rules/pom-architecture.md`.

### Tests
- Import page objects via the custom fixture in `src/fixtures/site.fixture.ts`.
- Tag every test with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@regression`, `@visual`, `@responsive`.
- Do not hardcode URLs — always use `siteConfig.url` from the fixture.
- Never submit a form, join a waitlist, create an account, or log in (unless `siteConfig.auth.required` is true and credentials are supplied).
- Full detail: `.claude/rules/testing-conventions.md`.

### TypeScript
- Strict mode is enabled (`tsconfig.json`).
- All page object properties must be typed.
- Run `npx tsc --noEmit` to check for errors before finishing.

---

## Available npm Scripts

```bash
npm test                    # Run all tests (also runs the pre-test reachability check)
npm run test:smoke          # @smoke tests only
npm run test:navigation     # @navigation tests only
npm run test:forms          # @forms tests only
npm run test:functional     # @functional tests only
npm run test:regression     # @regression tests only
npm run test:visual         # @visual tests only
npm run test:responsive     # @responsive tests only
npm run baseline            # Update visual snapshots
npm run lint                # ESLint
npm run typecheck           # TypeScript check
```

---

## When Asked to Write or Update Tests

1. Read `site.config.json` first to get the URL and all flags.
2. Inspect the live site before writing any selectors — static HTML fetches won't show client-rendered content on this SPA-style site, so prefer rendering it (a headless Playwright page, or a fetch tool that executes JS) over a raw HTML fetch.
3. Write real selectors based on actual rendered HTML, not generic placeholders.
4. Create or update the relevant page object class in `src/pages/`.
5. Write tests that use the page object, not raw `page.locator()` calls in the test body.
6. Run `npx tsc --noEmit` to verify TypeScript compiles cleanly.

---

## Test Tagging Reference

| Tag | When to use |
|-----|-------------|
| `@smoke` | Site loads, title present, no console errors |
| `@navigation` | Nav links, routing, menus, breadcrumbs |
| `@forms` | Form fields, validation, accessibility |
| `@functional` | One feature/page in isolation: pricing, FAQ accordions, state checker, video |
| `@regression` | Cross-page journeys, footer/legal-page integrity, site-wide link checks |
| `@visual` | Screenshot regression with `toHaveScreenshot()` |
| `@responsive` | Viewport-specific layout checks |

---

## Do Not

- Submit any form or join any waitlist (including the embedded third-party widget in the state-checker modal).
- Create accounts, log in, or complete driver/rider enrollment (unless `auth.required: true` in config).
- Hardcode the base URL in tests.
- Put assertions inside page object methods.
- Use `page.waitForTimeout()` for synchronization — use `waitForSelector`, `waitForLoadState`, or `expect.poll()`. A short fixed wait is only acceptable to let a CSS animation settle before a screenshot.
- Use `any` type without explicit justification.
