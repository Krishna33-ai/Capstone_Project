# ParaBank Playwright Capstone

Playwright POM test suite covering **8 services** of [ParaBank](https://parabank.parasoft.com), with **Allure** reporting and **GitHub Actions** CI.

---

## Project Structure

```
parabank-playwright/
├── .github/
│   └── workflows/
│       └── playwright.yml      ← GitHub Actions CI pipeline
├── fixtures/
│   └── testData.js             ← Unified test data for all 8 services
├── pages/                      ← Page Object Model classes
│   ├── BasePage.js
│   ├── AuthPage.js
│   ├── AccountPage.js
│   ├── TransferPage.js
│   ├── TransactionPage.js
│   ├── BillPage.js
│   ├── LoanPage.js
│   └── ProfilePage.js
├── tests/                      ← Spec files (1 per service)
│   ├── auth.spec.js            ← SERVICE 1 — Authentication
│   ├── account.spec.js         ← SERVICE 2 — Account Overview
│   ├── transfer.spec.js        ← SERVICE 3 — Fund Transfer
│   ├── transaction.spec.js     ← SERVICE 4 — Transaction History
│   ├── bill.spec.js            ← SERVICE 5 — Bill Payment
│   ├── loan.spec.js            ← SERVICE 6 — Loan Request
│   ├── profile.spec.js         ← SERVICE 7 — User Profile
│   └── api.spec.js             ← SERVICE 8 — Internal API
├── playwright.config.js
├── package.json
└── .gitignore
```

---

## How to Push to GitHub and Run in CI

### Step 1 — Create a GitHub repository
1. Go to https://github.com and click **New repository**
2. Name it `parabank-playwright` (or anything you like)
3. Leave it **Public**, do NOT add README or .gitignore (we have our own)
4. Click **Create repository**

### Step 2 — Push this project
Open a terminal in the extracted folder and run:

```bash
git init
git add .
git commit -m "Initial commit — 8 service Playwright POM suite"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/parabank-playwright.git
git push -u origin main
```
Replace `YOUR_USERNAME` with your GitHub username.

### Step 3 — Watch it run
- Go to your repo → click the **Actions** tab
- You'll see the **Playwright Tests & Allure Report** workflow running automatically
- It runs 3 parallel shards, then merges results and generates the Allure report

### Step 4 — Enable GitHub Pages (for Allure report URL)
1. Go to repo **Settings → Pages**
2. Under **Source**, select branch `gh-pages`, folder `/ (root)`
3. Click **Save**
4. After the next push to `main`, your report will be live at:
   `https://YOUR_USERNAME.github.io/parabank-playwright`

---

## Running Locally

```bash
npm install
npx playwright install
npm test                        # run all tests
npm run test:chromium           # chromium only
npx playwright test --headed    # see the browser
npm run allure:report           # generate + open Allure report
```

---

## Test Count Summary

| Service | Spec File | Tests |
|---|---|---|
| Authentication | auth.spec.js | 17 |
| Account Overview | account.spec.js | 16 |
| Fund Transfer | transfer.spec.js | 16 |
| Transaction History | transaction.spec.js | 17 |
| Bill Payment | bill.spec.js | 15 |
| Loan Request | loan.spec.js | 15 |
| User Profile | profile.spec.js | 17 |
| Internal API | api.spec.js | 16 |
| **Total** | | **129** |
