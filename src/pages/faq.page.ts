/**
 * src/pages/faq.page.ts
 *
 * FaqPage models the /faq page: categorized (For Drivers / For Riders)
 * FAQ sections built from native <details>/<summary> accordion items.
 */

import { BasePage } from '@pages/base.page';
import {
  getAccordionCount,
  getAccordionQuestion,
  getAccordionAnswer,
  isAccordionOpen,
  toggleAccordion,
} from '@utils/accordion';

export class FaqPage extends BasePage {
  async navigate(): Promise<void> {
    const target = this.config.url.replace(/\/$/, '') + '/faq';
    await this.page.goto(target, { waitUntil: 'domcontentloaded' });
  }

  async getMainHeading(): Promise<string> {
    const h1 = this.page.locator('h1').first();
    return ((await h1.textContent()) ?? '').trim();
  }

  /** Category section headings, e.g. ["For Drivers", "For Riders", "Still have questions?"]. */
  async getCategoryHeadings(): Promise<string[]> {
    const headings = this.page.locator('h2');
    const count = await headings.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = (await headings.nth(i).textContent())?.trim();
      if (t) texts.push(t);
    }
    return texts;
  }

  async getItemCount(): Promise<number> {
    return getAccordionCount(this.page);
  }

  async getQuestion(index: number): Promise<string> {
    return getAccordionQuestion(this.page, index);
  }

  async getAnswer(index: number): Promise<string> {
    return getAccordionAnswer(this.page, index);
  }

  async isExpanded(index: number): Promise<boolean> {
    return isAccordionOpen(this.page, index);
  }

  async expand(index: number): Promise<void> {
    await toggleAccordion(this.page, index);
  }
}
