# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: transaction.spec.js >> Block 2 — Transaction Table >> TC-TXN-06 | Transaction table has at least one row
- Location: tests/transaction.spec.js:63:3

# Error details

```
Error: expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 1
Received:    0

Call Log:
- Timeout 20000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
        - paragraph [ref=e29]: Welcome John Smith
        - heading "Account Services" [level=2] [ref=e30]
        - list [ref=e31]:
          - listitem [ref=e32]:
            - link "Open New Account" [ref=e33] [cursor=pointer]:
              - /url: openaccount.htm
          - listitem [ref=e34]:
            - link "Accounts Overview" [ref=e35] [cursor=pointer]:
              - /url: overview.htm
          - listitem [ref=e36]:
            - link "Transfer Funds" [ref=e37] [cursor=pointer]:
              - /url: transfer.htm
          - listitem [ref=e38]:
            - link "Bill Pay" [ref=e39] [cursor=pointer]:
              - /url: billpay.htm
          - listitem [ref=e40]:
            - link "Find Transactions" [ref=e41] [cursor=pointer]:
              - /url: findtrans.htm
          - listitem [ref=e42]:
            - link "Update Contact Info" [ref=e43] [cursor=pointer]:
              - /url: updateprofile.htm
          - listitem [ref=e44]:
            - link "Request Loan" [ref=e45] [cursor=pointer]:
              - /url: requestloan.htm
          - listitem [ref=e46]:
            - link "Log Out" [ref=e47] [cursor=pointer]:
              - /url: logout.htm
      - generic [ref=e49]:
        - generic [ref=e50]:
          - heading "Account Details" [level=1] [ref=e51]
          - table [ref=e52]:
            - rowgroup [ref=e53]:
              - 'row "Account Number: 13344" [ref=e54]':
                - cell "Account Number:" [ref=e55]
                - cell "13344" [ref=e56]
              - 'row "Account Type: CHECKING" [ref=e57]':
                - cell "Account Type:" [ref=e58]
                - cell "CHECKING" [ref=e59]
              - 'row "Balance: $5022.93" [ref=e60]':
                - cell "Balance:" [ref=e61]
                - cell "$5022.93" [ref=e62]
              - 'row "Available: $5022.93" [ref=e63]':
                - cell "Available:" [ref=e64]
                - cell "$5022.93" [ref=e65]
        - generic [ref=e66]:
          - heading "Account Activity" [level=1] [ref=e67]
          - table [ref=e69]:
            - rowgroup [ref=e70]:
              - 'row "Activity Period: All" [ref=e71]':
                - cell "Activity Period:" [ref=e72]
                - cell "All" [ref=e73]:
                  - combobox [ref=e74]:
                    - option "All" [selected]
                    - option "January"
                    - option "February"
                    - option "March"
                    - option "April"
                    - option "May"
                    - option "June"
                    - option "July"
                    - option "August"
                    - option "September"
                    - option "October"
                    - option "November"
                    - option "December"
              - 'row "Type: All" [ref=e75]':
                - cell "Type:" [ref=e76]
                - cell "All" [ref=e77]:
                  - combobox [ref=e78]:
                    - option "All" [selected]
                    - option "Credit"
                    - option "Debit"
              - row "Go" [ref=e79]:
                - cell [ref=e80]
                - cell "Go" [ref=e81]:
                  - button "Go" [ref=e82] [cursor=pointer]
          - paragraph [ref=e83]: No transactions found.
  - generic [ref=e85]:
    - list [ref=e86]:
      - listitem [ref=e87]:
        - link "Home" [ref=e88] [cursor=pointer]:
          - /url: index.htm
        - text: "|"
      - listitem [ref=e89]:
        - link "About Us" [ref=e90] [cursor=pointer]:
          - /url: about.htm
        - text: "|"
      - listitem [ref=e91]:
        - link "Services" [ref=e92] [cursor=pointer]:
          - /url: services.htm
        - text: "|"
      - listitem [ref=e93]:
        - link "Products" [ref=e94] [cursor=pointer]:
          - /url: http://www.parasoft.com/jsp/products.jsp
        - text: "|"
      - listitem [ref=e95]:
        - link "Locations" [ref=e96] [cursor=pointer]:
          - /url: http://www.parasoft.com/jsp/pr/contacts.jsp
        - text: "|"
      - listitem [ref=e97]:
        - link "Forum" [ref=e98] [cursor=pointer]:
          - /url: http://forums.parasoft.com/
        - text: "|"
      - listitem [ref=e99]:
        - link "Site Map" [ref=e100] [cursor=pointer]:
          - /url: sitemap.htm
        - text: "|"
      - listitem [ref=e101]:
        - link "Contact Us" [ref=e102] [cursor=pointer]:
          - /url: contact.htm
    - paragraph [ref=e103]: © Parasoft. All rights reserved.
    - list [ref=e104]:
      - listitem [ref=e105]: "Visit us at:"
      - listitem [ref=e106]:
        - link "www.parasoft.com" [ref=e107] [cursor=pointer]:
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
  16  |   await txn.accountLinks.first().waitFor({ state: 'visible', timeout: 30000 });
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
  60  |     await txn.transactionTable.waitFor({ state: 'visible', timeout: 25000 });
  61  |     await expect(txn.transactionTable).toBeVisible();
  62  |   });
  63  |   test('TC-TXN-06 | Transaction table has at least one row', async ({ page }) => {
  64  |     const txn = await loginAndGotoActivity(page);
  65  |     await txn.transactionTable.waitFor({ state: 'visible', timeout: 25000 });
  66  |     await expect(async () => {
  67  |       const count = await txn.getTransactionRowCount();
  68  |       expect(count).toBeGreaterThanOrEqual(1);
> 69  |     }).toPass({ timeout: 20000 });
      |        ^ Error: expect(received).toBeGreaterThanOrEqual(expected)
  70  |   });
  71  |   test('TC-TXN-07 | Transaction table content is not empty', async ({ page }) => {
  72  |     const txn = await loginAndGotoActivity(page);
  73  |     await txn.transactionTable.waitFor({ state: 'visible', timeout: 25000 });
  74  |     await expect(async () => {
  75  |       const text = await txn.transactionTable.innerText();
  76  |       expect(text.trim().length).toBeGreaterThan(0);
  77  |     }).toPass({ timeout: 15000 });
  78  |   });
  79  |   test('TC-TXN-08 | Transaction table has Date column header', async ({ page }) => {
  80  |     const txn = await loginAndGotoActivity(page);
  81  |     await txn.transactionTable.waitFor({ state: 'visible', timeout: 25000 });
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
  117 |   test('TC-TXN-13 | Amount search input is visible', async ({ page }) => {
  118 |     const txn = await loginAndGotoActivity(page);
  119 |     await expect(async () => {
  120 |       const content = await txn.getRightPanelText();
  121 |       expect(content.toLowerCase()).toMatch(/amount|transaction|balance/);
  122 |     }).toPass({ timeout: 15000 });
  123 |   });
  124 |   test('TC-TXN-14 | Find Transactions button is visible', async ({ page }) => {
  125 |     const txn = await loginAndGotoActivity(page);
  126 |     await txn.findButton.waitFor({ state: 'visible', timeout: 25000 });
  127 |     await expect(txn.findButton).toBeVisible();
  128 |   });
  129 |   test('TC-TXN-15 | Searching by amount returns page content', async ({ page }) => {
  130 |     const txn = await loginAndGotoActivity(page);
  131 |     await txn.findButton.waitFor({ state: 'visible', timeout: 25000 });
  132 |     await txn.findButton.click();
  133 |     await page.waitForLoadState('domcontentloaded');
  134 |     await expect(async () => {
  135 |       const content = await txn.getRightPanelText();
  136 |       expect(content.length).toBeGreaterThan(0);
  137 |     }).toPass({ timeout: 15000 });
  138 |   });
  139 | });
  140 | 
  141 | test.describe('Block 5 — Navigation', () => {
  142 |   test('TC-TXN-16 | Back to overview from activity page works', async ({ page }) => {
  143 |     const txn = await loginAndGotoActivity(page);
  144 |     await txn.overviewLink.waitFor({ state: 'visible', timeout: 20000 });
  145 |     await txn.overviewLink.click();
  146 |     await page.waitForLoadState('domcontentloaded');
  147 |     await expect(page).toHaveURL(/overview/);
  148 |   });
  149 |   test('TC-TXN-17 | Activity page accessible from account overview table', async ({ page }) => {
  150 |     const auth = new AuthPage(page);
  151 |     await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  152 |     await page.waitForLoadState('domcontentloaded');
  153 |     const txn = new TransactionPage(page);
  154 |     await txn.gotoOverview();
  155 |     await txn.accountLinks.first().waitFor({ state: 'visible', timeout: 30000 });
  156 |     await expect(txn.accountLinks.first()).toBeVisible();
  157 |     await txn.clickFirstAccount();
  158 |     await page.waitForLoadState('domcontentloaded');
  159 |     await expect(page).toHaveURL(/activity/);
  160 |   });
  161 | });
```