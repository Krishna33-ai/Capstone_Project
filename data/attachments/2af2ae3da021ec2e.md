# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ADD_ON_loan.spec.js >> Block 2 — Form Fields >> TC-LOAN-05 | Down payment input is visible
- Location: tests/ADD_ON_loan.spec.js:45:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 60000ms exceeded.
Call log:
  - waiting for locator('input[id="amount"]') to be visible

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - link:
        - /url: admin.htm
        - img [ref=e4] [cursor=pointer]
      - link "ParaBank":
        - /url: index.htm
        - img "ParaBank" [ref=e5] [cursor=pointer]
      - paragraph [ref=e6]: Experience the difference
    - generic [ref=e7]:
      - list [ref=e8]:
        - listitem [ref=e9]: Solutions
        - listitem [ref=e10]:
          - link "About Us" [ref=e11] [cursor=pointer]:
            - /url: about.htm
        - listitem [ref=e12]:
          - link "Services" [ref=e13] [cursor=pointer]:
            - /url: services.htm
        - listitem [ref=e14]:
          - link "Products" [ref=e15] [cursor=pointer]:
            - /url: http://www.parasoft.com/jsp/products.jsp
        - listitem [ref=e16]:
          - link "Locations" [ref=e17] [cursor=pointer]:
            - /url: http://www.parasoft.com/jsp/pr/contacts.jsp
        - listitem [ref=e18]:
          - link "Admin Page" [ref=e19] [cursor=pointer]:
            - /url: admin.htm
      - list [ref=e20]:
        - listitem [ref=e21]:
          - link "home" [ref=e22] [cursor=pointer]:
            - /url: index.htm
        - listitem [ref=e23]:
          - link "about" [ref=e24] [cursor=pointer]:
            - /url: about.htm
        - listitem [ref=e25]:
          - link "contact" [ref=e26] [cursor=pointer]:
            - /url: contact.htm
    - generic [ref=e27]:
      - generic [ref=e28]:
        - heading "Customer Login" [level=2] [ref=e29]
        - generic [ref=e30]:
          - generic [ref=e31]:
            - paragraph [ref=e32]: Username
            - textbox [active] [ref=e34]
            - paragraph [ref=e35]: Password
            - textbox [ref=e37]
            - button "Log In" [ref=e39] [cursor=pointer]
          - paragraph [ref=e40]:
            - link "Forgot login info?" [ref=e41] [cursor=pointer]:
              - /url: lookup.htm
          - paragraph [ref=e42]:
            - link "Register" [ref=e43] [cursor=pointer]:
              - /url: register.htm
      - generic [ref=e44]:
        - heading "Error!" [level=1] [ref=e45]
        - paragraph [ref=e46]: An internal error has occurred and has been logged.
  - generic [ref=e48]:
    - list [ref=e49]:
      - listitem [ref=e50]:
        - link "Home" [ref=e51] [cursor=pointer]:
          - /url: index.htm
        - text: "|"
      - listitem [ref=e52]:
        - link "About Us" [ref=e53] [cursor=pointer]:
          - /url: about.htm
        - text: "|"
      - listitem [ref=e54]:
        - link "Services" [ref=e55] [cursor=pointer]:
          - /url: services.htm
        - text: "|"
      - listitem [ref=e56]:
        - link "Products" [ref=e57] [cursor=pointer]:
          - /url: http://www.parasoft.com/jsp/products.jsp
        - text: "|"
      - listitem [ref=e58]:
        - link "Locations" [ref=e59] [cursor=pointer]:
          - /url: http://www.parasoft.com/jsp/pr/contacts.jsp
        - text: "|"
      - listitem [ref=e60]:
        - link "Forum" [ref=e61] [cursor=pointer]:
          - /url: http://forums.parasoft.com/
        - text: "|"
      - listitem [ref=e62]:
        - link "Site Map" [ref=e63] [cursor=pointer]:
          - /url: sitemap.htm
        - text: "|"
      - listitem [ref=e64]:
        - link "Contact Us" [ref=e65] [cursor=pointer]:
          - /url: contact.htm
    - paragraph [ref=e66]: © Parasoft. All rights reserved.
    - list [ref=e67]:
      - listitem [ref=e68]: "Visit us at:"
      - listitem [ref=e69]:
        - link "www.parasoft.com" [ref=e70] [cursor=pointer]:
          - /url: http://www.parasoft.com/
```

# Test source

```ts
  1  | // pages/LoanPage.js
  2  | const BasePage = require('./BasePage');
  3  | 
  4  | class LoanPage extends BasePage {
  5  |   constructor(page) {
  6  |     super(page);
  7  |     this.loanAmountInput   = page.locator('input[id="amount"]');
  8  |     this.downPaymentInput  = page.locator('input[id="downPayment"]');
  9  |     this.fromAccountSelect = page.locator('select[id="fromAccountId"]');
  10 |     this.applyButton       = page.locator('input[value="Apply Now"]');
  11 |     this.rightPanel        = page.locator('#rightPanel');
  12 | 
  13 |     
  14 |     this.loanLink = page.locator(
  15 |       'a:has-text("Request Loan"), a[href*="requestloan"]'
  16 |     ).first();
  17 |   }
  18 | 
  19 |   async gotoLoan() {
  20 |     await this.navigate('/parabank/requestloan.htm');
  21 |     await this.page.waitForLoadState('domcontentloaded');
  22 | 
  23 |     
> 24 |     await this.loanAmountInput.waitFor({ state: 'visible', timeout: 60000 });
     |                                ^ TimeoutError: locator.waitFor: Timeout 60000ms exceeded.
  25 | 
  26 |     
  27 |     await this.fromAccountSelect.waitFor({ state: 'visible', timeout: 60000 });
  28 |     await this.page.waitForFunction(
  29 |       () => {
  30 |         const sel = document.querySelector('select[id="fromAccountId"]');
  31 |         return sel && sel.options && sel.options.length > 0;
  32 |       },
  33 |       { timeout: 60000 }
  34 |     );
  35 |   }
  36 | 
  37 |   async getFromAccountCount() {
  38 |     return await this.fromAccountSelect.locator('option').count();
  39 |   }
  40 | 
  41 |   async getRightPanelText() {
  42 |     return await this.rightPanel.innerText();
  43 |   }
  44 | 
  45 |   
  46 |   async applyForLoan(amount, downPayment) {
  47 |     await this.loanAmountInput.fill(amount);
  48 |     await this.downPaymentInput.fill(downPayment);
  49 | 
  50 |     const beforeText = await this.rightPanel.innerText().catch(() => '');
  51 | 
  52 |     await this.applyButton.click();
  53 |     await this.page.waitForLoadState('domcontentloaded');
  54 | 
  55 |     
  56 |     await this.page.waitForFunction(
  57 |       (before) => {
  58 |         const el = document.querySelector('#rightPanel');
  59 |         if (!el) return false;
  60 |         const current = el.innerText ? el.innerText.trim() : '';
  61 |         return current.length > 0 && current !== before.trim();
  62 |       },
  63 |       beforeText,
  64 |       { timeout: 60000 }
  65 |     );
  66 |   }
  67 | }
  68 | 
  69 | module.exports = LoanPage;
```