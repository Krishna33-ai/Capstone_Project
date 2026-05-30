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
    // Use text-based selector — more reliable than href attribute matching
    // when Angular resolves ng-href asynchronously after login.
    this.profileLink    = page.locator('a:has-text("Update Contact Info")');
  }

  async gotoProfile() {
    await this.navigate('/parabank/updateprofile.htm');
    // FIX TC-PROF-01 & TC-PROF-02:
    // ParaBank updateprofile.htm is AngularJS. After navigate() + domcontentloaded,
    // Angular still needs to bootstrap and render #rightPanel + the form fields.
    // The old code only waited for firstNameInput, which is correct for form tests
    // but TC-PROF-01 checks toHaveURL(/updateprofile/) and TC-PROF-02 checks
    // rightPanel visibility — both assertions fired BEFORE Angular finished
    // rendering #rightPanel when the server was slow.
    //
    // Fix: wait for BOTH #rightPanel (visible) and firstNameInput (visible).
    // This guarantees that when gotoProfile() returns:
    //   - The URL is confirmed to be updateprofile.htm (no redirect happened)
    //   - #rightPanel is in the DOM and visible
    //   - The Angular form is fully rendered
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('#rightPanel', { state: 'visible', timeout: 35000 });
    // Angular renders the form fields after DOM load — wait confirms it's ready
    await this.firstNameInput.waitFor({ state: 'visible', timeout: 35000 });
    // State and zip inputs are also Angular-bound. Explicitly wait for both.
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