import { test, expect } from '../fixtures/custom.fixture';
import { MESSAGES } from 'src/constants';
import { getBalanceFromAccount } from 'src/util/helpers';

const account: string = process.env.CUSTOMER_DEFAULT_ACCOUNT;
let availableBalance: number;

test.describe.serial('Request Loan tests', { tag: ['@loans'] }, () => {
    test.beforeAll(async () => {
        availableBalance = await getBalanceFromAccount(account);
    });

    test('should approve loan with down payment lower than account balance', async ({ requestLoanPage }) => {
        const loanAmount: number = availableBalance - 1;
        const downPayment: number = availableBalance - 1;

        const result: string = await requestLoanPage.applyForALoan(loanAmount, downPayment, account);

        expect(result).toBe('Loan Request Processed');

        const newAccountId: string = await requestLoanPage.newAccountId.innerText();
        const newAccountBalance: number = await getBalanceFromAccount(newAccountId);
        expect(newAccountBalance).toBe(loanAmount);
    });

    test('should deny loan with down payment higher than account balance', async ({ requestLoanPage, page }) => {
        const loanAmount: number = availableBalance - 1;
        const downPayment: number = availableBalance + 1;

        const result: string = await requestLoanPage.applyForALoan(loanAmount, downPayment, account);

        expect(result).toContain('Loan Request Processed');
        expect(requestLoanPage.loanStatus).toHaveText('Denied');
        expect(requestLoanPage.loanRequestDeniedMsg).toHaveText(MESSAGES.LOAN_DENIED_NO_FUNDS);
    });
});
