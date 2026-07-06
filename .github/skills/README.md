# Skills / Commands

This repo's slash commands are defined for [Claude Code](https://code.claude.com/docs/en/skills) at [`.claude/commands/`](../../.claude/commands/) — that's the source of truth. This file is a plain-language pointer for anyone browsing the repo without Claude Code.

| Command | What it does |
|---------|--------------|
| [`/analyze-site`](../../.claude/commands/analyze-site.md) | Crawls the live site and produces a fully-populated `site.config.json` |
| [`/generate-full-suite`](../../.claude/commands/generate-full-suite.md) | Analyzes the configured site and generates the complete POM + test suite from scratch |
| [`/run-smoke`](../../.claude/commands/run-smoke.md) | Runs `@smoke` tests and prints a pass/fail summary with suggested fixes |
| [`/update-baseline`](../../.claude/commands/update-baseline.md) | Refreshes visual regression baselines after an intentional design change |
| [`/generate-report`](../../.claude/commands/generate-report.md) | Summarizes the last Playwright run's results by tag |

Each file is a plain Markdown procedure — readable and followable by hand, or by any AI tool capable of following multi-step instructions, not just Claude Code.

See [`SKILLS.md`](../../SKILLS.md) at the repo root for the fuller index, including subagents and path-scoped rules.
