import { test, expect } from '../fixtures/custom.fixture';
import { customerData } from 'src/data';
import { URL } from 'src/constants';

const username: string = process.env.CUSTOMER_USERNAME;

test.describe('Login page', { tag: ['@login'] }, () => {
    test('should be able to login with a valid user', async ({ basePage, accountOverviewPage }) => {
        await basePage.sidebar.loginUser(username, customerData.password);

        const completeName: string = `${customerData.firstName} ${customerData.lastName}`;
        expect.soft(basePage.sidebar.welcomeMsg).toHaveText(`Welcome ${completeName}`);

        const accountsQty: number = await accountOverviewPage.getAccountsQty();
        expect(accountsQty).toBeGreaterThan(0);
    });

    test('should be able to log out an user', async ({ basePage, homePage, page }) => {
        await basePage.sidebar.loginUser(username, customerData.password);
        await homePage.sidebar.logOutUser();

        await expect(basePage.sidebar.loginPanel).toBeVisible();
        expect(page.url()).toContain(URL.BASE);
    });
});
