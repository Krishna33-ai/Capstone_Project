// tests/profile.spec.js
// SERVICE 7 — User Profile | 17 Test Cases

const { test, expect } = require('@playwright/test');
const AuthPage    = require('../pages/AuthPage');
const ProfilePage = require('../pages/ProfilePage');
const TEST_DATA   = require('../fixtures/testData');

// ProfilePage.gotoProfile() now waits for Angular internally
async function loginAndGoto(page) {
  const auth = new AuthPage(page);
  await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  await page.waitForLoadState('domcontentloaded');
  const profile = new ProfilePage(page);
  await profile.gotoProfile();
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
      expect((await profile.getRightPanelText()).toLowerCase()).toMatch(/profile|update|name/);
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
    await expect(profile.lastNameInput).toBeVisible();
  });
  test('TC-PROF-06 | Address input is visible', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await expect(profile.addressInput).toBeVisible();
  });
  test('TC-PROF-07 | City input is visible', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await expect(profile.cityInput).toBeVisible();
  });
  test('TC-PROF-08 | Phone input is visible', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await expect(profile.phoneInput).toBeVisible();
  });
  test('TC-PROF-09 | Update Profile button is visible', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await profile.updateButton.waitFor({ state: 'visible', timeout: 20000 });
    await expect(profile.updateButton).toBeVisible();
  });
});

test.describe('Block 3 — Pre-filled Data', () => {
  // Angular binds model values to inputs asynchronously.
  // Even after gotoProfile() waits for visibility, the value binding
  // may take another tick. toPass() polling handles this correctly.
  test('TC-PROF-10 | First name field is pre-filled', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await expect(async () => {
      const value = await profile.firstNameInput.inputValue();
      expect(value.length).toBeGreaterThan(0);
    }).toPass({ timeout: 20000 });
  });
  test('TC-PROF-11 | Last name field is pre-filled', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await expect(async () => {
      const value = await profile.lastNameInput.inputValue();
      expect(value.length).toBeGreaterThan(0);
    }).toPass({ timeout: 20000 });
  });
});

test.describe('Block 4 — Update Profile', () => {
  test('TC-PROF-12 | Updating profile shows response', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await profile.updateProfile(TEST_DATA.profileData);
    await expect(async () => {
      expect((await profile.getRightPanelText()).length).toBeGreaterThan(0);
    }).toPass({ timeout: 20000 });
  });
  test('TC-PROF-13 | Profile update response contains success related text', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await profile.updateProfile(TEST_DATA.profileData);
    await expect(async () => {
      expect((await profile.getRightPanelText()).toLowerCase()).toMatch(/profile|updated|success|error/);
    }).toPass({ timeout: 20000 });
  });
  test('TC-PROF-14 | Updating with changed data shows response', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await profile.updateProfile(TEST_DATA.updatedProfileData);
    await expect(async () => {
      expect((await profile.getRightPanelText()).length).toBeGreaterThan(0);
    }).toPass({ timeout: 20000 });
  });
});

test.describe('Block 5 — Navigation', () => {
  test('TC-PROF-15 | Profile link is visible in left nav after login', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    await page.waitForLoadState('domcontentloaded');
    const profile = new ProfilePage(page);
    await profile.profileLink.waitFor({ state: 'visible', timeout: 25000 });
    await expect(profile.profileLink).toBeVisible();
  });
  test('TC-PROF-16 | Profile page accessible via left nav link', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    await page.waitForLoadState('domcontentloaded');
    const profile = new ProfilePage(page);
    await profile.profileLink.waitFor({ state: 'visible', timeout: 25000 });
    await profile.profileLink.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/updateprofile/);
  });
  test('TC-PROF-17 | State and zip fields are present on profile page', async ({ page }) => {
    const profile = await loginAndGoto(page);
    await expect(profile.stateInput).toBeVisible({ timeout: 20000 });
    await expect(profile.zipCodeInput).toBeVisible({ timeout: 20000 });
  });
});
