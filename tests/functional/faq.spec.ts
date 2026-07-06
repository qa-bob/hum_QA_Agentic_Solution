/**
 * tests/functional/faq.spec.ts
 *
 * FAQ page tests — verify the categorized accordion renders and items
 * expand/collapse correctly.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('FAQ Page @functional', () => {
  test.beforeEach(async ({ faqPage }) => {
    await faqPage.navigate();
  });

  test('FAQ page has category sections @functional', async ({ faqPage }) => {
    const categories = await faqPage.getCategoryHeadings();
    expect(categories.length, 'FAQ page should have at least one category heading').toBeGreaterThan(0);
  });

  test('FAQ page lists multiple questions @functional', async ({ faqPage }) => {
    const count = await faqPage.getItemCount();
    expect(count, 'FAQ page should list at least one question').toBeGreaterThan(0);
  });

  test('FAQ items start collapsed @functional', async ({ faqPage }) => {
    const count = await faqPage.getItemCount();
    test.skip(count === 0, 'No FAQ items found');

    const expanded = await faqPage.isExpanded(0);
    expect(expanded, 'First FAQ item should start collapsed').toBeFalsy();
  });

  test('clicking a question expands it and reveals an answer @functional', async ({ faqPage }) => {
    const count = await faqPage.getItemCount();
    test.skip(count === 0, 'No FAQ items found');

    const question = await faqPage.getQuestion(0);
    expect(question.length, 'FAQ question text should not be empty').toBeGreaterThan(0);

    await faqPage.expand(0);
    const expanded = await faqPage.isExpanded(0);
    expect(expanded, 'FAQ item should be expanded after clicking').toBeTruthy();

    const answer = await faqPage.getAnswer(0);
    expect(answer.length, 'FAQ answer text should not be empty once expanded').toBeGreaterThan(0);
  });

  test('clicking an expanded question collapses it again @functional', async ({ faqPage }) => {
    const count = await faqPage.getItemCount();
    test.skip(count === 0, 'No FAQ items found');

    await faqPage.expand(0);
    expect(await faqPage.isExpanded(0), 'Item should be expanded after first click').toBeTruthy();

    await faqPage.expand(0);
    expect(await faqPage.isExpanded(0), 'Item should be collapsed after second click').toBeFalsy();
  });
});
