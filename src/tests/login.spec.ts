import { test, expect } from '@/fixtures/custom.fixture';
import { customerData } from '@/data';
import { URLS, TITLES } from '@/constants';

const username: string = process.env.CUSTOMER_USERNAME;

test.describe('Login page @all', { tag: ['@login'] }, () => {
    test('should login successfully with valid credentials', async ({ basePage, accountOverviewPage }) => {
        await basePage.sidebar.loginUser(username, customerData.password);

        const result: string = await basePage.getResultText();
        expect(result).toContain(TITLES.ACCOUNTS_OVERVIEW);

        const completeName: string = `${customerData.firstName} ${customerData.lastName}`;
        expect.soft(basePage.sidebar.welcomeMsg).toHaveText(`Welcome ${completeName}`);

        const accountsQty: number = await accountOverviewPage.getAccountsQty();
        expect(accountsQty).toBeGreaterThan(0);
    });

    test('should log out successfully', async ({ basePage, page }) => {
        await basePage.sidebar.loginUser(username, customerData.password);
        expect(page).toHaveURL(URLS.OVERVIEW);

        await basePage.sidebar.logOutUser();

        await expect(basePage.sidebar.loginPanel).toBeVisible();
        expect(page.url()).toContain(URLS.BASE);
    });
});
