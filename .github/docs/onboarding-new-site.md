# Onboarding a New Site

This repo is one of many company repos stamped from a shared Playwright framework (`scripts/generate-repo.sh`, `scripts/generate-all-repos.sh`). This doc covers both re-pointing *this* repo at a different URL and stamping the framework into a brand-new repo.

## Re-pointing this repo at a different site

1. Edit `site.config.json` — at minimum `name` and `url`. Either hand-edit the rest, or run `/analyze-site` to re-crawl and repopulate `description`, `industry`, `expectedNavItems`, `hasContactForm`, etc.
2. Everything under `src/pages/`, `tests/functional/`, `tests/regression/` that references HUM-specific paths (`/driver`, `/faq`, the `#geo-modal` state checker, etc.) is specific to HUM's site structure. Run `/generate-full-suite` to regenerate page objects and tests for the new site's actual structure — don't assume HUM's page objects transfer as-is.
3. `tests/smoke/`, `tests/navigation/`, `tests/forms/`, `tests/visual/`, `tests/responsive/` are written generically against `site.config.json` and role/semantic selectors, so they typically work unmodified against a new site.
4. Delete or archive HUM-specific page objects/tests that no longer apply (`driver.page.ts`, `faq.page.ts`, `state-checker-modal.page.ts`, etc.) if the new site doesn't have equivalent features.
5. Run `npm run baseline` to capture fresh visual snapshots for the new site — the old ones won't match.

## Stamping the framework into a brand-new repo

From the shared framework source (not from this repo):

```bash
./scripts/generate-repo.sh <target-repo-path> "<Company Name>" "https://company-site.com"
```

This copies framework files (`src/`, `tests/`, config, `.claude/`), creates a starter `site.config.json` if one doesn't already exist, and runs `npm install` in the target. It never overwrites an existing `site.config.json`.

For batch onboarding many companies from a CSV (`company_name,site_url,repo_directory`):

```bash
./scripts/generate-all-repos.sh companies.csv /path/to/repos
```

See the scripts' own header comments for full argument details and failure/skip reporting.

## After stamping or re-pointing

1. `npm install && npx playwright install`
2. `/analyze-site` (or hand-edit `site.config.json`)
3. `/generate-full-suite` to build page objects + tests for the new site's actual structure
4. `npm run test:smoke` to confirm the basics pass
5. `npm run baseline` to capture initial visual snapshots
6. Update this repo's `README.md` company profile section and `AGENTS.md`'s project-purpose line if the new site's domain differs meaningfully from HUM's (e.g. not a two-sided marketplace, has a login-gated area, etc.)
