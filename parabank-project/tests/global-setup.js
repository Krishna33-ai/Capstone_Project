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
// HOW TO REGISTER IT
// ──────────────────
// In playwright.config.js add:
//   globalSetup: require.resolve('./tests/global-setup'),

const { request } = require('@playwright/test');

module.exports = async function globalSetup() {
  const ctx = await request.newContext();
  try {
    console.log('[global-setup] Initialising ParaBank database…');
    const res = await ctx.get(
      'https://parabank.parasoft.com/parabank/services/bank/initializeDB',
      { timeout: 30000 }
    );
    if (res.ok()) {
      console.log('[global-setup] ParaBank DB initialised successfully.');
    } else {
      // Non-fatal: warn but don't abort the run.
      // The john/demo account may still exist from a previous init.
      console.warn(`[global-setup] initializeDB returned ${res.status()} — continuing anyway.`);
    }
  } catch (err) {
    console.warn('[global-setup] initializeDB request failed:', err.message);
    console.warn('[global-setup] Continuing — john/demo may already exist.');
  } finally {
    await ctx.dispose();
  }
};
