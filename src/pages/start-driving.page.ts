/**
 * src/pages/start-driving.page.ts
 *
 * StartDrivingPage models the driver enrollment funnel. Tests only verify
 * the enrollment steps and plan information render — they never complete
 * enrollment, pick a paid plan, or submit payment details.
 */

import { BasePage } from '@pages/base.page';

export class StartDrivingPage extends BasePage {
  async navigate(): Promise<void> {
    const target = this.config.url.replace(/\/$/, '') + '/start-driving';
    await this.page.goto(target, { waitUntil: 'domcontentloaded' });
  }

  async getMainHeading(): Promise<string> {
    const h1 = this.page.locator('h1').first();
    return ((await h1.textContent()) ?? '').trim();
  }

  /** Step headings for the enrollment funnel, e.g. "Download the HUM Driver App", "Pick Your Plan". */
  async getEnrollmentSteps(): Promise<string[]> {
    const steps = this.page.locator('h3');
    const count = await steps.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = (await steps.nth(i).textContent())?.trim();
      if (t) texts.push(t);
    }
    return texts;
  }

  getAppStoreLink() {
    return this.page.locator('a[href*="apps.apple.com"]').first();
  }

  getGooglePlayLink() {
    return this.page.locator('a[href*="play.google.com"]').first();
  }
}
