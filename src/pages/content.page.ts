/**
 * src/pages/content.page.ts
 *
 * ContentPage models informational marketing pages that share the same
 * shape (hero heading, body sections, optional FAQ accordion) but have no
 * interactive flow of their own — About, Insurance, Ride Assurance, How It
 * Works, Learn. Parametrized by path instead of one class per page to avoid
 * duplicating identical logic across near-identical pages.
 */

import { type Page } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@config-types/site-config.types';
import { getAccordionCount } from '@utils/accordion';

export class ContentPage extends BasePage {
  readonly path: string;

  constructor(page: Page, config: SiteConfig, path: string) {
    super(page, config);
    this.path = path.startsWith('/') ? path : `/${path}`;
  }

  async navigate(): Promise<void> {
    const target = this.config.url.replace(/\/$/, '') + this.path;
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

  async isLoaded(): Promise<boolean> {
    const heading = await this.getMainHeading();
    const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
    return heading.length > 0 && bodyText.trim().length > 50;
  }
}
