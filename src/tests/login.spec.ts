import { test, expect } from '../fixtures/custom.fixture';
import { userData } from 'src/data';
import { URL, TITLES } from 'src/constants';
const username: string = process.env.CUSTOMER_USERNAME;

test.describe('Login page tests', { tag: ['@login'] }, () => {
    test('should be able to login with a valid user', async ({ basePage, homePage, accountOverviewPage }) => {
        await basePage.sidebar.loginUser(username, userData.password);

        expect.soft(homePage.sidebar.welcomeMsg).toHaveText(`Welcome ${userData.firstName} ${userData.lastName}`);

        const accountsQty: number = await accountOverviewPage.getAccountsQty();
        expect(accountsQty).toBeGreaterThan(0);
    });

    test('should be able to log out a user', async ({ basePage, homePage, page }) => {
        await basePage.sidebar.loginUser(username, userData.password);
        await homePage.sidebar.logOutUser();

        expect(homePage.sidebar.title).toHaveText(TITLES.CUSTOMER_LOGIN);
        expect(page.url()).toContain(URL.LANDING);
    });
});
