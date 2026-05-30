// pages/BasePage.js

class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigates to a path relative to baseURL in playwright.config.js.
   *
   * ROOT CAUSE FIX (all browsers, all spec files):
   * The original page.goto(path) used Playwright's default waitUntil ('load'),
   * which waits for ALL resources including ads/analytics on ParaBank. On a
   * slow/shared public server this regularly exceeds 30-90 s in CI.
   *
   * Fix 1: Use waitUntil:'domcontentloaded' — far faster, sufficient for ParaBank
   *         because Angular bootstraps from inline scripts, not external resources.
   * Fix 2: Retry up to 3 times with a 3 s pause between attempts. ParaBank's
   *         public server has intermittent cold-start latency; retrying the goto
   *         itself is the most reliable defence against transient 502/504 errors.
   * Fix 3: Explicit timeout of 90 s per attempt matches navigationTimeout in config
   *         so error messages are consistent.
   *
   * @param {string} path
   */
  async navigate(path) {
    const MAX_RETRIES = 3;
    let lastErr;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await this.page.goto(path, {
          waitUntil: 'domcontentloaded',
          timeout: 90000,
        });
        return; // success
      } catch (err) {
        lastErr = err;
        if (attempt < MAX_RETRIES) {
          // Brief pause before retry — gives the server a moment to recover
          await this.page.waitForTimeout(3000);
        }
      }
    }
    throw lastErr; // re-throw after all retries exhausted
  }
}

module.exports = BasePage;