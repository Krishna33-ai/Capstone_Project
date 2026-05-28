# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api.spec.js >> Block 4 — Transactions >> TC-API-13 | Transactions endpoint returns 200
- Location: tests/api.spec.js:253:3

# Error details

```
Error: Login returned 400: Invalid username and/or password
```

# Test source

```ts
  1   | // tests/api.spec.js
  2   | // SERVICE 8 — Internal API | 16 Test Cases
  3   | // Target : https://parabank.parasoft.com/parabank/services/bank
  4   | // Covers : Login API, customer accounts, account details, transactions
  5   | 
  6   | const { test, expect } = require('@playwright/test');
  7   | const TEST_DATA = require('../fixtures/testData');
  8   | 
  9   | const { validUser, endpoints } = TEST_DATA;
  10  | 
  11  | // ─────────────────────────────────────────────────────────────────────────────
  12  | // FIX 1: Cache customerId + accountId at the describe-block level so we only
  13  | //         call login ONCE per block, not once per test.  The public ParaBank
  14  | //         demo is slow and unstable; hammering it with a fresh login for every
  15  | //         single test is the primary cause of cascading 14-test failures.
  16  | // ─────────────────────────────────────────────────────────────────────────────
  17  | 
  18  | // ── Helper: login via API and return customerId ──────────────────────────────
  19  | // FIX 2: Added explicit retryRequest wrapper so transient 5xx / network blips
  20  | //         on the demo server don't immediately fail the test.
  21  | async function retryRequest(fn, retries = 3, delayMs = 2000) {
  22  |   let lastError;
  23  |   for (let i = 0; i < retries; i++) {
  24  |     try {
  25  |       return await fn();
  26  |     } catch (err) {
  27  |       lastError = err;
  28  |       if (i < retries - 1) await new Promise(r => setTimeout(r, delayMs));
  29  |     }
  30  |   }
  31  |   throw lastError;
  32  | }
  33  | 
  34  | async function getCustomerId(request) {
  35  |   return retryRequest(async () => {
  36  |     const url = endpoints.login(validUser.username, validUser.password);
  37  |     // FIX 3: Accept header was already correct, but added explicit timeout so
  38  |     //         a hanging demo server doesn't block indefinitely.
  39  |     const res = await request.get(url, {
  40  |       headers: { Accept: 'application/json' },
  41  |       timeout: 30000,
  42  |     });
  43  |     // FIX 4: Surface the actual status + body in the error message so failures
  44  |     //         are immediately actionable in CI logs.
  45  |     if (res.status() !== 200) {
  46  |       const text = await res.text().catch(() => '(unreadable)');
> 47  |       throw new Error(`Login returned ${res.status()}: ${text.slice(0, 200)}`);
      |             ^ Error: Login returned 400: Invalid username and/or password
  48  |     }
  49  |     const body = await res.json();
  50  |     return body.id;
  51  |   });
  52  | }
  53  | 
  54  | async function getFirstAccountId(request, customerId) {
  55  |   return retryRequest(async () => {
  56  |     const url = endpoints.accounts(customerId);
  57  |     const res = await request.get(url, {
  58  |       headers: { Accept: 'application/json' },
  59  |       timeout: 30000,
  60  |     });
  61  |     if (res.status() !== 200) {
  62  |       const text = await res.text().catch(() => '(unreadable)');
  63  |       throw new Error(`Accounts returned ${res.status()}: ${text.slice(0, 200)}`);
  64  |     }
  65  |     const accounts = await res.json();
  66  |     expect(accounts.length).toBeGreaterThan(0);
  67  |     return accounts[0].id;
  68  |   });
  69  | }
  70  | 
  71  | 
  72  | // ── Block 1 — Login API ──────────────────────────────────────────────────────
  73  | // These tests each exercise the login endpoint directly, so independent calls
  74  | // are intentional here.  We still wrap them with retryRequest.
  75  | test.describe('Block 1 — Login API', () => {
  76  | 
  77  |   test('TC-API-01 | Login endpoint returns 200 for valid credentials', async ({ request }) => {
  78  |     await retryRequest(async () => {
  79  |       const url = endpoints.login(validUser.username, validUser.password);
  80  |       const res = await request.get(url, {
  81  |         headers: { Accept: 'application/json' },
  82  |         timeout: 30000,
  83  |       });
  84  |       expect(res.status()).toBe(200);
  85  |     });
  86  |   });
  87  | 
  88  |   test('TC-API-02 | Login response contains customer id', async ({ request }) => {
  89  |     await retryRequest(async () => {
  90  |       const url  = endpoints.login(validUser.username, validUser.password);
  91  |       const res  = await request.get(url, {
  92  |         headers: { Accept: 'application/json' },
  93  |         timeout: 30000,
  94  |       });
  95  |       expect(res.status()).toBe(200);
  96  |       const body = await res.json();
  97  |       expect(body).toHaveProperty('id');
  98  |     });
  99  |   });
  100 | 
  101 |   test('TC-API-03 | Login response contains first name', async ({ request }) => {
  102 |     await retryRequest(async () => {
  103 |       const url  = endpoints.login(validUser.username, validUser.password);
  104 |       const res  = await request.get(url, {
  105 |         headers: { Accept: 'application/json' },
  106 |         timeout: 30000,
  107 |       });
  108 |       expect(res.status()).toBe(200);
  109 |       const body = await res.json();
  110 |       expect(body).toHaveProperty('firstName');
  111 |     });
  112 |   });
  113 | 
  114 |   test('TC-API-04 | Invalid login returns non-200 status', async ({ request }) => {
  115 |     // No retry needed — this must be deterministically non-200.
  116 |     const url = endpoints.login('invalid_user_xyz', 'wrongpass');
  117 |     const res = await request.get(url, {
  118 |       headers: { Accept: 'application/json' },
  119 |       timeout: 30000,
  120 |     });
  121 |     expect(res.status()).not.toBe(200);
  122 |   });
  123 | });
  124 | 
  125 | 
  126 | // ── Block 2 — Customer Accounts ─────────────────────────────────────────────
  127 | // FIX 5: Single shared login for the entire block via beforeAll.
  128 | //         Previously each test called getCustomerId() independently — 4 extra
  129 | //         login round-trips that hammered the unstable demo server.
  130 | test.describe('Block 2 — Customer Accounts', () => {
  131 |   let customerId;
  132 | 
  133 |   test.beforeAll(async ({ request }) => {
  134 |     customerId = await getCustomerId(request);
  135 |   });
  136 | 
  137 |   test('TC-API-05 | Accounts endpoint returns 200', async ({ request }) => {
  138 |     await retryRequest(async () => {
  139 |       const url = endpoints.accounts(customerId);
  140 |       const res = await request.get(url, {
  141 |         headers: { Accept: 'application/json' },
  142 |         timeout: 30000,
  143 |       });
  144 |       expect(res.status()).toBe(200);
  145 |     });
  146 |   });
  147 | 
```