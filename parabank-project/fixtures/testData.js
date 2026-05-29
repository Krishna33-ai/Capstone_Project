// fixtures/testData.js
// Centralised test data for all ParaBank spec files.
// Update validUser credentials to match your registered ParaBank account.

const BASE = 'https://parabank.parasoft.com/parabank/services/bank';

const TEST_DATA = {
  // ── Auth ────────────────────────────────────────────────────────────────────
  validUser: {
    username: 'john',      // <-- replace with your ParaBank username
    password: 'demo',      // <-- replace with your ParaBank password
  },

  invalidCredentials: {
    wrongPassword: { username: 'john',            password: 'wrongpassword123' },
    wrongUsername:  { username: 'nonexistent_xyz', password: 'demo'            },
    emptyBoth:      { username: '',                password: ''                 },
    sqlInjection:   { username: "' OR '1'='1",    password: "' OR '1'='1"     },
  },

  // ── Fund Transfer ────────────────────────────────────────────────────────────
  transferData: {
    validAmount:   '10',
    smallAmount:   '1',
    decimalAmount: '0.01',
    zeroAmount:    '0',
  },

  // ── Bill Payment ─────────────────────────────────────────────────────────────
  // All fields must match BillPage.fillPayeeDetails() parameter names exactly.
  payeeData: {
    name:    'Test Payee',
    address: '123 Main St',
    city:    'Springfield',
    state:   'IL',
    zipCode: '62701',
    phone:   '555-555-5555',
    account: '12345',
    amount:  '50',
  },

  // ── Loan Request ─────────────────────────────────────────────────────────────
  loanData: {
    validAmount:      '1000',
    validDownPayment: '100',
    largeAmount:      '100000',
    largeDownPayment: '10000',
    zeroAmount:       '0',
    zeroDownPayment:  '0',
  },

  // ── User Profile ─────────────────────────────────────────────────────────────
  profileData: {
    firstName: 'John',
    lastName:  'Smith',
    address:   '456 Elm Street',
    city:      'Shelbyville',
    state:     'IL',
    zipCode:   '62565',
    phone:     '555-123-4567',
  },

  updatedProfileData: {
    firstName: 'John',
    lastName:  'Smith',
    address:   '789 Oak Avenue',
    city:      'Capital City',
    state:     'IL',
    zipCode:   '62702',
    phone:     '555-987-6543',
  },

  // ── Internal API endpoints ───────────────────────────────────────────────────
  // ParaBank REST API — returns JSON when Accept: application/json is set.
  endpoints: {
    login:        (u, p)  => `${BASE}/login/${u}/${p}`,
    accounts:     (cid)   => `${BASE}/customers/${cid}/accounts`,
    account:      (aid)   => `${BASE}/accounts/${aid}`,
    transactions: (aid)   => `${BASE}/accounts/${aid}/transactions`,
  },
};

module.exports = TEST_DATA;