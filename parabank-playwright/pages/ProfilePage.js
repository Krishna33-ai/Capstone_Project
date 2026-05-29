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
    this.profileLink    = page.locator('a[href*="updateprofile"]');
  }

  async gotoProfile() {
    await this.navigate('/parabank/updateprofile.htm');
    await this.page.waitForLoadState('domcontentloaded');
    // Angular renders the form fields after DOM load — wait confirms it's ready
    await this.firstNameInput.waitFor({ state: 'visible', timeout: 35000 });
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
