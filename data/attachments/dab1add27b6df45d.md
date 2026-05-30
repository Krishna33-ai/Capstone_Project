# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bill.spec.js >> Block 4 — Payment Submit >> TC-BILL-13 | Submitting empty form shows page response
- Location: tests/bill.spec.js:98:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 60000ms exceeded.
Call log:
  - waiting for locator('input[name="payee.name"]') to be visible

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - link:
        - /url: admin.htm
        - img [ref=e4]
      - link "ParaBank":
        - /url: index.htm
        - img "ParaBank" [ref=e5]
      - paragraph [ref=e6]: Experience the difference
    - generic [ref=e7]:
      - list [ref=e8]:
        - listitem [ref=e9]: Solutions
        - listitem [ref=e10]:
          - link "About Us" [ref=e11]:
            - /url: about.htm
        - listitem [ref=e12]:
          - link "Services" [ref=e13]:
            - /url: services.htm
        - listitem [ref=e14]:
          - link "Products" [ref=e15]:
            - /url: http://www.parasoft.com/jsp/products.jsp
        - listitem [ref=e16]:
          - link "Locations" [ref=e17]:
            - /url: http://www.parasoft.com/jsp/pr/contacts.jsp
        - listitem [ref=e18]:
          - link "Admin Page" [ref=e19]:
            - /url: admin.htm
      - list [ref=e20]:
        - listitem [ref=e21]:
          - link "home" [ref=e22]:
            - /url: index.htm
        - listitem [ref=e23]:
          - link "about" [ref=e24]:
            - /url: about.htm
        - listitem [ref=e25]:
          - link "contact" [ref=e26]:
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
            - link "Forgot login info?" [ref=e41]:
              - /url: lookup.htm
          - paragraph [ref=e42]:
            - link "Register" [ref=e43]:
              - /url: register.htm
      - generic [ref=e44]:
        - heading "Error!" [level=1] [ref=e45]
        - paragraph [ref=e46]: An internal error has occurred and has been logged.
  - generic [ref=e48]:
    - list [ref=e49]:
      - listitem [ref=e50]:
        - link "Home" [ref=e51]:
          - /url: index.htm
        - text: "|"
      - listitem [ref=e52]:
        - link "About Us" [ref=e53]:
          - /url: about.htm
        - text: "|"
      - listitem [ref=e54]:
        - link "Services" [ref=e55]:
          - /url: services.htm
        - text: "|"
      - listitem [ref=e56]:
        - link "Products" [ref=e57]:
          - /url: http://www.parasoft.com/jsp/products.jsp
        - text: "|"
      - listitem [ref=e58]:
        - link "Locations" [ref=e59]:
          - /url: http://www.parasoft.com/jsp/pr/contacts.jsp
        - text: "|"
      - listitem [ref=e60]:
        - link "Forum" [ref=e61]:
          - /url: http://forums.parasoft.com/
        - text: "|"
      - listitem [ref=e62]:
        - link "Site Map" [ref=e63]:
          - /url: sitemap.htm
        - text: "|"
      - listitem [ref=e64]:
        - link "Contact Us" [ref=e65]:
          - /url: contact.htm
    - paragraph [ref=e66]: © Parasoft. All rights reserved.
    - list [ref=e67]:
      - listitem [ref=e68]: "Visit us at:"
      - listitem [ref=e69]:
        - link "www.parasoft.com" [ref=e70]:
          - /url: http://www.parasoft.com/
```

# Test source

```ts
  1  | // pages/BillPage.js
  2  | const BasePage = require('./BasePage');
  3  | 
  4  | class BillPage extends BasePage {
  5  |   constructor(page) {
  6  |     super(page);
  7  |     this.payeeNameInput     = page.locator('input[name="payee.name"]');
  8  |     this.addressInput       = page.locator('input[name="payee.address.street"]');
  9  |     this.cityInput          = page.locator('input[name="payee.address.city"]');
  10 |     this.stateInput         = page.locator('input[name="payee.address.state"]');
  11 |     this.zipCodeInput       = page.locator('input[name="payee.address.zipCode"]');
  12 |     this.phoneInput         = page.locator('input[name="payee.phoneNumber"]');
  13 |     this.accountInput       = page.locator('input[name="payee.accountNumber"]');
  14 |     this.verifyAccountInput = page.locator('input[name="verifyAccount"]');
  15 |     this.amountInput        = page.locator('input[name="amount"]');
  16 |     this.fromAccountSelect  = page.locator('select[name="fromAccountId"]');
  17 | 
  18 |     // FIX TC-BILL-08: broaden selector — primary value attr, fallback text
  19 |     this.sendButton         = page.locator('input[value="Send Payment"], button:has-text("Send Payment")');
  20 | 
  21 |     this.rightPanel         = page.locator('#rightPanel');
  22 |     this.billPayLink        = page.locator('a[href*="billpay"]');
  23 |   }
  24 | 
  25 |   async gotoBillPay() {
  26 |     await this.navigate('/parabank/billpay.htm');
  27 |     await this.page.waitForLoadState('domcontentloaded');
  28 | 
  29 |     // Wait for Angular to render the form (payeeNameInput is the first visible field)
> 30 |     await this.payeeNameInput.waitFor({ state: 'visible', timeout: 60000 });
     |                               ^ TimeoutError: locator.waitFor: Timeout 60000ms exceeded.
  31 | 
  32 |     // FIX TC-BILL-08, 09, 10: wait for sendButton AND fromAccountSelect AJAX options
  33 |     await this.sendButton.waitFor({ state: 'visible', timeout: 60000 });
  34 |     await this.fromAccountSelect.waitFor({ state: 'visible', timeout: 60000 });
  35 |     await this.page.waitForFunction(
  36 |       () => {
  37 |         const sel = document.querySelector('select[name="fromAccountId"]');
  38 |         return sel && sel.options && sel.options.length > 0;
  39 |       },
  40 |       { timeout: 60000 }
  41 |     );
  42 |   }
  43 | 
  44 |   async getFromAccountCount() {
  45 |     return await this.fromAccountSelect.locator('option').count();
  46 |   }
  47 | 
  48 |   async getRightPanelText() {
  49 |     return await this.rightPanel.innerText();
  50 |   }
  51 | 
  52 |   async fillPayeeDetails(data) {
  53 |     await this.payeeNameInput.fill(data.name);
  54 |     await this.addressInput.fill(data.address);
  55 |     await this.cityInput.fill(data.city);
  56 |     await this.stateInput.fill(data.state);
  57 |     await this.zipCodeInput.fill(data.zipCode);
  58 |     await this.phoneInput.fill(data.phone);
  59 |     await this.accountInput.fill(data.account);
  60 |     await this.verifyAccountInput.fill(data.account);
  61 |     await this.amountInput.fill(data.amount);
  62 |   }
  63 | }
  64 | 
  65 | module.exports = BillPage;
```