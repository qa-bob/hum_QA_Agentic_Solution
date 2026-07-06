# Architecture

## Page Object Model + OOP

```
BasePage (src/pages/base.page.ts)
 ├── HomePage              — hero, CTAs, main heading, load verification
 ├── NavigationPage        — nav discovery, link reachability, mobile menu
 ├── ContactFormPage       — form discovery/inspection, never submits
 ├── FaqPage               — /faq categorized accordion
 ├── DriverPage            — /driver value prop + embedded FAQ
 ├── RiderPage             — /rider value prop + embedded FAQ + primary CTA
 ├── StartDrivingPage      — enrollment funnel steps, app download links
 ├── StatesPage            — live-state list
 ├── StateCheckerModal     — the #geo-modal state-eligibility widget (a
 │                            reusable component, not a full page — it's
 │                            embedded on home/driver/rider/start-driving/states)
 └── ContentPage(path)     — parametrized for informational pages that
                              share one shape: About, Insurance, Ride
                              Assurance, How It Works
```

Every class:
- Takes `(page, config)` in its constructor (component objects like `ContentPage` take an extra `path`).
- Exposes `readonly Locator` fields or locator-returning methods for elements, never raw `page.locator()` calls in test files.
- Exposes action methods (`navigate`, `expand`, `selectState`, `fillForm`) — no `expect()` inside them.

`src/fixtures/site.fixture.ts` wires page objects into Playwright's fixture system so tests do:

```ts
import { test, expect } from '@fixtures/site.fixture';

test('...', async ({ driverPage, stateCheckerModal }) => {
  await driverPage.navigate();
  await stateCheckerModal.open();
});
```

`ContentPage` is a factory fixture (`contentPage('/about')`) since it needs a path parameter that varies per test, unlike the fixed-identity page objects.

## Why some pages share one class

About, Insurance, Ride Assurance, and How It Works are identical in shape — a hero heading, a handful of `<h2>` sections, no unique interactive element. Giving each its own near-duplicate class would violate the project's anti-duplication stance for no benefit; `ContentPage` covers all four generically. Pages with a genuinely distinct interaction model (FAQ accordions, the state checker, the enrollment funnel) get their own class.

## `site.config.json` fields

| Field | Meaning |
|---|---|
| `url` | Base URL under test — every page object resolves paths against this |
| `hasContactForm` / `skipForms` | Gates `tests/forms/` |
| `skipVisual` | Gates `tests/visual/` |
| `expectedNavItems` | Documented set of primary nav labels (informational; `tests/navigation` discovers nav dynamically rather than asserting against this list) |
| `auth` | If `required: true`, tests may authenticate with the supplied credentials — otherwise auth-gated content is out of scope |

## Known site-specific quirks (as of the last site-analyzer pass)

- The site is client-rendered — a raw HTML fetch returns an near-empty shell. Anything that inspects the DOM must wait for render (Playwright's `domcontentloaded`/`networkidle`, not a static HTTP fetch).
- FAQ accordions use native `<details>/<summary>` (class `faq-item`), not ARIA `aria-expanded` buttons — see `src/utils/accordion.ts`.
- The state-eligibility widget (`#geo-modal`) is present in the DOM on every page that has the trigger button, just hidden until opened — queries scoped to `document` (not the modal container) will also match its boilerplate headings/buttons even when it's closed.
