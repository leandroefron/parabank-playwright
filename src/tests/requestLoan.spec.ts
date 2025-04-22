import { test, expect } from '../fixtures/custom.fixture';
import { MESSAGES } from 'src/constants';
import { getBalanceFromAccount } from 'src/util/helpers';

let availableBalance: number;

test.describe.serial('Request Loan tests', { tag: ['@loans'] }, () => {
    test.beforeAll(async () => {
        availableBalance = await getBalanceFromAccount(process.env.CUSTOMER_DEFAULT_ACCOUNT);
    });

    test('should be able to get a loan with a down payment lower than the account balance', async ({ requestLoanPage, page }) => {
        const loanAmount: number = availableBalance - 1;
        const downPayment: number = availableBalance - 1;

        const newAccountId: string | null = await requestLoanPage.applyForALoan(loanAmount, downPayment);

        if (typeof newAccountId === 'string') {
            const balance: number = await getBalanceFromAccount(newAccountId);
            expect(balance).toBe(loanAmount);
        } else {
            throw new Error('Failed to retrieve a valid account ID.');
        }
    });

    test('should not be able to get a loan with a down payment higher than the account balance', async ({ requestLoanPage, page }) => {
        const loanAmount: number = availableBalance - 1;
        const downPayment: number = availableBalance + 1;

        await requestLoanPage.applyForALoan(loanAmount, downPayment);

        expect(requestLoanPage.loanStatus).toHaveText('Denied');
        expect(requestLoanPage.loanRequestDeniedMsg).toHaveText(MESSAGES.LOAN_DENIED_NO_FUNDS);
    });
});
