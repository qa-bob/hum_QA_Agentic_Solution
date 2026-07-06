/**
 * src/pages/states.page.ts
 *
 * StatesPage models the /states availability page: the list of live states.
 * The state-eligibility checker embedded on this page is modeled separately
 * by StateCheckerModal — its "#geo-modal" markup is always present in the
 * DOM (just hidden), so its own <h3> headings ("You're in.", "Where are you
 * driving?") are filtered out of getListedStates() below.
 */

import { BasePage } from '@pages/base.page';

const MODAL_BOILERPLATE = /you're in\.|isn't in|where are you driving/i;

export class StatesPage extends BasePage {
  async navigate(): Promise<void> {
    const target = this.config.url.replace(/\/$/, '') + '/states';
    await this.page.goto(target, { waitUntil: 'domcontentloaded' });
  }

  async getMainHeading(): Promise<string> {
    const h1 = this.page.locator('h1').first();
    return ((await h1.textContent()) ?? '').trim();
  }

  async getListedStates(): Promise<string[]> {
    const items = this.page.locator('h3');
    const count = await items.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = (await items.nth(i).textContent())?.trim();
      if (t && !MODAL_BOILERPLATE.test(t)) texts.push(t);
    }
    return texts;
  }
}
