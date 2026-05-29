// tests/api.spec.js
// SERVICE 8 — Internal API | 16 Test Cases

const { test, expect } = require('@playwright/test');
const TEST_DATA = require('../fixtures/testData');

const { validUser, endpoints } = TEST_DATA;
const HDR = { Accept: 'application/json' };

// Retry wrapper — only retries on real errors, not assertion failures
async function retryGet(request, url, retries = 3) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await request.get(url, { headers: HDR, timeout: 30000 });
      return res;
    } catch (err) {
      lastErr = err;
      if (i < retries - 1) await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw lastErr;
}

// Login and return customerId — used in beforeAll
async function fetchCustomerId(request) {
  const res = await retryGet(request, endpoints.login(validUser.username, validUser.password));
  if (res.status() !== 200) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Login API ${res.status()}: ${txt.slice(0, 200)}`);
  }
  const body = await res.json();
  if (!body.id) throw new Error(`No id in login response: ${JSON.stringify(body)}`);
  return body.id;
}

// Get first accountId for a customer
async function fetchFirstAccountId(request, customerId) {
  const res = await retryGet(request, endpoints.accounts(customerId));
  if (res.status() !== 200) throw new Error(`Accounts API ${res.status()}`);
  const list = await res.json();
  if (!Array.isArray(list) || list.length === 0) throw new Error('No accounts returned');
  return list[0].id;
}

// ── Block 1 — Login API ──────────────────────────────────────────────────────
test.describe('Block 1 — Login API', () => {

  test('TC-API-01 | Login endpoint returns 200 for valid credentials', async ({ request }) => {
    const res = await retryGet(request, endpoints.login(validUser.username, validUser.password));
    expect(res.status()).toBe(200);
  });

  test('TC-API-02 | Login response contains customer id', async ({ request }) => {
    const res  = await retryGet(request, endpoints.login(validUser.username, validUser.password));
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('id');
  });

  test('TC-API-03 | Login response contains first name', async ({ request }) => {
    const res  = await retryGet(request, endpoints.login(validUser.username, validUser.password));
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('firstName');
  });

  test('TC-API-04 | Invalid login returns non-200 status', async ({ request }) => {
    const res = await retryGet(request, endpoints.login('invalid_user_xyz', 'wrongpass'));
    expect(res.status()).not.toBe(200);
  });
});

// ── Block 2 — Customer Accounts ─────────────────────────────────────────────
// KEY FIX: beforeAll receives the shared APIRequestContext — works correctly.
// The prior bug was expect() inside helpers causing retryRequest to swallow
// assertion errors silently, making all 4 tests fail with no clear message.
test.describe('Block 2 — Customer Accounts', () => {
  let customerId;

  test.beforeAll(async ({ request }) => {
    customerId = await fetchCustomerId(request);
  });

  test('TC-API-05 | Accounts endpoint returns 200', async ({ request }) => {
    const res = await retryGet(request, endpoints.accounts(customerId));
    expect(res.status()).toBe(200);
  });

  test('TC-API-06 | Accounts response is an array', async ({ request }) => {
    const res      = await retryGet(request, endpoints.accounts(customerId));
    const accounts = await res.json();
    expect(Array.isArray(accounts)).toBe(true);
  });

  test('TC-API-07 | At least one account is returned', async ({ request }) => {
    const res      = await retryGet(request, endpoints.accounts(customerId));
    const accounts = await res.json();
    expect(accounts.length).toBeGreaterThanOrEqual(1);
  });

  test('TC-API-08 | Each account has an id field', async ({ request }) => {
    const res      = await retryGet(request, endpoints.accounts(customerId));
    const accounts = await res.json();
    accounts.forEach(acc => expect(acc).toHaveProperty('id'));
  });
});

// ── Block 3 — Account Details ────────────────────────────────────────────────
test.describe('Block 3 — Account Details', () => {
  let accountId;

  test.beforeAll(async ({ request }) => {
    const cid = await fetchCustomerId(request);
    accountId = await fetchFirstAccountId(request, cid);
  });

  test('TC-API-09 | Account detail endpoint returns 200', async ({ request }) => {
    const res = await retryGet(request, endpoints.account(accountId));
    expect(res.status()).toBe(200);
  });

  test('TC-API-10 | Account detail contains balance field', async ({ request }) => {
    const res  = await retryGet(request, endpoints.account(accountId));
    const body = await res.json();
    expect(body).toHaveProperty('balance');
  });

  test('TC-API-11 | Account detail contains type field', async ({ request }) => {
    const res  = await retryGet(request, endpoints.account(accountId));
    const body = await res.json();
    expect(body).toHaveProperty('type');
  });

  test('TC-API-12 | Invalid account id returns non-200 status', async ({ request }) => {
    const res = await retryGet(request, endpoints.account(9999999999));
    expect(res.status()).not.toBe(200);
  });
});

// ── Block 4 — Transactions ───────────────────────────────────────────────────
test.describe('Block 4 — Transactions', () => {
  let accountId;

  test.beforeAll(async ({ request }) => {
    const cid = await fetchCustomerId(request);
    accountId = await fetchFirstAccountId(request, cid);
  });

  test('TC-API-13 | Transactions endpoint returns 200', async ({ request }) => {
    const res = await retryGet(request, endpoints.transactions(accountId));
    expect(res.status()).toBe(200);
  });

  test('TC-API-14 | Transactions response is an array', async ({ request }) => {
    const res  = await retryGet(request, endpoints.transactions(accountId));
    const txns = await res.json();
    expect(Array.isArray(txns)).toBe(true);
  });

  test('TC-API-15 | Each transaction has an id field', async ({ request }) => {
    const res  = await retryGet(request, endpoints.transactions(accountId));
    const txns = await res.json();
    if (txns.length > 0) txns.forEach(t => expect(t).toHaveProperty('id'));
    else expect(txns.length).toBeGreaterThanOrEqual(0);
  });

  test('TC-API-16 | Each transaction has an amount field', async ({ request }) => {
    const res  = await retryGet(request, endpoints.transactions(accountId));
    const txns = await res.json();
    if (txns.length > 0) txns.forEach(t => expect(t).toHaveProperty('amount'));
    else expect(txns.length).toBeGreaterThanOrEqual(0);
  });
});
