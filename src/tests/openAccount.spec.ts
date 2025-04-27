import { test, expect } from '../fixtures/custom.fixture';
import { AccountOverviewPage } from 'src/pages/accountOverview.page';
import { MINIMUM_BALANCE } from 'src/constants';

test.describe('Accounts tests @all', { tag: ['@accounts'] }, () => {
    test('should be able to open a new account successfully', async ({ openNewAccountPage }) => {
        const accountNumber: string = await openNewAccountPage.openNewAccount('0', process.env.CUSTOMER_DEFAULT_ACCOUNT);

        const accountOverviewPage: AccountOverviewPage = await openNewAccountPage.sidebar.openAccountsOverview();

        const balance: string = await accountOverviewPage.getBalanceFromAccount(accountNumber);

        expect(balance).toBe(MINIMUM_BALANCE);
    });
});
