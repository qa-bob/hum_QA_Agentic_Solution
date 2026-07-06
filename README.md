# HUM — QA Agentic Solution

> Automated QA framework for [HUM](https://www.humrideshare.com), built with Playwright + TypeScript.

---

## What this repo is

This is a **Playwright + TypeScript regression test suite** that tests the live [HUM](https://www.humrideshare.com) marketing site end-to-end: smoke checks, navigation, form field validation, per-feature functional tests, cross-page regression checks, visual regression, and responsive layout — all **without creating an account, logging in, submitting any form, or joining the waitlist**.

It follows the **Page Object Model (POM)** pattern with object-oriented conventions (see `src/pages/`), is driven by a single `site.config.json`, and is structured so AI coding agents (Claude Code in particular) can extend it safely — see [`AGENTS.md`](AGENTS.md) and [`SKILLS.md`](SKILLS.md).

## Company Profile

| Field | Details |
|-------|---------|
| **Company** | HUM |
| **Description** | Private driving app for professional rideshare drivers — insured private rides, drivers set their own rate and keep 100% of fares |
| **Website** | https://www.humrideshare.com |
| **City** | Phoenix |
| **Founded** | 2020 |
| **Employees** | 1-10 |
| **Industry** | Rideshare / Transportation Technology (Insurtech for gig drivers) |
| **Leaders** | Chris Kolb (CEO/Co-Founder), Garrett Kolb (Founder) |

---

## Test Coverage

- [x] Smoke tests (`tests/smoke/`)
- [x] Navigation tests (`tests/navigation/`)
- [x] Form field tests, no submission (`tests/forms/`)
- [x] Functional tests per feature/page (`tests/functional/`)
- [x] Cross-page regression tests (`tests/regression/`)
- [x] Visual regression baselines (`tests/visual/`)
- [x] Responsive layout tests (`tests/responsive/`)

### Tech Stack

- [Playwright](https://playwright.dev/) — browser automation, three projects (desktop/mobile/tablet)
- TypeScript in strict mode
- Page Object Model + OOP (`BasePage` → per-page/component subclasses)

---

## Getting Started

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright's browser binaries
npx playwright install

# 3. Run the full suite
npm test

# Or run one category at a time
npm run test:smoke
npm run test:navigation
npm run test:forms
npm run test:functional
npm run test:regression
npm run test:visual
npm run test:responsive

# Interactive mode
npx playwright test --ui

# View the last HTML report
npm run report
```

`npm test` (and any `npm run test:*` variant) targets the URL in `site.config.json` by default. Override it per-run with `SITE_URL=https://staging.humrideshare.com npm test`, or copy `.env.example` to `.env` and set `SITE_URL` there.

### First-time visual baselines

Visual regression tests (`tests/visual/`) compare against stored screenshots in `__snapshots__/`. If you don't have baselines yet, capture them first:

```bash
npm run baseline
```

Review the captured screenshots before committing — see `/update-baseline` in [`SKILLS.md`](SKILLS.md).

---

## Project Structure

```
hum_QA_Agentic_Solution/
├── site.config.json          # Site URL, name, feature flags
├── playwright.config.ts      # desktop / mobile / tablet projects
├── global-setup.ts           # pre-run reachability check
├── src/
│   ├── pages/                 # Page Object Model classes (one per page/component)
│   ├── fixtures/site.fixture.ts   # test/expect + page-object fixtures
│   ├── utils/                 # link-checker, visual-helper, accordion
│   └── types/                 # site-config.types.ts
├── tests/
│   ├── smoke/          # @smoke
│   ├── navigation/     # @navigation
│   ├── forms/          # @forms
│   ├── functional/     # @functional
│   ├── regression/     # @regression
│   ├── visual/         # @visual
│   └── responsive/     # @responsive
├── AGENTS.md                  # tool-agnostic agent instructions (source of truth)
├── CLAUDE.md                  # imports AGENTS.md + Claude Code-specific wiring
├── SKILLS.md                  # index of commands/subagents/rules/hooks
└── .github/                    # Copilot instructions, contributor docs, CI-facing docs
```

---

## Contributing

Read [`AGENTS.md`](AGENTS.md) before making changes — it's the canonical rule set (architecture, tagging, what never to do) and applies regardless of which tool or editor you use. The short version:

- **Never submit a form, join a waitlist, or attempt to create/log into an account.** Tests only verify fields, validation, and content — see the state-checker and contact-form tests for the pattern.
- **Page objects contain no assertions.** Assertions belong in `tests/`.
- **Tag every test** with at least one of `@smoke @navigation @forms @functional @regression @visual @responsive`.
- **Never hardcode the site URL** — use `siteConfig.url` from the fixture.
- Run `npx tsc --noEmit` and `npm run lint` before opening a PR.

Full contributor workflow (branching, PR expectations, review checklist) is in [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md).

---

## Onboarding a different site

This framework is templated across multiple company repos from a shared source via `scripts/generate-repo.sh`. If you're re-pointing this repo at a different URL, or spinning up a new company repo from this one, see [`.github/docs/onboarding-new-site.md`](.github/docs/onboarding-new-site.md).

---

*Generated as part of the Phoenix Startup QA Agentic Solutions project.*
