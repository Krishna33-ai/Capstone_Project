# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: loan.spec.js >> Block 6 — Input Validation & UI State >> TC-LOAN-20 | Apply Now button has correct input type
- Location: tests/loan.spec.js:182:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "submit"
Received: "button"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
        - paragraph [ref=e29]: Welcome John Smith
        - heading "Account Services" [level=2] [ref=e30]
        - list [ref=e31]:
          - listitem [ref=e32]:
            - link "Open New Account" [ref=e33]:
              - /url: openaccount.htm
          - listitem [ref=e34]:
            - link "Accounts Overview" [ref=e35]:
              - /url: overview.htm
          - listitem [ref=e36]:
            - link "Transfer Funds" [ref=e37]:
              - /url: transfer.htm
          - listitem [ref=e38]:
            - link "Bill Pay" [ref=e39]:
              - /url: billpay.htm
          - listitem [ref=e40]:
            - link "Find Transactions" [ref=e41]:
              - /url: findtrans.htm
          - listitem [ref=e42]:
            - link "Update Contact Info" [ref=e43]:
              - /url: updateprofile.htm
          - listitem [ref=e44]:
            - link "Request Loan" [ref=e45]:
              - /url: requestloan.htm
          - listitem [ref=e46]:
            - link "Log Out" [ref=e47]:
              - /url: logout.htm
      - generic [ref=e50]:
        - heading "Apply for a Loan" [level=1] [ref=e51]
        - table [ref=e53]:
          - rowgroup [ref=e54]:
            - 'row "Loan Amount: $" [ref=e55]':
              - 'cell "Loan Amount: $" [ref=e56]'
              - cell [ref=e57]:
                - textbox [ref=e58]
              - cell [ref=e59]
            - 'row "Down Payment: $" [ref=e60]':
              - 'cell "Down Payment: $" [ref=e61]'
              - cell [ref=e62]:
                - textbox [ref=e63]
              - cell [ref=e64]
            - 'row "From account #: 12789" [ref=e65]':
              - 'cell "From account #:" [ref=e66]'
              - cell "12789" [ref=e67]:
                - combobox [ref=e68]:
                  - option "12789" [selected]
                  - option "12900"
                  - option "13011"
                  - option "13122"
                  - option "13233"
                  - option "13344"
                  - option "54321"
                  - option "12345"
                  - option "12456"
                  - option "12678"
                  - option "12567"
                  - option "14010"
              - cell [ref=e69]
            - row "Apply Now" [ref=e70]:
              - cell [ref=e71]
              - cell "Apply Now" [ref=e72]:
                - button "Apply Now" [ref=e73] [cursor=pointer]
  - generic [ref=e75]:
    - list [ref=e76]:
      - listitem [ref=e77]:
        - link "Home" [ref=e78]:
          - /url: index.htm
        - text: "|"
      - listitem [ref=e79]:
        - link "About Us" [ref=e80]:
          - /url: about.htm
        - text: "|"
      - listitem [ref=e81]:
        - link "Services" [ref=e82]:
          - /url: services.htm
        - text: "|"
      - listitem [ref=e83]:
        - link "Products" [ref=e84]:
          - /url: http://www.parasoft.com/jsp/products.jsp
        - text: "|"
      - listitem [ref=e85]:
        - link "Locations" [ref=e86]:
          - /url: http://www.parasoft.com/jsp/pr/contacts.jsp
        - text: "|"
      - listitem [ref=e87]:
        - link "Forum" [ref=e88]:
          - /url: http://forums.parasoft.com/
        - text: "|"
      - listitem [ref=e89]:
        - link "Site Map" [ref=e90]:
          - /url: sitemap.htm
        - text: "|"
      - listitem [ref=e91]:
        - link "Contact Us" [ref=e92]:
          - /url: contact.htm
    - paragraph [ref=e93]: © Parasoft. All rights reserved.
    - list [ref=e94]:
      - listitem [ref=e95]: "Visit us at:"
      - listitem [ref=e96]:
        - link "www.parasoft.com" [ref=e97]:
          - /url: http://www.parasoft.com/
```

# Test source

```ts
  87  |     await loan.applyForLoan(TEST_DATA.loanData.validAmount, TEST_DATA.loanData.validDownPayment);
  88  |     await expect(async () => {
  89  |       expect((await loan.getRightPanelText()).toLowerCase()).toMatch(/loan|approved|denied|error/);
  90  |     }).toPass({ timeout: 30000 });
  91  |   });
  92  |   test('TC-LOAN-12 | Applying with large amount shows response', async ({ page }) => {
  93  |     const loan = await loginAndGoto(page);
  94  |     await waitForFromAccount(loan);
  95  |     await loan.applyForLoan(TEST_DATA.loanData.largeAmount, TEST_DATA.loanData.largeDownPayment);
  96  |     await expect(async () => {
  97  |       expect((await loan.getRightPanelText()).length).toBeGreaterThan(0);
  98  |     }).toPass({ timeout: 30000 });
  99  |   });
  100 |   // FIX TC-LOAN-13: applyForLoan now uses beforeText change-detection (LoanPage.js)
  101 |   test('TC-LOAN-13 | Applying with zero amount shows response', async ({ page }) => {
  102 |     const loan = await loginAndGoto(page);
  103 |     await waitForFromAccount(loan);
  104 |     await loan.applyForLoan(TEST_DATA.loanData.zeroAmount, TEST_DATA.loanData.zeroDownPayment);
  105 |     await expect(async () => {
  106 |       expect((await loan.getRightPanelText()).length).toBeGreaterThan(0);
  107 |     }).toPass({ timeout: 30000 });
  108 |   });
  109 | });
  110 | 
  111 | test.describe('Block 5 — Navigation', () => {
  112 |   // FIX TC-LOAN-14/15: loanLink now uses combined text + href selector (LoanPage.js)
  113 |   test('TC-LOAN-14 | Loan request link is visible in left nav', async ({ page }) => {
  114 |     const auth = new AuthPage(page);
  115 |     await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  116 |     await page.waitForLoadState('domcontentloaded');
  117 |     const loan = new LoanPage(page);
  118 |     await loan.loanLink.waitFor({ state: 'visible', timeout: 60000 });
  119 |     await expect(loan.loanLink).toBeVisible();
  120 |   });
  121 |   test('TC-LOAN-15 | Loan page accessible via left nav link', async ({ page }) => {
  122 |     const auth = new AuthPage(page);
  123 |     await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  124 |     await page.waitForLoadState('domcontentloaded');
  125 |     const loan = new LoanPage(page);
  126 |     await loan.loanLink.waitFor({ state: 'visible', timeout: 60000 });
  127 |     await loan.loanLink.click();
  128 |     await page.waitForLoadState('domcontentloaded');
  129 |     await expect(page).toHaveURL(/requestloan/);
  130 |   });
  131 | });
  132 | 
  133 | // ─────────────────────────────────────────────────────────────────────────────
  134 | // Block 6 — Additional Safe Test Cases (TC-LOAN-16 to TC-LOAN-20)
  135 | // These 5 tests are designed to pass reliably on all 3 browsers.
  136 | // They verify UI state and input behaviour without submitting the loan form,
  137 | // so they never depend on async Angular result rendering or server-side state.
  138 | // ─────────────────────────────────────────────────────────────────────────────
  139 | test.describe('Block 6 — Input Validation & UI State', () => {
  140 | 
  141 |   // TC-LOAN-16: Verifies the down payment input accepts a numeric string.
  142 |   // Safe: fill() + inputValue() is a pure in-browser check — no server call.
  143 |   test('TC-LOAN-16 | Down payment input accepts numeric value', async ({ page }) => {
  144 |     const loan = await loginAndGoto(page);
  145 |     await loan.downPaymentInput.fill(TEST_DATA.loanData.validDownPayment);
  146 |     const value = await loan.downPaymentInput.inputValue();
  147 |     expect(value).toBe(TEST_DATA.loanData.validDownPayment);
  148 |   });
  149 | 
  150 |   // TC-LOAN-17: Verifies the loan form has exactly the expected visible inputs.
  151 |   // Safe: purely counts DOM elements — no submission, no async result.
  152 |   test('TC-LOAN-17 | Loan form has required input fields', async ({ page }) => {
  153 |     const loan = await loginAndGoto(page);
  154 |     await expect(loan.loanAmountInput).toBeVisible();
  155 |     await expect(loan.downPaymentInput).toBeVisible();
  156 |     await expect(loan.fromAccountSelect).toBeVisible();
  157 |     await expect(loan.applyButton).toBeVisible();
  158 |   });
  159 | 
  160 |   // TC-LOAN-18: Verifies fromAccountSelect is an HTML <select> with an id.
  161 |   // Safe: reads a DOM attribute — no side effects.
  162 |   test('TC-LOAN-18 | From account dropdown has correct element id', async ({ page }) => {
  163 |     const loan = await loginAndGoto(page);
  164 |     await waitForFromAccount(loan);
  165 |     const id = await loan.fromAccountSelect.getAttribute('id');
  166 |     expect(id).toBe('fromAccountId');
  167 |   });
  168 | 
  169 |   // TC-LOAN-19: Verifies the loan amount input can be cleared and re-filled.
  170 |   // Safe: two sequential fill() calls — pure client-side, no form submission.
  171 |   test('TC-LOAN-19 | Loan amount input can be cleared and re-entered', async ({ page }) => {
  172 |     const loan = await loginAndGoto(page);
  173 |     await loan.loanAmountInput.fill(TEST_DATA.loanData.validAmount);
  174 |     await loan.loanAmountInput.fill('');
  175 |     await loan.loanAmountInput.fill(TEST_DATA.loanData.largeAmount);
  176 |     const value = await loan.loanAmountInput.inputValue();
  177 |     expect(value).toBe(TEST_DATA.loanData.largeAmount);
  178 |   });
  179 | 
  180 |   // TC-LOAN-20: Verifies the Apply Now button has the correct input type (submit).
  181 |   // Safe: reads a DOM attribute — no side effects, no navigation.
  182 |   test('TC-LOAN-20 | Apply Now button has correct input type', async ({ page }) => {
  183 |     const loan = await loginAndGoto(page);
  184 |     await loan.applyButton.waitFor({ state: 'visible', timeout: 60000 });
  185 |     const type = await loan.applyButton.getAttribute('type');
  186 |     // ParaBank renders the button as <input type="submit" value="Apply Now">
> 187 |     expect(type).toBe('submit');
      |                  ^ Error: expect(received).toBe(expected) // Object.is equality
  188 |   });
  189 | });
```