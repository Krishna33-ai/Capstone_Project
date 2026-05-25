

const { test, expect } = require('@playwright/test');

test('SMOKE | ParaBank homepage loads successfully', async ({ page }) => {
  await page.goto('/index.htm');
  await expect(page).toHaveTitle(/ParaBank/);
  await expect(page.locator('#loginPanel')).toBeVisible();
});
