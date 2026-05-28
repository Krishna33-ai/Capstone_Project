// fixtures/testData.js
// Unified test data for all 8 ParaBank services
// Candidate: Siva

const baseURL = 'https://parabank.parasoft.com/parabank';

const validUser = {
  username: 'john',
  password: 'demo',
  firstName: 'John',
  lastName: 'Smith',
};

const invalidCredentials = {
  wrongPassword:  { username: 'john',             password: 'wrongpass' },
  wrongUsername:  { username: 'nobody_xyz',        password: 'demo' },
  emptyBoth:      { username: '',                  password: '' },
  emptyUsername:  { username: '',                  password: 'demo' },
  emptyPassword:  { username: 'john',              password: '' },
  sqlInjection:   { username: "' OR '1'='1",       password: "' OR '1'='1" },
};

const newUser = () => {
  const ts = Date.now();
  return {
    firstName: 'Auto',
    lastName: 'Tester',
    address: '123 QA Street',
    city: 'Test City',
    state: 'CA',
    zipCode: '90001',
    phone: '9876543210',
    ssn: `SSN${ts}`,
    username: `sivaqa_${ts}`,
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
  };
};

const urls = {
  home:     '/parabank/index.htm',
  register: '/parabank/register.htm',
  overview: '/parabank/overview.htm',
  logout:   '/parabank/logout.htm',
};

const messages = {
  loginError:      'The username and password could not be verified.',
  registerSuccess: 'Your account was created successfully. You are now logged in.',
  welcomePrefix:   'Welcome',
  logoutConfirm:   'Customer Login',
};

// SERVICE 3 — Fund Transfer
const transferData = {
  validAmount:    '100',
  smallAmount:    '1',
  largeAmount:    '99999999',
  zeroAmount:     '0',
  negativeAmount: '-100',
  decimalAmount:  '50.50',
};

// SERVICE 4 — Transaction History  (no extra data needed beyond validUser)

// SERVICE 5 — Bill Payment
const payeeData = {
  name:    'Test Payee',
  address: '123 Bill Street',
  city:    'Test City',
  state:   'CA',
  zipCode: '90001',
  phone:   '9876543210',
  account: '12345',
  amount:  '50',
};

// SERVICE 6 — Loan Request
const loanData = {
  validAmount:      '1000',
  validDownPayment: '100',
  largeAmount:      '9999999',
  largeDownPayment: '0',
  zeroAmount:       '0',
  zeroDownPayment:  '0',
};

// SERVICE 7 — User Profile
const profileData = {
  firstName: 'John',
  lastName:  'Smith',
  address:   '123 Main Street',
  city:      'Anytown',
  state:     'CA',
  zipCode:   '90210',
  phone:     '5551234567',
};

const updatedProfileData = {
  firstName: 'John',
  lastName:  'Updated',
  address:   '456 New Street',
  city:      'New City',
  state:     'NY',
  zipCode:   '10001',
  phone:     '5559876543',
};

// SERVICE 8 — Internal API
const apiBase = 'https://parabank.parasoft.com/parabank/services/bank';
const endpoints = {
  login:        (u, p)  => `${apiBase}/login/${u}/${p}`,
  accounts:     (cid)   => `${apiBase}/customers/${cid}/accounts`,
  account:      (aid)   => `${apiBase}/accounts/${aid}`,
  transactions: (aid)   => `${apiBase}/accounts/${aid}/transactions`,
};

module.exports = {
  baseURL,
  validUser,
  invalidCredentials,
  newUser,
  urls,
  messages,
  transferData,
  payeeData,
  loanData,
  profileData,
  updatedProfileData,
  apiBase,
  endpoints,
};
