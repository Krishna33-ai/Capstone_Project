// pages/ProfilePage.js
const BasePage = require('./BasePage');

class ProfilePage extends BasePage {
  constructor(page) {
    super(page);
    this.firstNameInput = page.locator('input[id="customer.firstName"]');
    this.lastNameInput  = page.locator('input[id="customer.lastName"]');
    this.addressInput   = page.locator('input[id="customer.address.street"]');
    this.cityInput      = page.locator('input[id="customer.address.city"]');
    this.stateInput     = page.locator('input[id="customer.address.state"]');
    this.zipCodeInput   = page.locator('input[id="customer.address.zipCode"]');
    this.phoneInput     = page.locator('input[id="customer.phoneNumber"]');
    this.updateButton   = page.locator('input[value="Update Profile"]');
    this.rightPanel     = page.locator('#rightPanel');
    this.successMessage = page.locator('#rightPanel p');
    // text-based selector — reliable across Angular ng-href timing
    this.profileLink    = page.locator('a:has-text("Update Contact Info")');
  }

  async gotoProfile() {
    await this.navigate('/parabank/updateprofile.htm');
    await this.page.waitForLoadState('domcontentloaded');

    // FIX TC-PROF-01 & TC-PROF-02:
    // Wait for #rightPanel first (confirms page structure rendered), then
    // wait for each Angular-bound form field. Without #rightPanel wait,
    // TC-PROF-02 (rightPanel.toBeVisible) could race with Angular init.
    await this.page.waitForSelector('#rightPanel', { state: 'visible', timeout: 60000 });
    await this.firstNameInput.waitFor({ state: 'visible', timeout: 60000 });
    await this.stateInput.waitFor({ state: 'visible', timeout: 60000 });
    await this.zipCodeInput.waitFor({ state: 'visible', timeout: 60000 });
  }

  async getRightPanelText() {
    return await this.rightPanel.innerText();
  }

  async updateProfile(data) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.addressInput.fill(data.address);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
    await this.zipCodeInput.fill(data.zipCode);
    await this.phoneInput.fill(data.phone);
    await this.updateButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = ProfilePage;