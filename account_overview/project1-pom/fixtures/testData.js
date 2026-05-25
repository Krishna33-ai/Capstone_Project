// fixtures/testData.js

const baseURL = 'https://parabank.parasoft.com/parabank';

const validUser = {
  username: 'john',
  password: 'demo',
};

const invalidCredentials = {
  wrongPassword:  { username: 'siva2422321',      password: 'WrongPass999' },
  wrongUsername:  { username: 'no_such_user_xyz', password: 'Test@1234' },
  emptyBoth:      { username: '',                 password: '' },
  emptyUsername:  { username: '',                 password: 'Test@1234' },
  sqlInjection:   { username: "' OR '1'='1",      password: "' OR '1'='1" },
};

const newUser = () => {
  const ts = Date.now();
  return {
    firstName: 'Auto', lastName: 'Tester',
    address: '123 QA Street', city: 'Test City',
    state: 'CA', zipCode: '90001',
    phone: '9876543210', ssn: '123456789',
    username: `sivaqa_${ts}`,
    password: 'Test@1234', confirmPassword: 'Test@1234',
  };
};

const urls = {
  home:     '/parabank/index.htm',
  register: '/parabank/register.htm',
  overview: '/parabank/overview.htm',
  logout:   '/parabank/logout.htm',
};

module.exports = { baseURL, validUser, invalidCredentials, newUser, urls };
