// fixtures/testData.js
// Centralized test data for ParaBank capstone project
// Candidate: Siva 

const TEST_DATA = {
  baseURL: 'https://parabank.parasoft.com/parabank',

  // ── Default seeded ParaBank demo user ──
  validUser: {
    username: 'john',
    password: 'demo',
    firstName: 'John',
    lastName: 'Smith',
  },

  // ── New user registered during test run (timestamp-unique) ──
  newUser: () => {
    const ts = Date.now();
    return {
      firstName: 'Siva',
      lastName: 'Yadla',
      address: '123 MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560038',
      phone: '9876543210',
      ssn: `SSN${ts}`,
      username: `siva_${ts}`,
      password: 'Test@1234',
      confirmPassword: 'Test@1234',
    };
  },

  // ── Invalid credential sets ──
  invalidCredentials: {
    wrongPassword: { username: 'john', password: 'wrongpass' },
    wrongUsername: { username: 'nobody_xyz', password: 'demo' },
    emptyBoth:     { username: '',      password: '' },
    emptyUsername: { username: '',      password: 'demo' },
    emptyPassword: { username: 'john',  password: '' },
    sqlInjection:  { username: "' OR '1'='1", password: "' OR '1'='1" },
  },

  // ── URLs ──
  urls: {
    home:     '/index.htm',
    login:    '/index.htm',
    register: '/register.htm',
    overview: '/overview.htm',
    logout:   '/logout.htm',
  },

  // ── Expected texts ──
  messages: {
    loginError:        'The username and password could not be verified.',
    registerSuccess:   'Your account was created successfully. You are now logged in.',
    welcomePrefix:     'Welcome',
    logoutConfirm:     'Customer Login',
  },
};

module.exports = TEST_DATA;
