/**
 * tests/functional/content-pages.spec.ts
 *
 * Informational marketing page tests — About, Insurance, Ride Assurance,
 * and How It Works all share the same shape (hero heading + body sections),
 * so they're covered generically via the ContentPage page object instead
 * of one near-identical page class each.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

const CONTENT_PAGES = [
  { path: '/about', name: 'About' },
  { path: '/insurance', name: 'Insurance' },
  { path: '/ride-assurance', name: 'Ride Assurance' },
  { path: '/how-it-works', name: 'How It Works' },
];

test.describe('Informational Content Pages @functional', () => {
  for (const { path, name } of CONTENT_PAGES) {
    test(`${name} page (${path}) loads with a heading and body content @functional`, async ({ contentPage }) => {
      const page = contentPage(path);
      await page.navigate();

      const loaded = await page.isLoaded();
      expect(loaded, `${name} page should load with a heading and meaningful body text`).toBeTruthy();

      const sections = await page.getSectionHeadings();
      expect(sections.length, `${name} page should have at least one <h2> section`).toBeGreaterThan(0);
    });
  }
});
