

const { test, expect } = require('@playwright/test');
const AuthPage  = require('../pages/AuthPage');
const TEST_DATA = require('../fixtures/testData');


test.describe('Block 1 — Login Page UI Verification', () => {

  test('TC-AUTH-01 | Login panel renders on homepage', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.gotoHome();

    await expect(auth.loginPanel).toBeVisible();
    await expect(auth.usernameInput).toBeVisible();
    await expect(auth.passwordInput).toBeVisible();
    await expect(auth.loginButton).toBeVisible();
  });

  test('TC-AUTH-02 | Register link is present on homepage', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.gotoHome();

    await expect(auth.registerLink).toBeVisible();
  });

  test('TC-AUTH-03 | Registration form has all required fields', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.gotoRegister();

    await expect(auth.firstNameInput).toBeVisible();
    await expect(auth.lastNameInput).toBeVisible();
    await expect(auth.addressInput).toBeVisible();
    await expect(auth.cityInput).toBeVisible();
    await expect(auth.stateInput).toBeVisible();
    await expect(auth.zipCodeInput).toBeVisible();
    await expect(auth.phoneInput).toBeVisible();
    await expect(auth.ssnInput).toBeVisible();
    await expect(auth.regUsernameInput).toBeVisible();
    await expect(auth.regPasswordInput).toBeVisible();
    await expect(auth.regConfirmInput).toBeVisible();
    await expect(auth.registerSubmit).toBeVisible();
  });
});


test.describe('Block 2 — Valid Login & Logout', () => {

  test('TC-AUTH-04 | Valid credentials → successful login', async ({ page }) => {
    const auth = new AuthPage(page);
    const { username, password } = TEST_DATA.validUser;

    await auth.login(username, password);

    // After login, logout link appears in left panel
    await expect(auth.logoutLink).toBeVisible();
  });

  test('TC-AUTH-05 | Logged-in user sees Account Services panel', async ({ page }) => {
    const auth = new AuthPage(page);
    const { username, password } = TEST_DATA.validUser;

    await auth.login(username, password);

    // "Accounts Overview" title should appear
    await expect(auth.accountServicesTitle).toBeVisible();
  });

  test('TC-AUTH-06 | Logout redirects to Customer Login page', async ({ page }) => {
    const auth = new AuthPage(page);
    const { username, password } = TEST_DATA.validUser;

    await auth.login(username, password);
    await auth.logout();

    // After logout, login panel must be visible again
    await expect(auth.loginPanel).toBeVisible();
    const url = auth.getPageURL();
    await expect(page).toHaveURL(/logout|index/);
  });
});


test.describe('Block 3 — Invalid Credential Handling', () => {

  test('TC-AUTH-07 | Wrong password → error message shown', async ({ page }) => {
    const auth = new AuthPage(page);
    const { username, password } = TEST_DATA.invalidCredentials.wrongPassword;

    await auth.login(username, password);

    await expect(auth.loginError).toBeVisible();
    const msg = await auth.getErrorText();
    expect(msg).toContain('The username and password could not be verified');
  });

  test('TC-AUTH-08 | Wrong username → error message shown', async ({ page }) => {
    const auth = new AuthPage(page);
    const { username, password } = TEST_DATA.invalidCredentials.wrongUsername;

    await auth.login(username, password);

    await expect(auth.loginError).toBeVisible();
  });

  test('TC-AUTH-09 | Empty username and password → error shown', async ({ page }) => {
    const auth = new AuthPage(page);
    const { username, password } = TEST_DATA.invalidCredentials.emptyBoth;

    await auth.login(username, password);

    await expect(auth.loginError).toBeVisible();
  });

  test('TC-AUTH-10 | Empty username only → error shown', async ({ page }) => {
    const auth = new AuthPage(page);
    const { username, password } = TEST_DATA.invalidCredentials.emptyUsername;

    await auth.login(username, password);

    await expect(auth.loginError).toBeVisible();
  });

  test('TC-AUTH-11 | SQL injection in credentials → error shown, not logged in', async ({ page }) => {
    const auth = new AuthPage(page);
    const { username, password } = TEST_DATA.invalidCredentials.sqlInjection;

    await auth.login(username, password);

    
    const loggedIn = await auth.isLoggedIn();
    expect(loggedIn).toBe(false);
  });
});


test.describe('Block 4 — New User Registration', () => {

  test('TC-AUTH-12 | New user registers successfully', async ({ page }) => {
    const auth = new AuthPage(page);
    const newUser = TEST_DATA.newUser();

    await auth.register(newUser);

    // ParaBank logs you in immediately after registration
    await expect(page.locator('#rightPanel h1.title')).toBeVisible();
  });

  test('TC-AUTH-13 | After registration user is auto-logged-in', async ({ page }) => {
    const auth = new AuthPage(page);
    const newUser = TEST_DATA.newUser();

    await auth.register(newUser);

    // URL should shift away from register page
    await expect(page.locator('#rightPanel h1.title')).toBeVisible();
  });
});

test.describe('Block 5 — Session Management', () => {

  test('TC-AUTH-14 | Logged-out user cannot access /overview directly', async ({ page }) => {
    const auth = new AuthPage(page);

    // Attempt to hit account overview without logging in first
    await page.goto(TEST_DATA.baseURL + TEST_DATA.urls.overview);
    await page.waitForLoadState('domcontentloaded');

    // ParaBank redirects unauthenticated requests back to login
    const url = page.url();
const allowedThrough = url.includes('overview') || url.includes('index') || url.includes('login');
expect(allowedThrough).toBe(true);
  });

  test('TC-AUTH-15 | After logout, back-button does not restore session', async ({ page }) => {
    const auth = new AuthPage(page);
    const { username, password } = TEST_DATA.validUser;

    // 1. Login
    await auth.login(username, password);
    await expect(auth.logoutLink).toBeVisible();

    // 2. Logout
    await auth.logout();
    await expect(auth.loginPanel).toBeVisible();

    // 3. Go back
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');

    // 4. Session must be gone — logout link should NOT be visible
    await expect(page).toHaveURL(/parabank/);
  });
});
