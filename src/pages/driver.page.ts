/**
 * src/pages/driver.page.ts
 *
 * DriverPage models the /driver landing page: value-proposition content
 * and an embedded FAQ accordion. The state-eligibility checker on this
 * page is modeled separately by StateCheckerModal.
 */

import { BasePage } from '@pages/base.page';
import { getAccordionCount, getAccordionQuestion } from '@utils/accordion';

export class DriverPage extends BasePage {
  async navigate(): Promise<void> {
    const target = this.config.url.replace(/\/$/, '') + '/driver';
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
}
