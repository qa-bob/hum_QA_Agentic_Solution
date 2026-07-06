/**
 * tests/functional/rider-page.spec.ts
 *
 * /rider landing page tests — value proposition content, primary CTA, and
 * embedded FAQ.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Rider Landing Page @functional', () => {
  test.beforeEach(async ({ riderPage }) => {
    await riderPage.navigate();
  });

  test('rider page has a main heading @functional', async ({ riderPage }) => {
    const heading = await riderPage.getMainHeading();
    expect(heading.length, 'Rider page should have a non-empty <h1>').toBeGreaterThan(0);
  });

  test('rider page has multiple value-proposition sections @functional', async ({ riderPage }) => {
    const headings = await riderPage.getSectionHeadings();
    expect(headings.length, 'Rider page should have multiple <h2> sections').toBeGreaterThan(2);
  });

  test('rider page has a primary CTA @functional', async ({ riderPage }) => {
    const cta = riderPage.getPrimaryCta();
    await expect(cta, '"Find Your Driver" CTA should be visible').toBeVisible();
  });

  test('rider page has an embedded FAQ @functional', async ({ riderPage }) => {
    const count = await riderPage.getFaqCount();
    expect(count, 'Rider page should embed at least one FAQ item').toBeGreaterThan(0);
  });
});
