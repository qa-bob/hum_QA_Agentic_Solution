/**
 * src/pages/rider.page.ts
 *
 * RiderPage models the /rider landing page: value-proposition content and
 * an embedded FAQ accordion.
 */

import { BasePage } from '@pages/base.page';
import { getAccordionCount, getAccordionQuestion } from '@utils/accordion';

export class RiderPage extends BasePage {
  async navigate(): Promise<void> {
    const target = this.config.url.replace(/\/$/, '') + '/rider';
    await this.page.goto(target, { waitUntil: 'domcontentloaded' });
  }

  async getMainHeading(): Promise<string> {
    const h1 = this.page.locator('h1').first();
    return ((await h1.textContent()) ?? '').trim();
  }

  async getSectionHeadings(): Promise<string[]> {
    const headings = this.page.locator('h2');
    const count = await headings.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = (await headings.nth(i).textContent())?.trim();
      if (t) texts.push(t);
    }
    return texts;
  }

  async getFaqCount(): Promise<number> {
    return getAccordionCount(this.page);
  }

  async getFaqQuestion(index: number): Promise<string> {
    return getAccordionQuestion(this.page, index);
  }

  /** Primary CTA locator — "Find Your Driver" on this page. */
  getPrimaryCta() {
    return this.page.getByRole('link', { name: /find your driver/i }).or(
      this.page.getByRole('button', { name: /find your driver/i })
    ).first();
  }
}
