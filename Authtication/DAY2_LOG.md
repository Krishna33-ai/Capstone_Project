# Day 2 — Authentication Service (Service 1 of 8)

## 📅 Date: Day 2
## 👤 Candidate: Siva 
## 🎯 Target Site: https://parabank.parasoft.com
## 🛠️ Framework: Playwright v1.44+ | JavaScript (Node.js) | Chromium

---

## ✅ What Was Done Today

### Files Created
| File | Purpose |
|------|---------|
| `pages/AuthPage.js` | Full POM for login, logout, registration |
| `tests/auth.spec.js` | 15 authentication test cases |
| `fixtures/testData.js` | Updated with ParaBank-specific data |
| `playwright.config.js` | Updated baseURL to ParaBank |

---

## 🧪 15 Test Cases — Authentication

| # | Test ID | Description | Block |
|---|---------|-------------|-------|
| 1 | TC-AUTH-01 | Login panel renders on homepage | UI Verification |
| 2 | TC-AUTH-02 | Register link is present | UI Verification |
| 3 | TC-AUTH-03 | Registration form has all required fields | UI Verification |
| 4 | TC-AUTH-04 | Valid credentials → successful login | Valid Login |
| 5 | TC-AUTH-05 | Logged-in user sees Account Services panel | Valid Login |
| 6 | TC-AUTH-06 | Logout redirects to Customer Login page | Logout |
| 7 | TC-AUTH-07 | Wrong password → error message shown | Invalid Creds |
| 8 | TC-AUTH-08 | Wrong username → error message shown | Invalid Creds |
| 9 | TC-AUTH-09 | Empty username and password → error shown | Invalid Creds |
| 10 | TC-AUTH-10 | Empty username only → error shown | Invalid Creds |
| 11 | TC-AUTH-11 | SQL injection → not logged in | Invalid Creds |
| 12 | TC-AUTH-12 | New user registers successfully | Registration |
| 13 | TC-AUTH-13 | After registration user is auto-logged-in | Registration |
| 14 | TC-AUTH-14 | Unauthenticated access to /overview → redirect | Session |
| 15 | TC-AUTH-15 | After logout, back-button doesn't restore session | Session |

---

## 📌 Tomorrow (Day 3)
- Build `ProductPage.js`
- Write `product.spec.js` (15 tests)
- Cover: product listing, search, detail view, categories
