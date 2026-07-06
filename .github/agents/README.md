# Agents

This repo's subagents are defined for [Claude Code](https://code.claude.com/docs/en/sub-agents) at [`.claude/agents/`](../../.claude/agents/) — that's the source of truth. This file is a plain-language pointer for anyone browsing the repo without Claude Code.

## site-analyzer

Crawls a live website (rendering JS, not just fetching raw HTML — this site is client-rendered) and produces a fully-populated `site.config.json`: URL, description, industry, nav items, contact-form presence, auth-gating.

Use it when:
- Onboarding a new company repo from this framework
- `site.config.json` still has empty placeholder fields
- The live site has been redesigned and the config may be stale

Definition: [`.claude/agents/site-analyzer.md`](../../.claude/agents/site-analyzer.md)

## test-generator

Reads a populated `site.config.json` and generates additional Playwright test files in `tests/custom/` for functionality the shared suites (`tests/smoke`, `tests/navigation`, `tests/forms`, `tests/functional`, `tests/regression`, `tests/visual`, `tests/responsive`) don't cover.

Use it when:
- A page has unique interactive functionality worth its own coverage
- You need a regression test for a specific previously-found bug

Definition: [`.claude/agents/test-generator.md`](../../.claude/agents/test-generator.md)

## Using these without Claude Code

Both files are plain Markdown with a description of role, inputs, and step-by-step instructions — read them directly and follow the same steps manually, or paste them as a system prompt into another tool.
