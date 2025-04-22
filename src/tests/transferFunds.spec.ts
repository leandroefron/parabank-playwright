import { test, expect } from '../fixtures/custom.fixture';
import { CreateAccountData } from 'src/types';
import { createAccount } from 'src/util/api';
import { TITLES } from 'src/constants';

let newAccount: string;
const accountData: CreateAccountData = {
    customerId: process.env.CUSTOMER_ID,
    newAccountType: '0',
    fromAccountId: process.env.CUSTOMER_DEFAULT_ACCOUNT
};

test.describe('Transfer funds tests', { tag: ['@transfers'] }, () => {
    test.beforeAll(async () => {
        newAccount = await createAccount(accountData);
    });

    test('should be able to transfer funds', async ({ transferFundsPage, page }) => {
        const amount: string = '50.00';
        const fromAccount: string = process.env.CUSTOMER_DEFAULT_ACCOUNT;

        await transferFundsPage.transferFunds(amount, fromAccount, newAccount);

        expect(transferFundsPage.resultTitle).toHaveText(TITLES.TRANSFER_COMPLETE);
        expect(transferFundsPage.resultMessage).toHaveText(`$${amount} has been transferred from account #${fromAccount} to account #${newAccount}.`);
    });
});
