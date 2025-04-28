import { test, expect } from '@/fixtures/custom.fixture';
import { AccountOverviewPage } from 'src/pages/accountOverview.page';
import { MINIMUM_BALANCE, TITLES } from '@/constants';
import { normalizeAmount } from 'src/util/helpers';

test.describe('Accounts tests', { tag: ['@accounts'] }, () => {
    test('should be able to open a new account successfully', async ({ openNewAccountPage }) => {
        await openNewAccountPage.openNewAccount('0', process.env.CUSTOMER_DEFAULT_ACCOUNT);

        const result: string = await openNewAccountPage.getResultText();
        expect(result).toContain(TITLES.ACCOUNT_OPENED);

        const accountNumber: string = (await openNewAccountPage.newAccountNumber.textContent())?.trim();
        const balance: string = await getAccountBalance(openNewAccountPage, accountNumber);

        expect(balance).toBe(normalizeAmount(MINIMUM_BALANCE));
    });
});

/**
 * Navigates to the account overview page and retrieves the balance for a specific account.
 *
 * @param openNewAccountPage - The page object for opening a new account.
 * @param accountNumber - The account number to retrieve the balance for.
 */
export async function getAccountBalance(openNewAccountPage: any, accountNumber: string): Promise<string> {
    const accountOverviewPage: AccountOverviewPage = await openNewAccountPage.sidebar.openAccountsOverview();
    return await accountOverviewPage.getBalanceFromAccount(accountNumber);
}
