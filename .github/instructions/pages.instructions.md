---
applyTo: "src/pages/**/*.ts,src/fixtures/**/*.ts"
---

# Page Object Model conventions

Mirrors [`.claude/rules/pom-architecture.md`](../../.claude/rules/pom-architecture.md) for Copilot/other tools that read `.github/instructions/` instead.

- Every page or distinct component (e.g. a modal) has its own class in `src/pages/`.
- Page classes extend `BasePage` from `./base.page`.
- Locators are `readonly Locator` properties assigned in the constructor.
- Methods represent user actions ("clickNavItem", "fillForm", "openModal"), not assertions.
- No `expect()` calls inside page objects — assertions belong in tests only.
- Prefer role-based and semantic selectors over CSS classes.
- For pages that share an identical structure, use one parametrized class (see `ContentPage`) rather than one class per near-identical page.
- New page objects must be exposed as fixtures in `src/fixtures/site.fixture.ts`.
