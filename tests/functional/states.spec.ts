/**
 * tests/functional/states.spec.ts
 *
 * /states availability page tests — verify the list of live states renders.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

const EXPECTED_STATES = ['Arizona', 'California', 'Idaho', 'Florida', 'Tennessee', 'Georgia'];

test.describe('States Availability Page @functional', () => {
  test.beforeEach(async ({ statesPage }) => {
    await statesPage.navigate();
  });

  test('states page has a main heading @functional', async ({ statesPage }) => {
    const heading = await statesPage.getMainHeading();
    expect(heading.length, 'States page should have a non-empty <h1>').toBeGreaterThan(0);
  });

  test('states page lists the currently live states @functional', async ({ statesPage, siteConfig }) => {
    const listed = await statesPage.getListedStates();
    expect(listed.length, 'States page should list at least one state').toBeGreaterThan(0);

    const missing = EXPECTED_STATES.filter((state) => !listed.includes(state));
    if (missing.length > 0) {
      console.warn(
        `[functional] "${siteConfig.name}" /states page no longer lists: ${missing.join(', ')}. ` +
          'Confirm whether HUM has changed its live-state footprint.'
      );
    }
  });
});
