/**
 * tests/regression/critical-user-journeys.spec.ts
 *
 * Cross-page regression checks — legal/policy pages stay reachable, footer
 * social links resolve to the correct profiles, and core multi-page flows
 * (Home → Drivers → Start Driving, Home → Riders → FAQ) don't break. These
 * only make sense verified end-to-end, so they live in @regression rather
 * than @functional or @navigation.
 *
 * Tag: @regression
 */

import { test, expect } from '@fixtures/site.fixture';

const LEGAL_PAGES = ['/privacy-policy', '/terms-of-use', '/zero-tolerance', '/referral-terms'];

const SOCIAL_LINKS: Record<string, string> = {
  'x.com': 'humrideshare',
  'tiktok.com': 'humrideshare',
  'instagram.com': 'humrideshare',
  'facebook.com': 'humrideshare',
  'youtube.com': 'humrideshare',
};

test.describe('Critical User Journeys @regression', () => {
  test('footer legal pages are all reachable @regression', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const broken: string[] = [];
    for (const legalPath of LEGAL_PAGES) {
      const target = siteConfig.url.replace(/\/$/, '') + legalPath;
      const response = await page.request.get(target).catch(() => null);
      if (!response || !response.ok()) {
        broken.push(`${target} → ${response ? response.status() : 'no response'}`);
      }
    }

    expect(broken, `Broken legal page(s):\n${broken.join('\n')}`).toHaveLength(0);
  });

  test('footer social links point at the correct HUM profiles @regression', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const footer = page.locator('footer');
    const mismatched: string[] = [];

    for (const [domain, handle] of Object.entries(SOCIAL_LINKS)) {
      const link = footer.locator(`a[href*="${domain}"]`).first();
      if ((await link.count()) === 0) {
        mismatched.push(`${domain}: no link found`);
        continue;
      }
      const href = (await link.getAttribute('href')) ?? '';
      if (!href.toLowerCase().includes(handle.toLowerCase())) {
        mismatched.push(`${domain}: href "${href}" does not reference "${handle}"`);
      }
    }

    expect(mismatched, `Social link mismatch(es):\n${mismatched.join('\n')}`).toHaveLength(0);
  });

  test('journey: Home → For Drivers → Start Driving @regression', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    await page.getByRole('link', { name: 'For Drivers', exact: true }).first().click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/driver');

    await page.getByRole('link', { name: 'Start Driving', exact: true }).first().click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/start-driving');
  });

  test('journey: Home → For Riders → FAQ @regression', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    await page.getByRole('link', { name: 'For Riders', exact: true }).first().click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/rider');

    // The header's only "FAQ" link lives inside the hover-triggered "Learn"
    // dropdown; the footer link resolves to the same page without needing
    // to open that menu first.
    await page.locator('footer a[href="/faq"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/faq');
  });
});
