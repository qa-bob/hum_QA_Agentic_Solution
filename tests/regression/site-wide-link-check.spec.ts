/**
 * tests/regression/site-wide-link-check.spec.ts
 *
 * Site-wide link integrity — every internal link discovered on key landing
 * pages must resolve without a 4xx/5xx. Uses the shared link-checker utility
 * (src/utils/link-checker.ts) since this sweeps in-page CTAs and footer
 * links too, not just the primary <nav> covered by tests/navigation.
 *
 * Tag: @regression
 */

import { test, expect } from '@fixtures/site.fixture';
import { checkAllLinks, filterInternalLinks } from '@utils/link-checker';

const PAGES_TO_SWEEP = ['/', '/driver', '/rider', '/faq', '/contact'];

test.describe('Site-Wide Link Check @regression', () => {
  for (const path of PAGES_TO_SWEEP) {
    test(`no broken internal links on ${path} @regression`, async ({ page, siteConfig }) => {
      const target = siteConfig.url.replace(/\/$/, '') + path;
      await page.goto(target, { waitUntil: 'domcontentloaded' });

      const allLinks = await checkAllLinks(page, siteConfig.url);
      const internalLinks = filterInternalLinks(allLinks, siteConfig.url);
      const broken = internalLinks.filter((link) => !link.ok && link.status !== 0);

      expect(
        broken,
        `Broken internal link(s) on ${path}:\n` + broken.map((l) => `  ${l.url} → HTTP ${l.status}`).join('\n')
      ).toHaveLength(0);
    });
  }
});
