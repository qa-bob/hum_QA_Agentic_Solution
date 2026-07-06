/**
 * tests/functional/app-download-links.spec.ts
 *
 * App Store / Google Play download links — verified site-wide since they
 * appear in the header, footer, and multiple CTAs. Only the href targets
 * are checked; the external app store pages are never visited.
 *
 * HUM ships two separate apps: the pages under /driver and /start-driving
 * (plus the homepage) link to the Driver app, while /rider links to a
 * distinct Rider app with its own store listing.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

const PAGES_WITH_DOWNLOAD_LINKS = [
  { path: '/', googlePlayId: 'production.hum.driver' },
  { path: '/driver', googlePlayId: 'production.hum.driver' },
  { path: '/start-driving', googlePlayId: 'production.hum.driver' },
  { path: '/rider', googlePlayId: 'production.hum.rider' },
];

test.describe('App Download Links @functional', () => {
  for (const { path, googlePlayId } of PAGES_WITH_DOWNLOAD_LINKS) {
    test(`app store and google play links resolve to the correct apps on ${path} @functional`, async ({ page, siteConfig }) => {
      const target = siteConfig.url.replace(/\/$/, '') + path;
      await page.goto(target, { waitUntil: 'domcontentloaded' });

      const appStoreLinks = page.locator('a[href*="apps.apple.com"]');
      const googlePlayLinks = page.locator('a[href*="play.google.com"]');

      expect(await appStoreLinks.count(), `App Store link should be present on ${path}`).toBeGreaterThan(0);
      expect(await googlePlayLinks.count(), `Google Play link should be present on ${path}`).toBeGreaterThan(0);

      const appStoreHref = await appStoreLinks.first().getAttribute('href');
      const googlePlayHref = await googlePlayLinks.first().getAttribute('href');

      expect(appStoreHref, 'App Store href should point at an official HUM app listing').toContain(
        'apps.apple.com/us/app/hum'
      );
      expect(googlePlayHref, `Google Play href on ${path} should point at ${googlePlayId}`).toContain(googlePlayId);
    });
  }
});
