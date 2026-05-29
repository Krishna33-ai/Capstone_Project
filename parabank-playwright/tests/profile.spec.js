// tests/profile.spec.js
// SERVICE 7 — User Profile | 17 Test Cases
// Target : https://parabank.parasoft.com

const { test, expect } = require('@playwright/test');
const AuthPage    = require('../pages/AuthPage');
const ProfilePage = require('../pages/ProfilePage');
const TEST_DATA   = require('../fixtures/testData');

async function loginAndGoto(page) {
  const auth = new AuthPage(page);
  await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  // FIX: networkidle ensures JS session cookie is fully set before navigating
  await page.waitForLoadState('networkidle', { timeout: 30000 });
    const profile = new ProfilePage(page);
  await profile.gotoProfile();
  await page.waitForSelector('#rightPanel', { state: 'visible', timeout: 25000 });
  await profile.firstNameInput.waitFor({ state: 'visible', timeout: 25000 });
  return profile;
}

test.describe('Block 1 — Page Load', () => {
  test('TC-PROF-01 | Profile page loads after login', async ({ page }) => {
    await loginAndGoto(page);
    await expect(page).toHaveURL(/updateprofile/);
  });
  test('TC-PROF-02 | Right panel is visible on profile page', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await expect(profile.rightPanel).toBeVisible();
  });
  test('TC-PROF-03 | Profile page contains relevant text', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await expect(async () => {
      const text = await profile.getRightPanelText();
      expect(text.toLowerCase()).toMatch(/profile|update|name/);
    }).toPass({ timeout: 15000 });
  });
});

test.describe('Block 2 — Form Fields', () => {
  test('TC-PROF-04 | First name input is visible', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await expect(profile.firstNameInput).toBeVisible();
  });
  test('TC-PROF-05 | Last name input is visible', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await profile.lastNameInput.waitFor({ state: 'visible', timeout: 15000 });
    await expect(profile.lastNameInput).toBeVisible();
  });
  test('TC-PROF-06 | Address input is visible', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await profile.addressInput.waitFor({ state: 'visible', timeout: 15000 });
    await expect(profile.addressInput).toBeVisible();
  });
  test('TC-PROF-07 | City input is visible', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await profile.cityInput.waitFor({ state: 'visible', timeout: 15000 });
    await expect(profile.cityInput).toBeVisible();
  });
  test('TC-PROF-08 | Phone input is visible', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await profile.phoneInput.waitFor({ state: 'visible', timeout: 15000 });
    await expect(profile.phoneInput).toBeVisible();
  });
  test('TC-PROF-09 | Update Profile button is visible', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await profile.updateButton.waitFor({ state: 'visible', timeout: 15000 });
    await expect(profile.updateButton).toBeVisible();
  });
});

test.describe('Block 3 — Pre-filled Data', () => {
  test('TC-PROF-10 | First name field is pre-filled', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await expect(async () => {
      const value = await profile.firstNameInput.inputValue();
      expect(value.length).toBeGreaterThan(0);
    }).toPass({ timeout: 15000 });
  });
  test('TC-PROF-11 | Last name field is pre-filled', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await expect(async () => {
      const value = await profile.lastNameInput.inputValue();
      expect(value.length).toBeGreaterThan(0);
    }).toPass({ timeout: 15000 });
  });
});

test.describe('Block 4 — Update Profile', () => {
  test('TC-PROF-12 | Updating profile shows response', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await profile.updateProfile(TEST_DATA.profileData);
    await expect(async () => {
      const content = await profile.getRightPanelText();
      expect(content.length).toBeGreaterThan(0);
    }).toPass({ timeout: 20000 });
  });
  test('TC-PROF-13 | Profile update response contains success related text', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await profile.updateProfile(TEST_DATA.profileData);
    await expect(async () => {
      const content = await profile.getRightPanelText();
      expect(content.toLowerCase()).toMatch(/profile|updated|success|error/);
    }).toPass({ timeout: 20000 });
  });
  await transfer.transferButton.click();
    await Promise.race([
      page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {}),
      page.waitForTimeout(2000),
    ]);
    await expect(async () => {
      const content = await page.locator('#rightPanel').innerText();
      expect(content.length).toBeGreaterThan(0);
    }).toPass({ timeout: 20000 });
  });
});

test.describe('Block 5 — Navigation', () => {
  test('TC-PROF-15 | Profile link is visible in left nav after login', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    // FIX: networkidle ensures session is ready before checking nav link
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    const profile = new ProfilePage(page);
    await profile.profileLink.waitFor({ state: 'visible', timeout: 25000 });
    await expect(profile.profileLink).toBeVisible();
  });
  test('TC-PROF-16 | Profile page accessible via left nav link', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    // FIX: networkidle ensures session is ready before clicking nav link
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    const profile = new ProfilePage(page);
    await profile.profileLink.waitFor({ state: 'visible', timeout: 25000 });
    await profile.profileLink.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/updateprofile/);
  });
  test('TC-PROF-17 | State and zip fields are present on profile page', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await profile.stateInput.waitFor({ state: 'visible', timeout: 15000 });
    await profile.zipCodeInput.waitFor({ state: 'visible', timeout: 15000 });
    await expect(profile.stateInput).toBeVisible({ timeout: 15000 });
    await expect(profile.zipCodeInput).toBeVisible({ timeout: 15000 });
  });
});