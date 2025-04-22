import { test, expect } from '../fixtures/custom.fixture';
import { AccountOverviewPage } from 'src/pages/accountOverview.page';

test.describe('Accounts tests', { tag: ['@accounts'] }, () => {
    test('should be able to open a new account', async ({ openNewAccountPage, homePage }) => {
        await openNewAccountPage.openNewAccount('CHECKING');

        const accountOverviewPage: AccountOverviewPage = await homePage.sidebar.openAccountsOverview();

        const availableAmount: string = await accountOverviewPage.getAvailableAmount(process.env.CUSTOMER_NEW_ACCOUNT_ID);

        const expectedAmount: string = process.env.MIN_BALANCE;

        expect(availableAmount).toBe(expectedAmount);
    });
});
