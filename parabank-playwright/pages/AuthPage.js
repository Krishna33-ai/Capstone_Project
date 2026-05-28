// pages/AuthPage.js
// Candidate: Siva

const BasePage = require('./BasePage');

class AuthPage extends BasePage {
  constructor(page) {
    super(page);

    // Login panel
    this.usernameInput  = page.locator('input[name="username"]');
    this.passwordInput  = page.locator('input[name="password"]');
    this.loginButton    = page.locator('input[type="submit"][value="Log In"]');

    // loginError: parabank renders the error inside #rightPanel as a <p class="error">
    // OR as a <b class="error"> depending on browser/page state.
    // Using #rightPanel .error ensures we only match the real error message
    // and not any stray .error element elsewhere on the page (e.g. form validation
    // spans that are present but hidden on the login page itself).
    this.loginError = page.locator('#rightPanel .error');

    this.loginPanel = page.locator('#loginPanel');

    // Top-nav links
    // logout: parabank uses both /logout.htm and LogoutServlet depending on version
    this.logoutLink   = page.locator('a[href*="logout"], a[href*="Logout"]').first();
    this.registerLink = page.locator('a[href*="register"]');

    // Registration form — all fields rendered by JS after DOM load
    this.firstNameInput   = page.locator('input[id="customer.firstName"]');
    this.lastNameInput    = page.locator('input[id="customer.lastName"]');
    this.addressInput     = page.locator('input[id="customer.address.street"]');
    this.cityInput        = page.locator('input[id="customer.address.city"]');
    this.stateInput       = page.locator('input[id="customer.address.state"]');
    this.zipCodeInput     = page.locator('input[id="customer.address.zipCode"]');
    this.phoneInput       = page.locator('input[id="customer.phoneNumber"]');
    this.ssnInput         = page.locator('input[id="customer.ssn"]');
    this.regUsernameInput = page.locator('input[id="customer.username"]');
    this.regPasswordInput = page.locator('input[id="customer.password"]');
    this.regConfirmInput  = page.locator('input[id="repeatedPassword"]');
    this.registerSubmit   = page.locator('input[value="Register"]');

    // Post-login
    this.welcomeMessage       = page.locator('#leftPanel p.smallText');
    this.accountServicesTitle = page.locator('#leftPanel h2').first();
    this.rightPanelTitle      = page.locator('#rightPanel h1.title');
  }

  async gotoHome()     { await this.navigate('/parabank/index.htm'); }

  async gotoRegister() {
    await this.navigate('/parabank/register.htm');
    // The registration form is rendered by JavaScript after DOM load.
    // We must wait for at least the first field to be present before
    // returning — otherwise assertions in the spec fire before the form
    // is in the DOM, failing on all three browsers.
    await this.firstNameInput.waitFor({ state: 'visible', timeout: 20000 });
  }

  async login(username, password) {
    await this.gotoHome();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async logout() {
    await this.logoutLink.click();
    // Wait for the URL to change to index/login before returning.
    // A plain domcontentloaded sometimes resolves before the redirect
    // completes on Firefox/WebKit, causing the loginPanel assertion to race.
    await this.page.waitForURL(/index|login/, { timeout: 30000 });
    await this.page.waitForLoadState('domcontentloaded');
    // Ensure the login panel is actually in the DOM before handing back.
    await this.loginPanel.waitFor({ state: 'visible', timeout: 15000 });
  }

  async register(user) {
    await this.gotoRegister();
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.addressInput.fill(user.address);
    await this.cityInput.fill(user.city);
    await this.stateInput.fill(user.state);
    await this.zipCodeInput.fill(user.zipCode);
    await this.phoneInput.fill(user.phone);
    await this.ssnInput.fill(user.ssn);
    await this.regUsernameInput.fill(user.username);
    await this.regPasswordInput.fill(user.password);
    await this.regConfirmInput.fill(user.confirmPassword);
    await this.registerSubmit.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isLoggedIn() {
    return this.logoutLink.isVisible();
  }

  async getErrorText() {
    const visible = await this.loginError.isVisible();
    return visible ? this.loginError.innerText() : '';
  }

  async getWelcomeText() {
    try {
      return await this.rightPanelTitle.innerText();
    } catch {
      return '';
    }
  }
}

module.exports = AuthPage;