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
    // FIX FOR TC-PROF-16:
    // Use text-based selector — more reliable than href attribute matching
    // when Angular resolves ng-href asynchronously after login.
    this.profileLink    = page.locator('a:has-text("Update Contact Info")');
  }

  async gotoProfile() {
    await this.navigate('/parabank/updateprofile.htm');
    await this.page.waitForLoadState('domcontentloaded');
    // Angular renders the form fields after DOM load — wait confirms it's ready
    await this.firstNameInput.waitFor({ state: 'visible', timeout: 35000 });
    // FIX FOR TC-PROF-17:
    // State and zip inputs are also Angular-bound. Explicitly wait for both
    // to be visible so TC-PROF-17 assertions never race against Angular binding.
    await this.stateInput.waitFor({ state: 'visible', timeout: 35000 });
    await this.zipCodeInput.waitFor({ state: 'visible', timeout: 35000 });
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