# Skills, Commands, and Agents in This Repo

This repo is set up for [Claude Code](https://code.claude.com/docs/), and this file is a human-readable index of the automation it ships with. If you're a contributor who doesn't use Claude Code day-to-day, this explains what each piece does and where to find it; if you do use Claude Code, the same information is wired into your session automatically.

## Terminology (Claude Code specifics)

| Term | What it is | Lives in |
|------|------------|----------|
| **Skill / slash command** | A reusable, invokable procedure (`/name`) — either you or Claude can trigger it | `.claude/commands/*.md` |
| **Subagent** | A specialized assistant with its own system prompt, tools, and (optionally) model, delegated to for a specific kind of task | `.claude/agents/*.md` |
| **Rule** | Standing instructions loaded automatically, optionally scoped to files matching a glob | `.claude/rules/*.md` |
| **Hook** | A shell command that fires on a lifecycle event (e.g. before a `Bash` tool call) | registered in `.claude/settings.json`, scripts in `.claude/hooks/` |

Skills and commands are the same underlying mechanism — `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both create `/deploy`. This repo uses the flat `.claude/commands/` form since none of the current commands need bundled supporting files.

## Available slash commands

| Command | What it does |
|---------|--------------|
| `/analyze-site` | Crawls the live site (from `site.config.json`) and produces a fully-populated config: nav items, forms, contact info, industry, redirect/auth detection. |
| `/generate-full-suite` | Analyzes the configured site end-to-end and generates the full POM (`src/pages/`) + test suite (`tests/`) from scratch. |
| `/run-smoke` | Runs the `@smoke` suite and prints a pass/fail table with suggested fixes for common failure patterns. |
| `/update-baseline` | Re-captures visual regression baselines after an intentional design change, and reminds you to review the diffs before committing. |
| `/generate-report` | Parses the last Playwright run's `test-results/results.json` into a readable summary, grouped by tag. |

Run any of these by typing the command in a Claude Code session, e.g. `/run-smoke`.

## Available subagents

| Subagent | Role |
|----------|------|
| `site-analyzer` | Crawls a live website and produces a fully-populated `site.config.json`. Used for onboarding a new company repo, or re-verifying config after a redesign. |
| `test-generator` | Reads `site.config.json` and generates additional site-specific Playwright tests in `tests/custom/`, for functionality the shared suites don't cover. |

Claude delegates to these automatically when a task matches their description, or you can ask for them by name ("use the site-analyzer subagent to refresh site.config.json").

## Rules

- `.claude/rules/pom-architecture.md` — Page Object Model conventions (loads only when editing `src/pages/**` or `src/fixtures/**`)
- `.claude/rules/testing-conventions.md` — test tagging, form-submission ban, wait strategy (loads only when editing `tests/**`)

The always-on project instructions live in [`AGENTS.md`](AGENTS.md) (imported by `CLAUDE.md`).

## Hooks

`.claude/hooks/pre-test.sh` checks the target site's reachability and is registered in `.claude/settings.json` as a `PreToolUse` hook that fires before any `npm test*` Bash command, so Claude gets an early warning if the site is down before spending time on a full run.

## For non-Claude-Code tools

GitHub Copilot, Cursor, and similar tools read `.github/copilot-instructions.md` and `.github/instructions/*.instructions.md` instead — see [`.github/skills/README.md`](.github/skills/README.md) and [`.github/agents/README.md`](.github/agents/README.md) for the equivalent human-readable pointers.
