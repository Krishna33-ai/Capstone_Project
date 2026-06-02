# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: transaction.spec.js >> Block 2 — Transaction Table >> TC-TXN-05 | Transaction table is visible on activity page
- Location: tests/transaction.spec.js:58:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('#accountTable a').first() to be visible

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
  1   | // tests/transaction.spec.js
  2   | // SERVICE 4 — Transaction History | 17 Test Cases
  3   | // Target : https://parabank.parasoft.com
  4   | 
  5   | const { test, expect } = require('@playwright/test');
  6   | const AuthPage        = require('../pages/AuthPage');
  7   | const TransactionPage = require('../pages/TransactionPage');
  8   | const TEST_DATA       = require('../fixtures/testData');
  9   | 
  10  | async function loginAndGotoActivity(page) {
  11  |   const auth = new AuthPage(page);
  12  |   await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  13  |   await page.waitForLoadState('domcontentloaded');
  14  |   const txn = new TransactionPage(page);
  15  |   await txn.gotoOverview();
> 16  |   await txn.accountLinks.first().waitFor({ state: 'visible', timeout: 30000 });
      |                                  ^ TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
  17  |   await txn.clickFirstAccount();
  18  |   await page.waitForLoadState('domcontentloaded');
  19  |   await page.waitForSelector('#rightPanel', { state: 'visible', timeout: 25000 });
  20  |   return txn;
  21  | }
  22  | 
  23  | test.describe('Block 1 — Account Activity Page Load', () => {
  24  |   test('TC-TXN-01 | Account activity page loads after clicking account', async ({ page }) => {
  25  |     await loginAndGotoActivity(page);
  26  |     await expect(page).toHaveURL(/activity/);
  27  |   });
  28  | 
  29  |   // FIX: TC-TXN-02 was the one flaky UI failure.
  30  |   // Root cause: after clickFirstAccount() + domcontentloaded, ParaBank renders
  31  |   // #rightPanel asynchronously. The raw toBeVisible() check races against the
  32  |   // async render and loses intermittently.
  33  |   // Fix: wrap in toPass() retry loop (same pattern used by TC-TXN-03 and
  34  |   // every other test in this file that checks panel content).
  35  |   test('TC-TXN-02 | Right panel content is visible on activity page', async ({ page }) => {
  36  |     const txn = await loginAndGotoActivity(page);
  37  |     await expect(async () => {
  38  |       await expect(txn.rightPanel).toBeVisible();
  39  |     }).toPass({ timeout: 20000 });
  40  |   });
  41  | 
  42  |   test('TC-TXN-03 | Page title contains account related text', async ({ page }) => {
  43  |     const txn = await loginAndGotoActivity(page);
  44  |     await expect(async () => {
  45  |       const text = await txn.getRightPanelText();
  46  |       expect(text.length).toBeGreaterThan(0);
  47  |     }).toPass({ timeout: 15000 });
  48  |   });
  49  | 
  50  |   test('TC-TXN-04 | Account overview link is visible on activity page', async ({ page }) => {
  51  |     const txn = await loginAndGotoActivity(page);
  52  |     await txn.overviewLink.waitFor({ state: 'visible', timeout: 20000 });
  53  |     await expect(txn.overviewLink).toBeVisible();
  54  |   });
  55  | });
  56  | 
  57  | test.describe('Block 2 — Transaction Table', () => {
  58  |   test('TC-TXN-05 | Transaction table is visible on activity page', async ({ page }) => {
  59  |     const txn = await loginAndGotoActivity(page);
  60  |     await txn.transactionTable.waitFor({ state: 'attached', timeout: 25000 });
  61  |     await expect(txn.transactionTable).toBeVisible();
  62  |   });
  63  |   test('TC-TXN-06 | Transaction table has at least one row', async ({ page }) => {
  64  |     const txn = await loginAndGotoActivity(page);
  65  |     await txn.transactionTable.waitFor({ state: 'attached', timeout: 25000 });
  66  |     await expect(async () => {
  67  |       const count = await txn.getTransactionRowCount();
  68  |       expect(count).toBeGreaterThanOrEqual(1);
  69  |     }).toPass({ timeout: 20000 });
  70  |   });
  71  |   test('TC-TXN-07 | Transaction table content is not empty', async ({ page }) => {
  72  |     const txn = await loginAndGotoActivity(page);
  73  |     await txn.transactionTable.waitFor({ state: 'attached', timeout: 25000 });
  74  |     await expect(async () => {
  75  |       const text = await txn.transactionTable.innerText();
  76  |       expect(text.trim().length).toBeGreaterThan(0);
  77  |     }).toPass({ timeout: 15000 });
  78  |   });
  79  |   test('TC-TXN-08 | Transaction table has Date column header', async ({ page }) => {
  80  |     const txn = await loginAndGotoActivity(page);
  81  |     await txn.transactionTable.waitFor({ state: 'attached', timeout: 25000 });
  82  |     const headers = await txn.transactionTable.locator('thead th').allInnerTexts();
  83  |     const hasDate = headers.some(h => h.toLowerCase().includes('date'));
  84  |     expect(hasDate).toBe(true);
  85  |   });
  86  | });
  87  | 
  88  | test.describe('Block 3 — Filter Controls', () => {
  89  |   test('TC-TXN-09 | Activity month dropdown is visible', async ({ page }) => {
  90  |     const txn = await loginAndGotoActivity(page);
  91  |     await txn.activitySelect.waitFor({ state: 'visible', timeout: 25000 });
  92  |     await expect(txn.activitySelect).toBeVisible();
  93  |   });
  94  |   test('TC-TXN-10 | Transaction type dropdown is visible', async ({ page }) => {
  95  |     const txn = await loginAndGotoActivity(page);
  96  |     await txn.typeSelect.waitFor({ state: 'visible', timeout: 25000 });
  97  |     await expect(txn.typeSelect).toBeVisible();
  98  |   });
  99  |   test('TC-TXN-11 | Go button for filter is visible', async ({ page }) => {
  100 |     const txn = await loginAndGotoActivity(page);
  101 |     await txn.findButton.waitFor({ state: 'visible', timeout: 25000 });
  102 |     await expect(txn.findButton).toBeVisible();
  103 |   });
  104 |   test('TC-TXN-12 | Clicking Go button keeps page on activity URL', async ({ page }) => {
  105 |     const txn = await loginAndGotoActivity(page);
  106 |     await txn.findButton.waitFor({ state: 'visible', timeout: 25000 });
  107 |     await txn.findButton.click();
  108 |     await page.waitForLoadState('domcontentloaded');
  109 |     await expect(async () => {
  110 |       const content = await txn.getRightPanelText();
  111 |       expect(content.length).toBeGreaterThan(0);
  112 |     }).toPass({ timeout: 15000 });
  113 |   });
  114 | });
  115 | 
  116 | test.describe('Block 4 — Amount Filter', () => {
```