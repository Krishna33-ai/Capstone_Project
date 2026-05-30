# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Block 4 — Logout >> TC-AUTH-14 | URL contains index or login after logout
- Location: tests/auth.spec.js:119:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('a[href*="logout"]') to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - heading "Error 1015" [level=1] [ref=e5]
    - generic [ref=e6]: "Ray ID: a03bfa082da2c563 •"
    - generic [ref=e7]: 2026-05-30 07:20:30 UTC
    - heading "You are being rate limited" [level=2] [ref=e8]
  - generic [ref=e10]:
    - heading "What happened?" [level=2] [ref=e11]
    - paragraph [ref=e12]: The owner of this website (parabank.parasoft.com) has banned you temporarily from accessing this website.
    - paragraph [ref=e13]:
      - text: Please see
      - link "https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1015/" [ref=e14] [cursor=pointer]:
        - /url: https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1015/
      - text: for more details.
  - generic [ref=e16]:
    - text: Was this page helpful?
    - button "Yes" [ref=e17] [cursor=pointer]
    - button "No" [ref=e18] [cursor=pointer]
  - paragraph [ref=e20]:
    - generic [ref=e21]:
      - text: "Cloudflare Ray ID:"
      - strong [ref=e22]: a03bfa082da2c563
    - text: •
    - generic [ref=e23]:
      - text: "Your IP:"
      - button "Click to reveal" [ref=e24] [cursor=pointer]
      - text: •
    - generic [ref=e25]:
      - text: Performance & security by
      - link "Cloudflare" [ref=e26] [cursor=pointer]:
        - /url: https://www.cloudflare.com/5xx-error-landing
```

# Test source

```ts
  23  | 
  24  |   test('TC-AUTH-03 | Password input is visible', async ({ page }) => {
  25  |     const auth = new AuthPage(page);
  26  |     await auth.gotoHome();
  27  |     await expect(auth.passwordInput).toBeVisible();
  28  |   });
  29  | 
  30  |   test('TC-AUTH-04 | Log In button is visible', async ({ page }) => {
  31  |     const auth = new AuthPage(page);
  32  |     await auth.gotoHome();
  33  |     await expect(auth.loginButton).toBeVisible();
  34  |   });
  35  | 
  36  |   test('TC-AUTH-05 | Register link is visible on homepage', async ({ page }) => {
  37  |     const auth = new AuthPage(page);
  38  |     await auth.gotoHome();
  39  |     await expect(auth.registerLink).toBeVisible();
  40  |   });
  41  | });
  42  | 
  43  | 
  44  | test.describe('Block 2 — Valid Login', () => {
  45  | 
  46  |   test('TC-AUTH-06 | Valid credentials redirect to account overview', async ({ page }) => {
  47  |     const auth = new AuthPage(page);
  48  |     await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  49  |     await expect(page).toHaveURL(/overview/);
  50  |   });
  51  | 
  52  |   test('TC-AUTH-07 | Logout link appears after successful login', async ({ page }) => {
  53  |     const auth = new AuthPage(page);
  54  |     await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  55  |     await expect(auth.logoutLink).toBeVisible();
  56  |   });
  57  | 
  58  |   test('TC-AUTH-08 | Account Services heading visible after login', async ({ page }) => {
  59  |     const auth = new AuthPage(page);
  60  |     await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  61  |     await expect(auth.accountServicesTitle).toBeVisible();
  62  |   });
  63  | });
  64  | 
  65  | 
  66  | test.describe('Block 3 — Invalid Login', () => {
  67  | 
  68  |   test('TC-AUTH-09 | Wrong password shows error', async ({ page }) => {
  69  |     const auth = new AuthPage(page);
  70  |     const { username, password } = TEST_DATA.invalidCredentials.wrongPassword;
  71  |     await auth.login(username, password);
  72  |     // Parabank renders the error as a hidden <p class="error"> inside #rightPanel.
  73  |     // It is present in the DOM but display:none — so we wait for it to be
  74  |     // attached (not visible) and then confirm it has non-empty text content.
  75  |     await auth.loginError.waitFor({ state: 'attached', timeout: 20000 });
  76  |     const text = await auth.loginError.innerText();
  77  |     expect(text.trim().length).toBeGreaterThan(0);
  78  |   });
  79  | 
  80  |   test('TC-AUTH-10 | Wrong username shows error', async ({ page }) => {
  81  |     const auth = new AuthPage(page);
  82  |     const { username, password } = TEST_DATA.invalidCredentials.wrongUsername;
  83  |     await auth.login(username, password);
  84  |     await auth.loginError.waitFor({ state: 'attached', timeout: 20000 });
  85  |     const text = await auth.loginError.innerText();
  86  |     expect(text.trim().length).toBeGreaterThan(0);
  87  |   });
  88  | 
  89  |   test('TC-AUTH-11 | Empty credentials show error', async ({ page }) => {
  90  |     const auth = new AuthPage(page);
  91  |     const { username, password } = TEST_DATA.invalidCredentials.emptyBoth;
  92  |     await auth.login(username, password);
  93  |     await auth.loginError.waitFor({ state: 'attached', timeout: 20000 });
  94  |     const text = await auth.loginError.innerText();
  95  |     expect(text.trim().length).toBeGreaterThan(0);
  96  |   });
  97  | 
  98  |   test('TC-AUTH-12 | SQL injection attempt does not log in', async ({ page }) => {
  99  |     const auth = new AuthPage(page);
  100 |     const { username, password } = TEST_DATA.invalidCredentials.sqlInjection;
  101 |     await auth.login(username, password);
  102 |     const loggedIn = await auth.isLoggedIn();
  103 |     expect(loggedIn).toBe(false);
  104 |   });
  105 | });
  106 | 
  107 | 
  108 | test.describe('Block 4 — Logout', () => {
  109 | 
  110 |   test('TC-AUTH-13 | Logout returns to login page', async ({ page }) => {
  111 |     const auth = new AuthPage(page);
  112 |     await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  113 |     await page.waitForLoadState('domcontentloaded');
  114 |     await auth.logoutLink.waitFor({ state: 'visible', timeout: 15000 });
  115 |     await auth.logout();
  116 |     await expect(auth.loginPanel).toBeVisible({ timeout: 15000 });
  117 |   });
  118 | 
  119 |   test('TC-AUTH-14 | URL contains index or login after logout', async ({ page }) => {
  120 |     const auth = new AuthPage(page);
  121 |     await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  122 |     await page.waitForLoadState('domcontentloaded');
> 123 |     await auth.logoutLink.waitFor({ state: 'visible', timeout: 15000 });
      |                           ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  124 |     await auth.logout();
  125 |     await expect(page).toHaveURL(/index|login/, { timeout: 15000 });
  126 |   });
  127 | });
  128 | 
  129 | 
  130 | test.describe('Block 5 — Registration Page', () => {
  131 | 
  132 |   test('TC-AUTH-15 | Register page loads', async ({ page }) => {
  133 |     const auth = new AuthPage(page);
  134 |     await auth.gotoRegister();
  135 |     await expect(page).toHaveURL(/register/);
  136 |   });
  137 | 
  138 |   test('TC-AUTH-16 | First name field is visible on register page', async ({ page }) => {
  139 |     const auth = new AuthPage(page);
  140 |     await auth.gotoRegister();
  141 |     await expect(auth.firstNameInput).toBeVisible({ timeout: 15000 });
  142 |   });
  143 | 
  144 |   test('TC-AUTH-17 | Register button is visible on register page', async ({ page }) => {
  145 |     const auth = new AuthPage(page);
  146 |     await auth.gotoRegister();
  147 |     await auth.registerSubmit.waitFor({ state: 'visible', timeout: 15000 });
  148 |     await expect(auth.registerSubmit).toBeVisible({ timeout: 15000 });
  149 |   });
  150 | });
```