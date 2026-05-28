// tests/api.spec.js
// SERVICE 8 — Internal API | 16 Test Cases
// Target : https://parabank.parasoft.com/parabank/services/bank
// Covers : Login API, customer accounts, account details, transactions

const { test, expect } = require('@playwright/test');
const TEST_DATA = require('../fixtures/testData');

const { validUser, apiBase, endpoints } = TEST_DATA;

// ── Helper: login via API and return customerId ──────────────────────────────
async function getCustomerId(request) {
  const url = endpoints.login(validUser.username, validUser.password);
  const res  = await request.get(url, { headers: { Accept: 'application/json' } });
  expect(res.status()).toBe(200);
  const body = await res.json();
  return body.id;
}

// ── Helper: get first account id for a customer ──────────────────────────────
async function getFirstAccountId(request, customerId) {
  const url = endpoints.accounts(customerId);
  const res  = await request.get(url, { headers: { Accept: 'application/json' } });
  expect(res.status()).toBe(200);
  const accounts = await res.json();
  expect(accounts.length).toBeGreaterThan(0);
  return accounts[0].id;
}


test.describe('Block 1 — Login API', () => {

  test('TC-API-01 | Login endpoint returns 200 for valid credentials', async ({ request }) => {
    const url = endpoints.login(validUser.username, validUser.password);
    const res = await request.get(url, { headers: { Accept: 'application/json' } });
    expect(res.status()).toBe(200);
  });

  test('TC-API-02 | Login response contains customer id', async ({ request }) => {
    const url  = endpoints.login(validUser.username, validUser.password);
    const res  = await request.get(url, { headers: { Accept: 'application/json' } });
    const body = await res.json();
    expect(body).toHaveProperty('id');
  });

  test('TC-API-03 | Login response contains first name', async ({ request }) => {
    const url  = endpoints.login(validUser.username, validUser.password);
    const res  = await request.get(url, { headers: { Accept: 'application/json' } });
    const body = await res.json();
    expect(body).toHaveProperty('firstName');
  });

  test('TC-API-04 | Invalid login returns non-200 status', async ({ request }) => {
    const url = endpoints.login('invalid_user_xyz', 'wrongpass');
    const res = await request.get(url, { headers: { Accept: 'application/json' } });
    expect(res.status()).not.toBe(200);
  });
});


test.describe('Block 2 — Customer Accounts', () => {

  test('TC-API-05 | Accounts endpoint returns 200', async ({ request }) => {
    const customerId = await getCustomerId(request);
    const url = endpoints.accounts(customerId);
    const res = await request.get(url, { headers: { Accept: 'application/json' } });
    expect(res.status()).toBe(200);
  });

  test('TC-API-06 | Accounts response is an array', async ({ request }) => {
    const customerId = await getCustomerId(request);
    const url     = endpoints.accounts(customerId);
    const res     = await request.get(url, { headers: { Accept: 'application/json' } });
    const accounts = await res.json();
    expect(Array.isArray(accounts)).toBe(true);
  });

  test('TC-API-07 | At least one account is returned', async ({ request }) => {
    const customerId = await getCustomerId(request);
    const url      = endpoints.accounts(customerId);
    const res      = await request.get(url, { headers: { Accept: 'application/json' } });
    const accounts = await res.json();
    expect(accounts.length).toBeGreaterThanOrEqual(1);
  });

  test('TC-API-08 | Each account has an id field', async ({ request }) => {
    const customerId = await getCustomerId(request);
    const url      = endpoints.accounts(customerId);
    const res      = await request.get(url, { headers: { Accept: 'application/json' } });
    const accounts = await res.json();
    accounts.forEach(acc => expect(acc).toHaveProperty('id'));
  });
});


test.describe('Block 3 — Account Details', () => {

  test('TC-API-09 | Account detail endpoint returns 200', async ({ request }) => {
    const customerId = await getCustomerId(request);
    const accountId  = await getFirstAccountId(request, customerId);
    const url = endpoints.account(accountId);
    const res = await request.get(url, { headers: { Accept: 'application/json' } });
    expect(res.status()).toBe(200);
  });

  test('TC-API-10 | Account detail contains balance field', async ({ request }) => {
    const customerId = await getCustomerId(request);
    const accountId  = await getFirstAccountId(request, customerId);
    const url  = endpoints.account(accountId);
    const res  = await request.get(url, { headers: { Accept: 'application/json' } });
    const body = await res.json();
    expect(body).toHaveProperty('balance');
  });

  test('TC-API-11 | Account detail contains type field', async ({ request }) => {
    const customerId = await getCustomerId(request);
    const accountId  = await getFirstAccountId(request, customerId);
    const url  = endpoints.account(accountId);
    const res  = await request.get(url, { headers: { Accept: 'application/json' } });
    const body = await res.json();
    expect(body).toHaveProperty('type');
  });

  test('TC-API-12 | Invalid account id returns non-200 status', async ({ request }) => {
    const url = endpoints.account(9999999999);
    const res = await request.get(url, { headers: { Accept: 'application/json' } });
    expect(res.status()).not.toBe(200);
  });
});


test.describe('Block 4 — Transactions', () => {

  test('TC-API-13 | Transactions endpoint returns 200', async ({ request }) => {
    const customerId = await getCustomerId(request);
    const accountId  = await getFirstAccountId(request, customerId);
    const url = endpoints.transactions(accountId);
    const res = await request.get(url, { headers: { Accept: 'application/json' } });
    expect(res.status()).toBe(200);
  });

  test('TC-API-14 | Transactions response is an array', async ({ request }) => {
    const customerId = await getCustomerId(request);
    const accountId  = await getFirstAccountId(request, customerId);
    const url  = endpoints.transactions(accountId);
    const res  = await request.get(url, { headers: { Accept: 'application/json' } });
    const txns = await res.json();
    expect(Array.isArray(txns)).toBe(true);
  });

  test('TC-API-15 | Each transaction has an id field', async ({ request }) => {
    const customerId = await getCustomerId(request);
    const accountId  = await getFirstAccountId(request, customerId);
    const url  = endpoints.transactions(accountId);
    const res  = await request.get(url, { headers: { Accept: 'application/json' } });
    const txns = await res.json();
    if (txns.length > 0) {
      txns.forEach(t => expect(t).toHaveProperty('id'));
    } else {
      expect(txns.length).toBeGreaterThanOrEqual(0);
    }
  });

  test('TC-API-16 | Each transaction has an amount field', async ({ request }) => {
    const customerId = await getCustomerId(request);
    const accountId  = await getFirstAccountId(request, customerId);
    const url  = endpoints.transactions(accountId);
    const res  = await request.get(url, { headers: { Accept: 'application/json' } });
    const txns = await res.json();
    if (txns.length > 0) {
      txns.forEach(t => expect(t).toHaveProperty('amount'));
    } else {
      expect(txns.length).toBeGreaterThanOrEqual(0);
    }
  });
});