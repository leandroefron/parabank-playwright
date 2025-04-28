# 🧪 Parabank Playwright Tests

This project contains end-to-end tests for [Parabank](https://parabank.parasoft.com/parabank/index.htm) using [Playwright](https://playwright.dev/). You can run the tests either locally or inside a Docker container.

## 📂 Project Structure

```bash
parabank-playwright/
│
├── config/                      # 🔧 Setup scripts (DB, user)
│   ├── createCustomer.setup.ts  # → Creates test customer
│   ├── global.setup.ts          # → Global setup before tests
│   └── init.setup.ts            # → Inits database and sets up params
│
├── playwright/                  # ⚙️ Playwright-specific configs
│   └── .auth/                   # → Stores login state
│       └── customer.json        # → Auth state (login cookie, token, etc.)
│
├── reports/                     # 📈 HTML test reports
│   └── index.html
│
├── src/                         # 🧠 Main app code & tests
│   ├── constants/               # → URLs, messages, titles
│   ├── data/                    # → Test data (JSON, CSV, etc.)
│   ├── fixtures/                # → Reusable test setup/teardown logic
│   ├── interfaces/              # → TypeScript interfaces & types
│   ├── pages/                   # → Page Object Model classes (LoginPage, RequestLoan, etc.)
│   ├── tests/                   # → Actual test specs
│   └── util/                    # → Helper and api functions
│
├── test-results/                # 🖼 Screenshots, traces, etc.
│
├── .env                         # 🌱 Env vars (like BASE_URL, USER_EMAIL, etc.)
├── .gitignore                   # 🚫 Ignore node_modules, .env, dist, etc.
├── .prettierrc.json             # 🎨 Prettier configuration for consistent code formatting
├── Dockerfile                   # 🐳 Docker config for running tests
├── package.json                 # 📦 Dependencies & npm scripts
├── playwright.config.ts         # 🎯 Playwright global config
├── README.md                    # 📖 How to run, setup, etc.
└── tsconfig.json                # 🧪 TypeScript config
```

## ✅ Prerequisites

### For Local Runs:

- [Node.js](https://nodejs.org/en/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [Playwright](https://playwright.dev/) (see setup below)

### For Docker Runs:

- [Docker](https://www.docker.com/) installed and running

## ⚙️ Setup

### 1. Clone the Repo

```bash
git clone [repo link]
cd parabank-playwright
```

### 2. Install Dependencies (Local)

```bash
npm install
npx playwright install
```

## 🧪 Run Tests

### 💻 Run Locally

Run all tests:

```bash
npm run test:local
```

Run a specific test by tag:

```bash
npx playwright test -g @[tag]
```

Possibles tags:

- login
- register
- customers
- accounts
- bills
- loans
- transfers

---

### 🐳 Run in Docker

This method ensures environment consistency with no local setup needed.\
Running this command will build the Docker image and then run the tests inside the Docker container.

```bash
npm run test:docker
```

## 📈 Reporting

Test reports are generated locally. You can view the report in one of the following ways:

- Open the link displayed at the end of the test run in your terminal.
- Run `npm run reports`

## 🛠 Project Features

- **Customer Registration:** Automates the process of registering a new customer.
- **Login and Logout:** Validates customer login and logout functionality.
- **Account Management:** Tests account creation and overview.
- **Fund Transfers:** Verifies fund transfer between accounts.
- **Bill Payments:** Automates bill payment functionality.
- **Loan Requests:** Tests loan application and approval/denial scenarios.

## 🎯 Formatting

To maintain consistent code style across the project, run following scripts:

- **`prettier:check`**: Check code formatting using Prettier.
- **`prettier:fix`**: Automatically fix code formatting issues using Prettier.

The project uses a custom Prettier configuration defined in the `.prettierrc.json` file
