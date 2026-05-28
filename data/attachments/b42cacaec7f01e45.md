# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile.spec.js >> Block 1 — Page Load >> TC-PROF-01 | Profile page loads after login
- Location: tests/profile.spec.js:22:3

# Error details

```
TimeoutError: locator.fill: Timeout 20000ms exceeded.
Call log:
  - waiting for locator('input[name="username"]')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - heading "Error 1015" [level=1] [ref=e5]
    - generic [ref=e6]: "Ray ID: a02efc865bb82816 •"
    - generic [ref=e7]: 2026-05-28 17:30:17 UTC
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
      - strong [ref=e22]: a02efc865bb82816
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
  1   | // pages/AuthPage.js
  2   | // Candidate: Siva
  3   | 
  4   | const BasePage = require('./BasePage');
  5   | 
  6   | class AuthPage extends BasePage {
  7   |   constructor(page) {
  8   |     super(page);
  9   | 
  10  |     // Login panel
  11  |     this.usernameInput  = page.locator('input[name="username"]');
  12  |     this.passwordInput  = page.locator('input[name="password"]');
  13  |     this.loginButton    = page.locator('input[type="submit"][value="Log In"]');
  14  | 
  15  |     // loginError: parabank renders the error inside #rightPanel as a <p class="error">
  16  |     // OR as a <b class="error"> depending on browser/page state.
  17  |     // Using #rightPanel .error ensures we only match the real error message
  18  |     // and not any stray .error element elsewhere on the page (e.g. form validation
  19  |     // spans that are present but hidden on the login page itself).
  20  |     this.loginError = page.locator('#rightPanel .error');
  21  | 
  22  |     this.loginPanel = page.locator('#loginPanel');
  23  | 
  24  |     // Top-nav links
  25  |     // logout: parabank uses both /logout.htm and LogoutServlet depending on version
  26  |     this.logoutLink   = page.locator('a[href*="logout"], a[href*="Logout"]').first();
  27  |     this.registerLink = page.locator('a[href*="register"]');
  28  | 
  29  |     // Registration form — all fields rendered by JS after DOM load
  30  |     this.firstNameInput   = page.locator('input[id="customer.firstName"]');
  31  |     this.lastNameInput    = page.locator('input[id="customer.lastName"]');
  32  |     this.addressInput     = page.locator('input[id="customer.address.street"]');
  33  |     this.cityInput        = page.locator('input[id="customer.address.city"]');
  34  |     this.stateInput       = page.locator('input[id="customer.address.state"]');
  35  |     this.zipCodeInput     = page.locator('input[id="customer.address.zipCode"]');
  36  |     this.phoneInput       = page.locator('input[id="customer.phoneNumber"]');
  37  |     this.ssnInput         = page.locator('input[id="customer.ssn"]');
  38  |     this.regUsernameInput = page.locator('input[id="customer.username"]');
  39  |     this.regPasswordInput = page.locator('input[id="customer.password"]');
  40  |     this.regConfirmInput  = page.locator('input[id="repeatedPassword"]');
  41  |     this.registerSubmit   = page.locator('input[value="Register"]');
  42  | 
  43  |     // Post-login
  44  |     this.welcomeMessage       = page.locator('#leftPanel p.smallText');
  45  |     this.accountServicesTitle = page.locator('#leftPanel h2').first();
  46  |     this.rightPanelTitle      = page.locator('#rightPanel h1.title');
  47  |   }
  48  | 
  49  |   async gotoHome()     { await this.navigate('/parabank/index.htm'); }
  50  | 
  51  |   async gotoRegister() {
  52  |     await this.navigate('/parabank/register.htm');
  53  |     // The registration form is rendered by JavaScript after DOM load.
  54  |     // We must wait for at least the first field to be present before
  55  |     // returning — otherwise assertions in the spec fire before the form
  56  |     // is in the DOM, failing on all three browsers.
  57  |     await this.firstNameInput.waitFor({ state: 'visible', timeout: 20000 });
  58  |   }
  59  | 
  60  |   async login(username, password) {
  61  |     await this.gotoHome();
> 62  |     await this.usernameInput.fill(username);
      |                              ^ TimeoutError: locator.fill: Timeout 20000ms exceeded.
  63  |     await this.passwordInput.fill(password);
  64  |     await this.loginButton.click();
  65  |     await this.page.waitForLoadState('domcontentloaded');
  66  |   }
  67  | 
  68  |   async logout() {
  69  |     await this.logoutLink.click();
  70  |     // Wait for the URL to change to index/login before returning.
  71  |     // A plain domcontentloaded sometimes resolves before the redirect
  72  |     // completes on Firefox/WebKit, causing the loginPanel assertion to race.
  73  |     await this.page.waitForURL(/index|login/, { timeout: 30000 });
  74  |     await this.page.waitForLoadState('domcontentloaded');
  75  |     // Ensure the login panel is actually in the DOM before handing back.
  76  |     await this.loginPanel.waitFor({ state: 'visible', timeout: 15000 });
  77  |   }
  78  | 
  79  |   async register(user) {
  80  |     await this.gotoRegister();
  81  |     await this.firstNameInput.fill(user.firstName);
  82  |     await this.lastNameInput.fill(user.lastName);
  83  |     await this.addressInput.fill(user.address);
  84  |     await this.cityInput.fill(user.city);
  85  |     await this.stateInput.fill(user.state);
  86  |     await this.zipCodeInput.fill(user.zipCode);
  87  |     await this.phoneInput.fill(user.phone);
  88  |     await this.ssnInput.fill(user.ssn);
  89  |     await this.regUsernameInput.fill(user.username);
  90  |     await this.regPasswordInput.fill(user.password);
  91  |     await this.regConfirmInput.fill(user.confirmPassword);
  92  |     await this.registerSubmit.click();
  93  |     await this.page.waitForLoadState('domcontentloaded');
  94  |   }
  95  | 
  96  |   async isLoggedIn() {
  97  |     return this.logoutLink.isVisible();
  98  |   }
  99  | 
  100 |   async getErrorText() {
  101 |     const visible = await this.loginError.isVisible();
  102 |     return visible ? this.loginError.innerText() : '';
  103 |   }
  104 | 
  105 |   async getWelcomeText() {
  106 |     try {
  107 |       return await this.rightPanelTitle.innerText();
  108 |     } catch {
  109 |       return '';
  110 |     }
  111 |   }
  112 | }
  113 | 
  114 | module.exports = AuthPage;
```