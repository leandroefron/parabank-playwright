import { test, expect } from '../fixtures/custom.fixture';
import { CreateAccountData, AccountData } from 'src/types';
import { TITLES, TRANSFER_AMOUNT, MINIMUM_BALANCE } from 'src/constants';
import { normalizeAmount } from 'src/util/helpers';
import * as api from 'src/util/api';

const fromAccountId: string = process.env.CUSTOMER_DEFAULT_ACCOUNT;
let destinationAccountId: string;

test.describe('Transfer funds tests @all', { tag: ['@transfers'] }, () => {
    test.beforeAll(async () => {
        destinationAccountId = await createDestinationAccount();
    });

    test('should transfer funds successfully', async ({ transferFundsPage }) => {
        const result: string = await transferFundsPage.transferFunds(TRANSFER_AMOUNT, fromAccountId, destinationAccountId);

        expect(result).toContain(TITLES.TRANSFER_COMPLETE);

        const expectedMessage: string = `$${normalizeAmount(TRANSFER_AMOUNT)} has been transferred from account #${fromAccountId} to account #${destinationAccountId}.`;
        expect(transferFundsPage.resultMessage).toHaveText(expectedMessage);

        const accountData: AccountData = await api.getAccountById(destinationAccountId);
        const expectedBalance: number = Number(MINIMUM_BALANCE) + Number(TRANSFER_AMOUNT);
        expect(accountData.balance).toBe(expectedBalance);
    });
});

/**
 * Creates a new destination account for the transfer.
 *
 * @returns The ID of the newly created account.
 */
async function createDestinationAccount(): Promise<string> {
    const createAccountData: CreateAccountData = {
        customerId: process.env.CUSTOMER_ID,
        newAccountType: '0',
        fromAccountId: process.env.CUSTOMER_DEFAULT_ACCOUNT
    };

    return await api.createAccount(createAccountData);
}
