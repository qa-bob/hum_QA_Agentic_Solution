/**
 * tests/functional/driver-page.spec.ts
 *
 * /driver landing page tests — value proposition content, embedded FAQ,
 * and the state-eligibility checker widget. State selection only exercises
 * the client-side result panel; the embedded third-party waitlist form is
 * never submitted.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Driver Landing Page @functional', () => {
  test.beforeEach(async ({ driverPage }) => {
    await driverPage.navigate();
  });

  test('driver page has a main heading @functional', async ({ driverPage }) => {
    const heading = await driverPage.getMainHeading();
    expect(heading.length, 'Driver page should have a non-empty <h1>').toBeGreaterThan(0);
  });

  test('driver page has multiple value-proposition sections @functional', async ({ driverPage }) => {
    const headings = await driverPage.getSectionHeadings();
    expect(headings.length, 'Driver page should have multiple <h2> sections').toBeGreaterThan(2);
  });

  test('driver page has an embedded FAQ @functional', async ({ driverPage }) => {
    const count = await driverPage.getFaqCount();
    expect(count, 'Driver page should embed at least one FAQ item').toBeGreaterThan(0);
  });

  test('state-eligibility checker opens and lists all US states @functional', async ({ stateCheckerModal }) => {
    const present = await stateCheckerModal.isTriggerPresent();
    test.skip(!present, 'No state-checker trigger found on this page');

    await stateCheckerModal.open();
    expect(await stateCheckerModal.isOpen(), 'State-checker modal should open').toBeTruthy();

    const options = await stateCheckerModal.getStateOptionLabels();
    expect(options.length, 'State selector should list all US states plus a placeholder').toBeGreaterThan(50);
  });

  test('selecting an in-market state shows the "you\'re in" result @functional', async ({ stateCheckerModal }) => {
    const present = await stateCheckerModal.isTriggerPresent();
    test.skip(!present, 'No state-checker trigger found on this page');

    await stateCheckerModal.open();
    const isAvailable = await stateCheckerModal.isStateAvailable('Arizona');
    test.skip(!isAvailable, 'Arizona is no longer marked available — pick another state for this assertion');

    await stateCheckerModal.selectState('Arizona');
    await expect
      .poll(() => stateCheckerModal.isInMarketResultShown(), { timeout: 5_000 })
      .toBeTruthy();
  });

  test('selecting an out-of-market state shows the waitlist prompt (never submitted) @functional', async ({ stateCheckerModal }) => {
    const present = await stateCheckerModal.isTriggerPresent();
    test.skip(!present, 'No state-checker trigger found on this page');

    await stateCheckerModal.open();
    const isAvailable = await stateCheckerModal.isStateAvailable('Texas');
    test.skip(isAvailable, 'Texas is now marked available — pick another out-of-market state for this assertion');

    await stateCheckerModal.selectState('Texas');
    await expect
      .poll(() => stateCheckerModal.isOutOfMarketResultShown(), { timeout: 5_000 })
      .toBeTruthy();

    // Intentionally stop here — the out-of-market panel embeds a third-party
    // waitlist form (GoHighLevel iframe) that must never be filled or submitted.
  });
});
