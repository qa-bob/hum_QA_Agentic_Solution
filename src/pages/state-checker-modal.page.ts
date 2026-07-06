/**
 * src/pages/state-checker-modal.page.ts
 *
 * StateCheckerModal models the "#geo-modal" state-eligibility widget that
 * appears on the home, driver, rider, start-driving, and states pages.
 * Selecting a state only toggles a client-side result panel — this object
 * never touches the embedded third-party waitlist form inside the
 * out-of-market panel, which is never submitted.
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class StateCheckerModal extends BasePage {
  private modal(): Locator {
    return this.page.locator('#geo-modal');
  }

  /**
   * The modal renders up to three <select> elements (in-market, out-market,
   * manual), only one of which is visible depending on IP-based geolocation
   * results the widget's own script computes on open. The manual picker
   * inside #modal-manual is the only one guaranteed to be visible and
   * interactable regardless of that outcome, so it's the one to drive.
   */
  private stateSelect(): Locator {
    return this.modal().locator('#modal-manual select');
  }

  /** Locate the trigger button on whichever page is currently loaded. */
  getTrigger(): Locator {
    return this.page.getByRole('button', { name: /check if hum is in your state/i }).first();
  }

  async isTriggerPresent(): Promise<boolean> {
    return (await this.getTrigger().count()) > 0;
  }

  async open(): Promise<void> {
    const trigger = this.getTrigger();
    if ((await trigger.count()) === 0) return;
    await trigger.click();
    await this.modal().waitFor({ state: 'visible', timeout: 5_000 }).catch(() => undefined);
  }

  async close(): Promise<void> {
    const closeBtn = this.modal().locator('.modal-close, [aria-label="Close" i]').first();
    if ((await closeBtn.count()) > 0) {
      await closeBtn.click();
    }
  }

  async isOpen(): Promise<boolean> {
    return this.modal().isVisible();
  }

  async getStateOptionLabels(): Promise<string[]> {
    return this.stateSelect().locator('option').allTextContents();
  }

  /** True when the state's <option> label carries the "available" marker. */
  async isStateAvailable(stateName: string): Promise<boolean> {
    const option = this.stateSelect().locator(`option[value="${stateName}"]`);
    const label = await option.textContent();
    return /\S/.test(label ?? '') && (label ?? '').includes('✓');
  }

  /** Select a state by its option value and let the page's own script reveal the result panel. */
  async selectState(stateName: string): Promise<void> {
    await this.stateSelect().selectOption({ value: stateName });
  }

  async isInMarketResultShown(): Promise<boolean> {
    return this.modal().locator('#modal-in-market').isVisible();
  }

  async isOutOfMarketResultShown(): Promise<boolean> {
    return this.modal().locator('#modal-out-market').isVisible();
  }
}
