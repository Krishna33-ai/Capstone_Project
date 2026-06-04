

const { test, expect } = require('@playwright/test');
const AuthPage  = require('../pages/AuthPage');
const TEST_DATA = require('../fixtures/testData');


test.describe('Block 1 — Login Page UI Verification', () => {

  test('TC-AUTH-01 | Login panel renders on homepage', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.gotoHome();
    await expect(auth.loginPanel).toBeVisible();
  });

  test('TC-AUTH-02 | Username input is visible', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.gotoHome();
    await expect(auth.usernameInput).toBeVisible();
  });

  test('TC-AUTH-03 | Password input is visible', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.gotoHome();
    await expect(auth.passwordInput).toBeVisible();
  });

  test('TC-AUTH-04 | Log In button is visible', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.gotoHome();
    await expect(auth.loginButton).toBeVisible();
  });

  test('TC-AUTH-05 | Register link is visible on homepage', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.gotoHome();
    await expect(auth.registerLink).toBeVisible();
  });
});


test.describe('Block 2 — Valid Login', () => {

  test('TC-AUTH-06 | Valid credentials redirect to account overview', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    await expect(page).toHaveURL(/overview/);
  });

  test('TC-AUTH-07 | Logout link appears after successful login', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    await expect(auth.logoutLink).toBeVisible();
  });

  test('TC-AUTH-08 | Account Services heading visible after login', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    await expect(auth.accountServicesTitle).toBeVisible();
  });
});


test.describe('Block 3 — Invalid Login', () => {

  test('TC-AUTH-09 | Wrong password shows error', async ({ page }) => {
    const auth = new AuthPage(page);
    const { username, password } = TEST_DATA.invalidCredentials.wrongPassword;
    await auth.login(username, password);
    
    await auth.loginError.waitFor({ state: 'attached', timeout: 20000 });
    const text = await auth.loginError.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  });

  test('TC-AUTH-10 | Wrong username shows error', async ({ page }) => {
    const auth = new AuthPage(page);
    const { username, password } = TEST_DATA.invalidCredentials.wrongUsername;
    await auth.login(username, password);
    await auth.loginError.waitFor({ state: 'attached', timeout: 20000 });
    const text = await auth.loginError.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  });

  test('TC-AUTH-11 | Empty credentials show error', async ({ page }) => {
    const auth = new AuthPage(page);
    const { username, password } = TEST_DATA.invalidCredentials.emptyBoth;
    await auth.login(username, password);
    await auth.loginError.waitFor({ state: 'attached', timeout: 20000 });
    const text = await auth.loginError.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  });

  test('TC-AUTH-12 | SQL injection attempt does not log in', async ({ page }) => {
    const auth = new AuthPage(page);
    const { username, password } = TEST_DATA.invalidCredentials.sqlInjection;
    await auth.login(username, password);
    const loggedIn = await auth.isLoggedIn();
    expect(loggedIn).toBe(false);
  });
});


test.describe('Block 4 — Logout', () => {

  test('TC-AUTH-13 | Logout returns to login page', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    await page.waitForLoadState('domcontentloaded');
    await auth.logoutLink.waitFor({ state: 'visible', timeout: 15000 });
    await auth.logout();
    await expect(auth.loginPanel).toBeVisible({ timeout: 15000 });
  });

  test('TC-AUTH-14 | URL contains index or login after logout', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    await page.waitForLoadState('domcontentloaded');
    await auth.logoutLink.waitFor({ state: 'visible', timeout: 15000 });
    await auth.logout();
    await expect(page).toHaveURL(/index|login/, { timeout: 15000 });
  });
});


test.describe('Block 5 — Registration Page', () => {

  test('TC-AUTH-15 | Register page loads', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.gotoRegister();
    await expect(page).toHaveURL(/register/);
  });

  test('TC-AUTH-16 | First name field is visible on register page', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.gotoRegister();
    await expect(auth.firstNameInput).toBeVisible({ timeout: 15000 });
  });

  test('TC-AUTH-17 | Register button is visible on register page', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.gotoRegister();
    await auth.registerSubmit.waitFor({ state: 'visible', timeout: 15000 });
    await expect(auth.registerSubmit).toBeVisible({ timeout: 15000 });
  });
});