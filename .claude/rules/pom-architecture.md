---
paths:
  - "src/pages/**/*.ts"
  - "src/fixtures/**/*.ts"
---

# Page Object Model rules

- Every page or distinct component (e.g. a modal) has its own class in `src/pages/`.
- Page classes extend `BasePage` from `./base.page`.
- Locators are `readonly Locator` properties assigned in the constructor.
- Methods represent user actions ("clickNavItem", "fillForm", "openModal"), not assertions.
- No `expect()` calls inside page objects — assertions belong in tests only.
- Prefer role-based and semantic selectors (`getByRole`, `[aria-label]`, landmark tags) over CSS classes, since marketing sites restyle often but semantics are more stable.
- For pages that share an identical structure (e.g. informational marketing pages with just a heading and body copy), use one parametrized class rather than one class per near-identical page — see `ContentPage`.
- New page objects must be exposed as fixtures in `src/fixtures/site.fixture.ts` so tests import `{ test, expect }` from the fixture rather than constructing page objects ad hoc.
