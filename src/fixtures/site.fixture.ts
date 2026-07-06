/**
 * src/fixtures/site.fixture.ts
 *
 * Extends Playwright's base `test` with pre-constructed page objects and the
 * loaded site config.  All test files should import {test, expect} from here
 * instead of from '@playwright/test' directly.
 *
 * Usage in test files:
 *   import { test, expect } from '@fixtures/site.fixture';
 */

import { test as base, expect } from '@playwright/test';
import { loadSiteConfig, type SiteConfig } from '@config-types/site-config.types';
import { HomePage } from '@pages/home.page';
import { NavigationPage } from '@pages/navigation.page';
import { ContactFormPage } from '@pages/contact.page';
import { ContentPage } from '@pages/content.page';
import { FaqPage } from '@pages/faq.page';
import { DriverPage } from '@pages/driver.page';
import { RiderPage } from '@pages/rider.page';
import { StartDrivingPage } from '@pages/start-driving.page';
import { StatesPage } from '@pages/states.page';
import { StateCheckerModal } from '@pages/state-checker-modal.page';

// ── Fixture type definitions ─────────────────────────────────────────────────

export interface Fixtures {
  /** Fully resolved site configuration loaded from site.config.json */
  siteConfig: SiteConfig;
  /** Pre-navigated HomePage page object */
  homePage: HomePage;
  /** NavigationPage page object (does not auto-navigate) */
  navigationPage: NavigationPage;
  /** ContactFormPage page object (does not auto-navigate) */
  contactPage: ContactFormPage;
  /** Factory for ContentPage — informational pages parametrized by path */
  contentPage: (path: string) => ContentPage;
  /** FaqPage page object (does not auto-navigate) */
  faqPage: FaqPage;
  /** DriverPage page object (does not auto-navigate) */
  driverPage: DriverPage;
  /** RiderPage page object (does not auto-navigate) */
  riderPage: RiderPage;
  /** StartDrivingPage page object (does not auto-navigate) */
  startDrivingPage: StartDrivingPage;
  /** StatesPage page object (does not auto-navigate) */
  statesPage: StatesPage;
  /** StateCheckerModal component object, usable from whichever page is loaded */
  stateCheckerModal: StateCheckerModal;
}

// ── Extended test object ─────────────────────────────────────────────────────

export const test = base.extend<Fixtures>({
  /**
   * siteConfig — loaded once per worker from site.config.json.
   * Shared across all fixtures in the same test.
   */
  siteConfig: async ({}, use) => {
    const config = loadSiteConfig();
    await use(config);
  },

  /**
   * homePage — constructs HomePage and navigates to the site root.
   * Waits for domcontentloaded before handing control to the test.
   */
  homePage: async ({ page, siteConfig }, use) => {
    const homePage = new HomePage(page, siteConfig);
    await homePage.navigate();
    await use(homePage);
  },

  /**
   * navigationPage — constructs NavigationPage without navigating.
   * Tests that need to be on a specific page should call navigate() themselves.
   */
  navigationPage: async ({ page, siteConfig }, use) => {
    const navigationPage = new NavigationPage(page, siteConfig);
    await use(navigationPage);
  },

  /**
   * contactPage — constructs ContactFormPage without navigating.
   * Tests should navigate to the appropriate page first.
   */
  contactPage: async ({ page, siteConfig }, use) => {
    const contactPage = new ContactFormPage(page, siteConfig);
    await use(contactPage);
  },

  /**
   * contentPage — factory for ContentPage, since informational pages are
   * parametrized by path rather than having one fixed instance each.
   * Usage: const aboutPage = contentPage('/about');
   */
  contentPage: async ({ page, siteConfig }, use) => {
    await use((path: string) => new ContentPage(page, siteConfig, path));
  },

  /** faqPage — constructs FaqPage without navigating. */
  faqPage: async ({ page, siteConfig }, use) => {
    await use(new FaqPage(page, siteConfig));
  },

  /** driverPage — constructs DriverPage without navigating. */
  driverPage: async ({ page, siteConfig }, use) => {
    await use(new DriverPage(page, siteConfig));
  },

  /** riderPage — constructs RiderPage without navigating. */
  riderPage: async ({ page, siteConfig }, use) => {
    await use(new RiderPage(page, siteConfig));
  },

  /** startDrivingPage — constructs StartDrivingPage without navigating. */
  startDrivingPage: async ({ page, siteConfig }, use) => {
    await use(new StartDrivingPage(page, siteConfig));
  },

  /** statesPage — constructs StatesPage without navigating. */
  statesPage: async ({ page, siteConfig }, use) => {
    await use(new StatesPage(page, siteConfig));
  },

  /** stateCheckerModal — constructs StateCheckerModal; caller must be on a page that has it. */
  stateCheckerModal: async ({ page, siteConfig }, use) => {
    await use(new StateCheckerModal(page, siteConfig));
  },
});

// Re-export expect so tests only need one import source
export { expect };
