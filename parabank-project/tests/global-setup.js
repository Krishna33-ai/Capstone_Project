// tests/global-setup.js
// Runs ONCE before the entire Playwright suite.
//
// WHY THIS EXISTS
// ───────────────
// ParaBank's demo server is public and shared. The database gets wiped
// whenever Parasoft restarts it, removing the john/demo account entirely.
// Hitting /initializeDB reseeds the DB with john/demo plus sample accounts,
// so every test starts from a known-good state regardless of server history.
//
// ADDITIONAL FIX — SERVER WARM-UP:
// In CI (GitHub Actions) ParaBank's server is often in a cold-start state
// at the beginning of a test run. The first request takes 30-60 s, causing
// the first test's login() to time out even with generous waitFor timeouts.
// This global-setup now:
//   1. Hits /initializeDB (reseeds DB) with retries
//   2. Hits the homepage (/parabank/index.htm) to warm up the JVM/servlet
//      container so the first real test sees a warm server
// Both steps are non-fatal — if they fail we warn and continue.

const { request } = require('@playwright/test');

async function retryGet(ctx, url, retries = 3, timeoutMs = 60000) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await ctx.get(url, { timeout: timeoutMs });
      return res;
    } catch (err) {
      lastErr = err;
      if (i < retries - 1) {
        console.warn(`[global-setup] Attempt ${i + 1} failed for ${url}: ${err.message} — retrying in 5 s…`);
        await new Promise(r => setTimeout(r, 5000));
      }
    }
  }
  throw lastErr;
}

module.exports = async function globalSetup() {
  const ctx = await request.newContext({
    baseURL: 'https://parabank.parasoft.com',
  });

  try {
    // ── Step 1: Initialise the database ────────────────────────────────────────
    console.log('[global-setup] Initialising ParaBank database…');
    try {
      const res = await retryGet(
        ctx,
        'https://parabank.parasoft.com/parabank/services/bank/initializeDB',
        3,
        60000
      );
      if (res.ok()) {
        console.log('[global-setup] ParaBank DB initialised successfully.');
      } else {
        console.warn(`[global-setup] initializeDB returned ${res.status()} — continuing anyway.`);
      }
    } catch (err) {
      console.warn('[global-setup] initializeDB failed after retries:', err.message);
      console.warn('[global-setup] Continuing — john/demo may already exist.');
    }

    // ── Step 2: Warm up the server ─────────────────────────────────────────────
    // Sending a GET to the homepage pre-heats ParaBank's JVM / servlet container.
    // Without this, the first test's login() can time out (30+ s cold start)
    // even though the server is technically reachable. This is the primary cause
    // of the mass login timeouts seen in CI across all three browsers.
    console.log('[global-setup] Warming up ParaBank server…');
    try {
      const warmRes = await retryGet(
        ctx,
        'https://parabank.parasoft.com/parabank/index.htm',
        3,
        60000
      );
      console.log(`[global-setup] Server warm-up complete (status ${warmRes.status()}).`);
    } catch (err) {
      console.warn('[global-setup] Server warm-up failed:', err.message);
      console.warn('[global-setup] Tests will proceed — first login may be slow.');
    }

    // ── Step 3: Brief pause to let server settle ───────────────────────────────
    console.log('[global-setup] Waiting 3 s for server to settle…');
    await new Promise(r => setTimeout(r, 3000));
    console.log('[global-setup] Global setup complete.');

  } finally {
    await ctx.dispose();
  }
};