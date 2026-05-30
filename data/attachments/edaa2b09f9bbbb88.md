# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bill.spec.js >> Block 5 — Navigation >> TC-BILL-14 | Bill pay link is visible in left nav after login
- Location: tests/bill.spec.js:109:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 60000ms exceeded.
Call log:
  - waiting for locator('a[href*="billpay"]') to be visible

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
        - paragraph [ref=e46]: Please enter a username and password.
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
  14  |   const bill = new BillPage(page);
  15  |   await bill.gotoBillPay();
  16  |   return bill;
  17  | }
  18  | 
  19  | async function waitForFromAccount(bill) {
  20  |   await bill.fromAccountSelect.waitFor({ state: 'visible', timeout: 60000 });
  21  |   await expect(bill.fromAccountSelect.locator('option')).not.toHaveCount(0, { timeout: 60000 });
  22  | }
  23  | 
  24  | test.describe('Block 1 — Page Load', () => {
  25  |   test('TC-BILL-01 | Bill pay page loads after login', async ({ page }) => {
  26  |     await loginAndGoto(page);
  27  |     await expect(page).toHaveURL(/billpay/);
  28  |   });
  29  |   test('TC-BILL-02 | Right panel is visible on bill pay page', async ({ page }) => {
  30  |     const bill = await loginAndGoto(page);
  31  |     await expect(bill.rightPanel).toBeVisible();
  32  |   });
  33  |   test('TC-BILL-03 | Bill pay page title contains relevant text', async ({ page }) => {
  34  |     const bill = await loginAndGoto(page);
  35  |     await expect(async () => {
  36  |       expect((await bill.getRightPanelText()).toLowerCase()).toMatch(/bill|payment|payee/);
  37  |     }).toPass({ timeout: 20000 });
  38  |   });
  39  | });
  40  | 
  41  | test.describe('Block 2 — Form Fields', () => {
  42  |   test('TC-BILL-04 | Payee name input is visible', async ({ page }) => {
  43  |     const bill = await loginAndGoto(page);
  44  |     await expect(bill.payeeNameInput).toBeVisible();
  45  |   });
  46  |   test('TC-BILL-05 | Address input is visible', async ({ page }) => {
  47  |     const bill = await loginAndGoto(page);
  48  |     await expect(bill.addressInput).toBeVisible();
  49  |   });
  50  |   test('TC-BILL-06 | Amount input is visible', async ({ page }) => {
  51  |     const bill = await loginAndGoto(page);
  52  |     await expect(bill.amountInput).toBeVisible();
  53  |   });
  54  |   test('TC-BILL-07 | Account number input is visible', async ({ page }) => {
  55  |     const bill = await loginAndGoto(page);
  56  |     await expect(bill.accountInput).toBeVisible();
  57  |   });
  58  |   test('TC-BILL-08 | Send Payment button is visible', async ({ page }) => {
  59  |     const bill = await loginAndGoto(page);
  60  |     await bill.sendButton.waitFor({ state: 'visible', timeout: 60000 });
  61  |     await expect(bill.sendButton).toBeVisible();
  62  |   });
  63  | });
  64  | 
  65  | test.describe('Block 3 — From Account', () => {
  66  |   test('TC-BILL-09 | From account dropdown is visible', async ({ page }) => {
  67  |     const bill = await loginAndGoto(page);
  68  |     await bill.fromAccountSelect.waitFor({ state: 'visible', timeout: 60000 });
  69  |     await expect(bill.fromAccountSelect).toBeVisible();
  70  |   });
  71  |   test('TC-BILL-10 | From account dropdown loads accounts', async ({ page }) => {
  72  |     const bill = await loginAndGoto(page);
  73  |     await waitForFromAccount(bill);
  74  |     expect(await bill.getFromAccountCount()).toBeGreaterThanOrEqual(1);
  75  |   });
  76  | });
  77  | 
  78  | test.describe('Block 4 — Payment Submit', () => {
  79  |   test('TC-BILL-11 | Submitting valid payment shows response', async ({ page }) => {
  80  |     const bill = await loginAndGoto(page);
  81  |     await waitForFromAccount(bill);
  82  |     await bill.fillPayeeDetails(TEST_DATA.payeeData);
  83  |     await bill.sendButton.click();
  84  |     await page.waitForLoadState('domcontentloaded');
  85  |     await expect(async () => {
  86  |       expect((await bill.getRightPanelText()).length).toBeGreaterThan(0);
  87  |     }).toPass({ timeout: 30000 });
  88  |   });
  89  |   test('TC-BILL-12 | Payment response contains payment related text', async ({ page }) => {
  90  |     const bill = await loginAndGoto(page);
  91  |     await waitForFromAccount(bill);
  92  |     await bill.fillPayeeDetails(TEST_DATA.payeeData);
  93  |     await bill.sendButton.click();
  94  |     await expect(async () => {
  95  |       expect((await bill.getRightPanelText()).toLowerCase()).toMatch(/payment|bill|complete|error/);
  96  |     }).toPass({ timeout: 30000 });
  97  |   });
  98  |   test('TC-BILL-13 | Submitting empty form shows page response', async ({ page }) => {
  99  |     const bill = await loginAndGoto(page);
  100 |     await bill.sendButton.click();
  101 |     await page.waitForLoadState('domcontentloaded');
  102 |     await expect(async () => {
  103 |       expect((await bill.getRightPanelText()).length).toBeGreaterThan(0);
  104 |     }).toPass({ timeout: 20000 });
  105 |   });
  106 | });
  107 | 
  108 | test.describe('Block 5 — Navigation', () => {
  109 |   test('TC-BILL-14 | Bill pay link is visible in left nav after login', async ({ page }) => {
  110 |     const auth = new AuthPage(page);
  111 |     await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  112 |     await page.waitForLoadState('domcontentloaded');
  113 |     const bill = new BillPage(page);
> 114 |     await bill.billPayLink.waitFor({ state: 'visible', timeout: 60000 });
      |                            ^ TimeoutError: locator.waitFor: Timeout 60000ms exceeded.
  115 |     await expect(bill.billPayLink).toBeVisible();
  116 |   });
  117 |   test('TC-BILL-15 | Bill pay page accessible via left nav link', async ({ page }) => {
  118 |     const auth = new AuthPage(page);
  119 |     await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  120 |     await page.waitForLoadState('domcontentloaded');
  121 |     const bill = new BillPage(page);
  122 |     await bill.billPayLink.waitFor({ state: 'visible', timeout: 60000 });
  123 |     await bill.billPayLink.click();
  124 |     await page.waitForLoadState('domcontentloaded');
  125 |     await expect(page).toHaveURL(/billpay/);
  126 |   });
  127 | });
  128 | 
  129 | // ─────────────────────────────────────────────────────────────────────────────
  130 | // Block 6 — Additional Safe Test Cases (TC-BILL-16 to TC-BILL-20)
  131 | // Pure client-side checks — no form submission, no async result rendering.
  132 | // Each test verifies DOM attributes or input behaviour only, making them
  133 | // reliable across all 3 browsers regardless of server speed.
  134 | // ─────────────────────────────────────────────────────────────────────────────
  135 | test.describe('Block 6 — Input Validation & UI State', () => {
  136 | 
  137 |   // TC-BILL-16: Verifies the payee name input accepts and retains a text value.
  138 |   // Safe: fill() + inputValue() is a pure in-browser check — no server call.
  139 |   test('TC-BILL-16 | Payee name input accepts and retains text value', async ({ page }) => {
  140 |     const bill = await loginAndGoto(page);
  141 |     await bill.payeeNameInput.fill(TEST_DATA.payeeData.name);
  142 |     const value = await bill.payeeNameInput.inputValue();
  143 |     expect(value).toBe(TEST_DATA.payeeData.name);
  144 |   });
  145 | 
  146 |   // TC-BILL-17: Verifies the amount input accepts and retains a numeric string.
  147 |   // Safe: fill() + inputValue() only — no form submission.
  148 |   test('TC-BILL-17 | Amount input accepts numeric value', async ({ page }) => {
  149 |     const bill = await loginAndGoto(page);
  150 |     await bill.amountInput.fill(TEST_DATA.payeeData.amount);
  151 |     const value = await bill.amountInput.inputValue();
  152 |     expect(value).toBe(TEST_DATA.payeeData.amount);
  153 |   });
  154 | 
  155 |   // TC-BILL-18: Verifies the fromAccountSelect is a proper <select> element
  156 |   // with the correct name attribute the server expects.
  157 |   // Safe: reads a DOM attribute — no side effects.
  158 |   test('TC-BILL-18 | From account dropdown has correct name attribute', async ({ page }) => {
  159 |     const bill = await loginAndGoto(page);
  160 |     await waitForFromAccount(bill);
  161 |     const name = await bill.fromAccountSelect.getAttribute('name');
  162 |     expect(name).toBe('fromAccountId');
  163 |   });
  164 | 
  165 |   // TC-BILL-19: Verifies the account number input can be cleared and re-filled.
  166 |   // Safe: two sequential fill() calls — no form submission.
  167 |   test('TC-BILL-19 | Account number input can be cleared and re-entered', async ({ page }) => {
  168 |     const bill = await loginAndGoto(page);
  169 |     await bill.accountInput.fill(TEST_DATA.payeeData.account);
  170 |     await bill.accountInput.fill('');
  171 |     await bill.accountInput.fill('99999');
  172 |     const value = await bill.accountInput.inputValue();
  173 |     expect(value).toBe('99999');
  174 |   });
  175 | 
  176 |   // TC-BILL-20: Verifies the Send Payment button has the correct input type.
  177 |   // Safe: reads a DOM attribute — no navigation or server interaction.
  178 |   test('TC-BILL-20 | Send Payment button has correct input type', async ({ page }) => {
  179 |     const bill = await loginAndGoto(page);
  180 |     await bill.sendButton.waitFor({ state: 'visible', timeout: 60000 });
  181 |     const type = await bill.sendButton.getAttribute('type');
  182 |     // ParaBank renders the button as <input type="submit" value="Send Payment">
  183 |     expect(type).toBe('submit');
  184 |   });
  185 | });
```