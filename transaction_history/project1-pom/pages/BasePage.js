// pages/BasePage.js

class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigate(path)        { await this.page.goto(path); await this.page.waitForLoadState('domcontentloaded'); }
  async getTitle()            { return this.page.title(); }
  async getText(selector)     { return this.page.locator(selector).innerText(); }
  async isVisible(selector)   { return this.page.locator(selector).isVisible(); }
  async click(selector)       { await this.page.locator(selector).click(); }
  async fill(selector, value) { await this.page.locator(selector).fill(value); }
  async getPageURL()          { return this.page.url(); }
}

module.exports = BasePage;
