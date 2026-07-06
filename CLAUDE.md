@AGENTS.md

## Claude Code specifics

The instructions above (`AGENTS.md`) are the tool-agnostic source of truth for this repo — read them first. Everything below is Claude-Code-only wiring: what's already configured, and how the pieces fit together. See `SKILLS.md` for a human-readable index of the same information.

### Subagents (`.claude/agents/`)

| Subagent | Use when |
|----------|----------|
| `site-analyzer` | `site.config.json` has empty/stale fields, or the site was redesigned |
| `test-generator` | A page/flow needs coverage beyond the shared suites; output lands in `tests/custom/` |

### Skills / slash commands (`.claude/commands/`)

| Command | Purpose |
|---------|---------|
| `/analyze-site` | Inspect the live site and produce a fully-populated `site.config.json` |
| `/generate-full-suite` | Analyze the configured site and generate the complete POM + test suite |
| `/run-smoke` | Run `@smoke` tests and report results |
| `/update-baseline` | Refresh visual regression baselines |
| `/generate-report` | Summarize the last Playwright run's pass/fail results |

These are plain `.claude/commands/*.md` files — functionally identical to `.claude/skills/*/SKILL.md`, just without a dedicated directory per command. No need to migrate them; both formats work.

### Rules (`.claude/rules/`)

Path-scoped instructions that load only when Claude touches matching files, instead of bloating every session:

- `pom-architecture.md` — loads when editing `src/pages/**` or `src/fixtures/**`
- `testing-conventions.md` — loads when editing `tests/**`

### Settings (`.claude/settings.json`)

Team-shared permission allowlist for common `npm`/`playwright`/`git` read commands, a deny rule for `.env*`/`secrets/**`, and a `PreToolUse` hook that runs `.claude/hooks/pre-test.sh` (a reachability check) before any `npm test*` command.

### Multi-repo context

This repo is one of many company repos stamped from a shared framework via `scripts/generate-repo.sh` (see `.github/docs/onboarding-new-site.md`). `site.config.json`, `README.md`, and this file's HUM-specific content are per-repo; everything else traces back to the shared framework source.
