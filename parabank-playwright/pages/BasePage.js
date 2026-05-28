// pages/BasePage.js
// Base POM class — shared helpers for all page objects
// Candidate: Siva

class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async navigate(path) {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitle()            { return this.page.title(); }
  async getText(selector)     { return this.page.locator(selector).innerText(); }
  async isVisible(selector)   { return this.page.locator(selector).isVisible(); }
  async click(selector)       { await this.page.locator(selector).click(); }
  async fill(selector, value) { await this.page.locator(selector).fill(value); }
  async getPageURL()          { return this.page.url(); }

  async waitForURL(pattern) {
    await this.page.waitForURL(pattern, { timeout: 15000 });
  }

  async waitForSelector(selector) {
    await this.page.waitForSelector(selector, { timeout: 15000 });
  }
}

module.exports = BasePage;
