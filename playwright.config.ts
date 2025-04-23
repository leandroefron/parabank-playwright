import { defineConfig } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

export const STORAGE_STATE: string = path.join(__dirname, 'playwright/.auth/customer.json');

dotenv.config();

export default defineConfig({
    testDir: './src/tests',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : 10,

    // Timeouts for assertions
    expect: {
        timeout: 10_000
    },

    // Reporters
    reporter: [
        ['html', { open: 'never', outputFolder: 'reports' }],
        ['list', { printSteps: true }]
    ],

    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        baseURL: 'https://parabank.parasoft.com',

        actionTimeout: 1000,
        trace: 'on-first-retry',
        headless: false,

        // Enables data-testid attribute using id
        testIdAttribute: 'id',

        // Takes a screenshot on failure
        screenshot: 'only-on-failure'
    },

    projects: [
        {
            name: 'init-setup',
            testDir: './config',
            testMatch: 'init.setup.ts'
        },
        {
            name: 'create-customer',
            testDir: './config',
            testMatch: 'createCustomer.setup.ts',
            dependencies: ['init-setup']
        },
        {
            name: 'e2e-tests',
            use: { storageState: STORAGE_STATE },
            testDir: './src/tests',
            testMatch: ['userInfo.spec.ts', 'accounts.spec.ts', 'openNewAccount.spec.ts', 'billPay.spec.ts', 'transferFunds.spec.ts', 'requestLoan.spec.ts'],
            dependencies: ['create-customer']
        },
        {
            name: 'e2e-tests',
            testDir: './src/tests',
            testMatch: ['login.spec.ts', 'register.spec.ts'],
            dependencies: ['create-customer']
        }
    ],
});
