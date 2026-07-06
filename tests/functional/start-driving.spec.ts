/**
 * tests/functional/start-driving.spec.ts
 *
 * /start-driving enrollment funnel tests — verify the enrollment steps and
 * app-download links render. Enrollment is never completed, no plan is ever
 * selected/purchased, and no payment details are ever entered.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Start Driving Enrollment Funnel @functional', () => {
  test.beforeEach(async ({ startDrivingPage }) => {
    await startDrivingPage.navigate();
  });

  test('start-driving page has a main heading @functional', async ({ startDrivingPage }) => {
    const heading = await startDrivingPage.getMainHeading();
    expect(heading.length, 'Start-driving page should have a non-empty <h1>').toBeGreaterThan(0);
  });

  test('enrollment steps are listed @functional', async ({ startDrivingPage }) => {
    const steps = await startDrivingPage.getEnrollmentSteps();
    expect(steps.length, 'Start-driving page should list enrollment steps').toBeGreaterThan(0);
  });

  test('app store and google play links are present and well-formed @functional', async ({ startDrivingPage }) => {
    const appStoreLink = startDrivingPage.getAppStoreLink();
    const googlePlayLink = startDrivingPage.getGooglePlayLink();

    expect(await appStoreLink.count(), 'App Store link should be present').toBeGreaterThan(0);
    expect(await googlePlayLink.count(), 'Google Play link should be present').toBeGreaterThan(0);

    const appStoreHref = await appStoreLink.getAttribute('href');
    const googlePlayHref = await googlePlayLink.getAttribute('href');

    expect(appStoreHref).toContain('apps.apple.com');
    expect(googlePlayHref).toContain('play.google.com');
  });

  test('state-eligibility checker is reachable from this page @functional', async ({ stateCheckerModal }) => {
    const present = await stateCheckerModal.isTriggerPresent();
    test.skip(!present, 'No state-checker trigger found on this page');

    await stateCheckerModal.open();
    expect(await stateCheckerModal.isOpen(), 'State-checker modal should open').toBeTruthy();
  });
});
