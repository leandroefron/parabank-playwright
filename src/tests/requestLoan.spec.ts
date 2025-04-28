import { test, expect } from '../fixtures/custom.fixture';
import { getBalanceFromAccount } from 'src/util/helpers';
import { TITLES, MESSAGES } from 'src/constants';
import { CreateAccountData, AccountData } from 'src/types';
import * as api from 'src/util/api';

const account: string = process.env.CUSTOMER_DEFAULT_ACCOUNT;
let availableBalance: number;

test.describe.serial('Request Loan tests @all', { tag: ['@loans'] }, () => {
    test.beforeAll(async () => {
        availableBalance = await getBalanceFromAccount(account);
    });

    test('should approve loan with down payment lower than account balance', async ({ requestLoanPage }) => {
        const loanAmount: number = availableBalance - 300;
        const downPayment: number = availableBalance - 300;

        const result: string = await requestLoanPage.applyForALoan(loanAmount, downPayment, account);

        expect(result).toContain(TITLES.LOAN_PROCESSED);

        const newAccountId: string = await getNewAccountId(requestLoanPage);
        const newAccountBalance: number = await getBalanceFromAccount(newAccountId);
        expect(newAccountBalance).toBe(loanAmount);
    });

    test('should deny loan with down payment higher than account balance', async ({ requestLoanPage, page }) => {
        const loanAmount: number = availableBalance - 300;
        const downPayment: number = availableBalance + 10;

        const result: string = await requestLoanPage.applyForALoan(loanAmount, downPayment, account);

        expect(result).toContain(TITLES.LOAN_PROCESSED);
        expect(requestLoanPage.loanStatus).toHaveText('Denied');
        expect(requestLoanPage.loanRequestDeniedMsg).toHaveText(MESSAGES.LOAN_DENIED_NO_FUNDS);
    });
});

/**
 * Retrieves the new account ID from the loan request page.
 *
 * @param requestLoanPage - The page object for the loan request.
 */
export async function getNewAccountId(requestLoanPage: any): Promise<string> {
    try {
        const newAccountId: string = (await requestLoanPage.newAccountId.textContent())?.trim() || '';
        if (!newAccountId) {
            throw new Error('Failed to retrieve the new account ID.');
        }
        return newAccountId;
    } catch (error) {
        console.error('Error retrieving the new account ID:', error.message);
        throw new Error(`Failed to retreieve the new account ID: ${error.message}`);
    }
}
