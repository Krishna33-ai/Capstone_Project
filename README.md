# Capstone Project — Enterprise QE with Playwright & GenAI

**Candidate:** Siva
**Target Site:** [ParaBank](https://parabank.parasoft.com)
**Framework:** Playwright v1.4x+ | JavaScript (Node.js) | Chromium · Firefox · WebKit

---

## What This Project Is

This is a production-grade test automation framework built for the Wipro NGA Capstone.
It covers 8 banking services on ParaBank with 15 test cases each — 120 tests total —
across three browsers using the Page Object Model architecture.

---

## Project Structure

```
capstoneProject/
├── project1-pom/
│   ├── pages/
│   │   ├── BasePage.js
│   │   ├── AuthPage.js
│   │   ├── AccountPage.js
│   │   ├── TransferPage.js
│   │   ├── HistoryPage.js
│   │   ├── BillPayPage.js
│   │   ├── LoanPage.js
│   │   ├── ProfilePage.js
│   │   └── ApiService.js
│   ├── tests/
│   │   ├── auth.spec.js
│   │   ├── account.spec.js
│   │   ├── transfer.spec.js
│   │   ├── history.spec.js
│   │   ├── billpay.spec.js
│   │   ├── loan.spec.js
│   │   ├── profile.spec.js
│   │   └── api.spec.js
│   ├── fixtures/
│   │   └── testData.js
│   └── playwright.config.js
├── project2-svg/
│   ├── tests/
│   └── playwright.config.js
├── .github/
│   └── workflows/
│       └── playwright.yml
├── package.json
└── README.md
```

---

## Services Covered

| # | Service | Test File |
|---|---------|-----------|
| 1 | Authentication | auth.spec.js |
| 2 | Account Overview | account.spec.js |
| 3 | Fund Transfer | transfer.spec.js |
| 4 | Transaction History | history.spec.js |
| 5 | Bill Payment | billpay.spec.js |
| 6 | Loan Request | loan.spec.js |
| 7 | User Profile | profile.spec.js |
| 8 | Internal API | api.spec.js |

---

## Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/capstoneProject.git
cd capstoneProject

# Install dependencies
npm install

# Install all browsers
npx playwright install

# Run all tests
npm run test:project1

# View report
npm run report
```

---

## Run Individual Services

```bash
npm run test:auth
npm run test:account
npm run test:transfer
npm run test:history
npm run test:billpay
npm run test:loan
npm run test:profile
npm run test:api
```

---

## Day-wise Progress

| Day | Deliverable | Status |
|-----|-------------|--------|
| Day 1 | Project setup, config, BasePage | ✅ Done |
| Day 2 | AuthPage.js + auth.setup.js | 🔲 |
| Day 3 | auth.spec.js — 15 tests | 🔲 |
| Day 4 | AccountPage.js + 15 tests | 🔲 |
| Day 5 | TransferPage.js + 15 tests | 🔲 |
| Day 6 | HistoryPage.js + 15 tests | 🔲 |
| Day 7 | BillPayPage.js + 15 tests | 🔲 |
| Day 8 | LoanPage.js + 15 tests | 🔲 |
| Day 9 | ProfilePage.js + 15 tests | 🔲 |
| Day 10 | ApiService.js + 15 tests | 🔲 |
| Day 11 | Project 2 SVG tests | 🔲 |
| Day 12 | CI/CD finalization | 🔲 |
| Day 13 | Cleanup + GenAI/MCP docs | 🔲 |

---

## Commit Convention

```
Day{N}: <what was built>

Examples:
Day1: Project setup — playwright config, BasePage, testData, CI scaffold
Day3: auth.spec.js — 15 authentication test cases complete
Day10: api.spec.js — 15 API test cases using Playwright request context
```

---

## Tech Stack

- Playwright v1.4x+
- JavaScript (Node.js 20)
- Chromium, Firefox, WebKit
- Page Object Model (POM)
- GitHub Actions CI/CD
- Playwright HTML Reporter
- Model Context Protocol (MCP) — GenAI integration
