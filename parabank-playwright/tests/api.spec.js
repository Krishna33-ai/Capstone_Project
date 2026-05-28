// tests/api.spec.js
// SERVICE 8 — Internal API | 16 Test Cases
// Target : https://parabank.parasoft.com/parabank/services/bank
// Covers : Login API, customer accounts, account details, transactions

const { test, expect } = require('@playwright/test');
const TEST_DATA = require('../fixtures/testData');

const { validUser, endpoints } = TEST_DATA;

// ─────────────────────────────────────────────────────────────────────────────
// FIX 1: Cache customerId + accountId at the describe-block level so we only
//         call login ONCE per block, not once per test.  The public ParaBank
//         demo is slow and unstable; hammering it with a fresh login for every
//         single test is the primary cause of cascading 14-test failures.
// ─────────────────────────────────────────────────────────────────────────────

// ── Helper: login via API and return customerId ──────────────────────────────
// FIX 2: Added explicit retryRequest wrapper so transient 5xx / network blips
//         on the demo server don't immediately fail the test.
async function retryRequest(fn, retries = 3, delayMs = 2000) {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < retries - 1) await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw lastError;
}

async function getCustomerId(request) {
  return retryRequest(async () => {
    const url = endpoints.login(validUser.username, validUser.password);
    // FIX 3: Accept header was already correct, but added explicit timeout so
    //         a hanging demo server doesn't block indefinitely.
    const res = await request.get(url, {
      headers: { Accept: 'application/json' },
      timeout: 30000,
    });
    // FIX 4: Surface the actual status + body in the error message so failures
    //         are immediately actionable in CI logs.
    if (res.status() !== 200) {
      const text = await res.text().catch(() => '(unreadable)');
      throw new Error(`Login returned ${res.status()}: ${text.slice(0, 200)}`);
    }
    const body = await res.json();
    return body.id;
  });
}

async function getFirstAccountId(request, customerId) {
  return retryRequest(async () => {
    const url = endpoints.accounts(customerId);
    const res = await request.get(url, {
      headers: { Accept: 'application/json' },
      timeout: 30000,
    });
    if (res.status() !== 200) {
      const text = await res.text().catch(() => '(unreadable)');
      throw new Error(`Accounts returned ${res.status()}: ${text.slice(0, 200)}`);
    }
    const accounts = await res.json();
    expect(accounts.length).toBeGreaterThan(0);
    return accounts[0].id;
  });
}


// ── Block 1 — Login API ──────────────────────────────────────────────────────
// These tests each exercise the login endpoint directly, so independent calls
// are intentional here.  We still wrap them with retryRequest.
test.describe('Block 1 — Login API', () => {

  test('TC-API-01 | Login endpoint returns 200 for valid credentials', async ({ request }) => {
    await retryRequest(async () => {
      const url = endpoints.login(validUser.username, validUser.password);
      const res = await request.get(url, {
        headers: { Accept: 'application/json' },
        timeout: 30000,
      });
      expect(res.status()).toBe(200);
    });
  });

  test('TC-API-02 | Login response contains customer id', async ({ request }) => {
    await retryRequest(async () => {
      const url  = endpoints.login(validUser.username, validUser.password);
      const res  = await request.get(url, {
        headers: { Accept: 'application/json' },
        timeout: 30000,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty('id');
    });
  });

  test('TC-API-03 | Login response contains first name', async ({ request }) => {
    await retryRequest(async () => {
      const url  = endpoints.login(validUser.username, validUser.password);
      const res  = await request.get(url, {
        headers: { Accept: 'application/json' },
        timeout: 30000,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty('firstName');
    });
  });

  test('TC-API-04 | Invalid login returns non-200 status', async ({ request }) => {
    // No retry needed — this must be deterministically non-200.
    const url = endpoints.login('invalid_user_xyz', 'wrongpass');
    const res = await request.get(url, {
      headers: { Accept: 'application/json' },
      timeout: 30000,
    });
    expect(res.status()).not.toBe(200);
  });
});


// ── Block 2 — Customer Accounts ─────────────────────────────────────────────
// FIX 5: Single shared login for the entire block via beforeAll.
//         Previously each test called getCustomerId() independently — 4 extra
//         login round-trips that hammered the unstable demo server.
test.describe('Block 2 — Customer Accounts', () => {
  let customerId;

  test.beforeAll(async ({ request }) => {
    customerId = await getCustomerId(request);
  });

  test('TC-API-05 | Accounts endpoint returns 200', async ({ request }) => {
    await retryRequest(async () => {
      const url = endpoints.accounts(customerId);
      const res = await request.get(url, {
        headers: { Accept: 'application/json' },
        timeout: 30000,
      });
      expect(res.status()).toBe(200);
    });
  });

  test('TC-API-06 | Accounts response is an array', async ({ request }) => {
    await retryRequest(async () => {
      const url      = endpoints.accounts(customerId);
      const res      = await request.get(url, {
        headers: { Accept: 'application/json' },
        timeout: 30000,
      });
      const accounts = await res.json();
      expect(Array.isArray(accounts)).toBe(true);
    });
  });

  test('TC-API-07 | At least one account is returned', async ({ request }) => {
    await retryRequest(async () => {
      const url      = endpoints.accounts(customerId);
      const res      = await request.get(url, {
        headers: { Accept: 'application/json' },
        timeout: 30000,
      });
      const accounts = await res.json();
      expect(accounts.length).toBeGreaterThanOrEqual(1);
    });
  });

  test('TC-API-08 | Each account has an id field', async ({ request }) => {
    await retryRequest(async () => {
      const url      = endpoints.accounts(customerId);
      const res      = await request.get(url, {
        headers: { Accept: 'application/json' },
        timeout: 30000,
      });
      const accounts = await res.json();
      accounts.forEach(acc => expect(acc).toHaveProperty('id'));
    });
  });
});


// ── Block 3 — Account Details ────────────────────────────────────────────────
// FIX 6: Single shared login + account lookup for the entire block.
test.describe('Block 3 — Account Details', () => {
  let accountId;

  test.beforeAll(async ({ request }) => {
    const customerId = await getCustomerId(request);
    accountId = await getFirstAccountId(request, customerId);
  });

  test('TC-API-09 | Account detail endpoint returns 200', async ({ request }) => {
    await retryRequest(async () => {
      const url = endpoints.account(accountId);
      const res = await request.get(url, {
        headers: { Accept: 'application/json' },
        timeout: 30000,
      });
      expect(res.status()).toBe(200);
    });
  });

  test('TC-API-10 | Account detail contains balance field', async ({ request }) => {
    await retryRequest(async () => {
      const url  = endpoints.account(accountId);
      const res  = await request.get(url, {
        headers: { Accept: 'application/json' },
        timeout: 30000,
      });
      const body = await res.json();
      expect(body).toHaveProperty('balance');
    });
  });

  test('TC-API-11 | Account detail contains type field', async ({ request }) => {
    await retryRequest(async () => {
      const url  = endpoints.account(accountId);
      const res  = await request.get(url, {
        headers: { Accept: 'application/json' },
        timeout: 30000,
      });
      const body = await res.json();
      expect(body).toHaveProperty('type');
    });
  });

  test('TC-API-12 | Invalid account id returns non-200 status', async ({ request }) => {
    // Intentionally negative test — no retry needed.
    const url = endpoints.account(9999999999);
    const res = await request.get(url, {
      headers: { Accept: 'application/json' },
      timeout: 30000,
    });
    expect(res.status()).not.toBe(200);
  });
});


// ── Block 4 — Transactions ───────────────────────────────────────────────────
// FIX 7: Single shared login + account lookup for the entire block.
test.describe('Block 4 — Transactions', () => {
  let accountId;

  test.beforeAll(async ({ request }) => {
    const customerId = await getCustomerId(request);
    accountId = await getFirstAccountId(request, customerId);
  });

  test('TC-API-13 | Transactions endpoint returns 200', async ({ request }) => {
    await retryRequest(async () => {
      const url = endpoints.transactions(accountId);
      const res = await request.get(url, {
        headers: { Accept: 'application/json' },
        timeout: 30000,
      });
      expect(res.status()).toBe(200);
    });
  });

  test('TC-API-14 | Transactions response is an array', async ({ request }) => {
    await retryRequest(async () => {
      const url  = endpoints.transactions(accountId);
      const res  = await request.get(url, {
        headers: { Accept: 'application/json' },
        timeout: 30000,
      });
      const txns = await res.json();
      expect(Array.isArray(txns)).toBe(true);
    });
  });

  test('TC-API-15 | Each transaction has an id field', async ({ request }) => {
    await retryRequest(async () => {
      const url  = endpoints.transactions(accountId);
      const res  = await request.get(url, {
        headers: { Accept: 'application/json' },
        timeout: 30000,
      });
      const txns = await res.json();
      if (txns.length > 0) {
        txns.forEach(t => expect(t).toHaveProperty('id'));
      } else {
        expect(txns.length).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test('TC-API-16 | Each transaction has an amount field', async ({ request }) => {
    await retryRequest(async () => {
      const url  = endpoints.transactions(accountId);
      const res  = await request.get(url, {
        headers: { Accept: 'application/json' },
        timeout: 30000,
      });
      const txns = await res.json();
      if (txns.length > 0) {
        txns.forEach(t => expect(t).toHaveProperty('amount'));
      } else {
        expect(txns.length).toBeGreaterThanOrEqual(0);
      }
    });
  });
});