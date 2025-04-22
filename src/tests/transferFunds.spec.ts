import { test, expect } from '../fixtures/custom.fixture';
import { CreateAccountData, AccountData } from 'src/types';
import * as api from 'src/util/api';
import { TITLES, TRANSFER_AMOUNT, MINIMUM_BALANCE } from 'src/constants';

let destinationAccountId: string;

test.describe('Transfer funds tests', { tag: ['@transfers'] }, () => {
    test.beforeAll(async () => {
        const createAccountData: CreateAccountData = {
            customerId: process.env.CUSTOMER_ID,
            newAccountType: '0',
            fromAccountId: process.env.CUSTOMER_DEFAULT_ACCOUNT
        };

        destinationAccountId = await api.createAccount(createAccountData);
    });

    test('should be able to transfer funds successfully', async ({ transferFundsPage, page }) => {
        const fromAccountId: string = process.env.CUSTOMER_DEFAULT_ACCOUNT as string;

        await transferFundsPage.transferFunds(TRANSFER_AMOUNT, fromAccountId, destinationAccountId);

        await expect(transferFundsPage.resultTitle).toHaveText(TITLES.TRANSFER_COMPLETE);
        expect(transferFundsPage.resultMessage).toHaveText(`$${TRANSFER_AMOUNT} has been transferred from account #${fromAccountId} to account #${destinationAccountId}.`);
        
        const accountData : AccountData = await api.getAccountById(destinationAccountId);
        const expectedBalance: number = Number(MINIMUM_BALANCE) + Number(TRANSFER_AMOUNT);

        // Assert that the destination account's balance matches the expected balance
        expect(accountData.balance).toBe(expectedBalance);
    });
});
