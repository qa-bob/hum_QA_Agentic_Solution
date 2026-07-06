/**
 * src/utils/accordion.ts
 *
 * Helpers for the FAQ accordions reused across several HUM pages. The site
 * ships two different implementations of the same visual pattern:
 *  - /faq uses native <details class="faq-item"><summary>…</summary>…</details>
 *  - /driver, /rider, /insurance use <div class="faq-item"><button class="faq-q"
 *    aria-expanded="…">…</button><div class="faq-a">…</div></div>
 * These helpers detect which shape a given item uses so callers don't have to.
 */

import { type Page, type Locator } from '@playwright/test';

/** Return all accordion items on the current page, regardless of implementation. */
export function getAccordionItems(page: Page): Locator {
  return page.locator('details, .faq-item');
}

/** Number of accordion items on the current page. */
export async function getAccordionCount(page: Page): Promise<number> {
  return getAccordionItems(page).count();
}

/** The clickable trigger for the accordion item at `index` (<summary> or a <button>). */
function getAccordionTrigger(page: Page, index: number): Locator {
  const item = getAccordionItems(page).nth(index);
  return item.locator('summary, button').first();
}

/** Visible question text for the accordion item at `index`. */
export async function getAccordionQuestion(page: Page, index: number): Promise<string> {
  const trigger = getAccordionTrigger(page, index);
  return ((await trigger.textContent()) ?? '').trim();
}

/** Whether the accordion item at `index` is currently expanded. */
export async function isAccordionOpen(page: Page, index: number): Promise<boolean> {
  const item = getAccordionItems(page).nth(index);
  const tagName = await item.evaluate((el) => el.tagName.toLowerCase());

  if (tagName === 'details') {
    return (await item.getAttribute('open')) !== null;
  }

  const trigger = getAccordionTrigger(page, index);
  return (await trigger.getAttribute('aria-expanded')) === 'true';
}

/** Toggle the accordion item at `index` by clicking its trigger. */
export async function toggleAccordion(page: Page, index: number): Promise<void> {
  await getAccordionTrigger(page, index).click();
}

/** Answer text for the accordion item at `index` (only meaningful once expanded). */
export async function getAccordionAnswer(page: Page, index: number): Promise<string> {
  const item = getAccordionItems(page).nth(index);
  const tagName = await item.evaluate((el) => el.tagName.toLowerCase());

  const answer = tagName === 'details' ? item.locator('summary ~ *').first() : item.locator('.faq-a').first();

  return ((await answer.textContent()) ?? '').trim();
}
