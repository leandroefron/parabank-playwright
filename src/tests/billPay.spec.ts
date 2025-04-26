import { test, expect } from '../fixtures/custom.fixture';
import { billPayData } from 'src/data';
import { getTransactionId, normalizeAmount } from 'src/util/helpers';
import { BILL_PAY_AMOUNT, TITLES } from 'src/constants';
import moment from 'moment';

const tx = {
    id: '',
    accountId: '',
    date: moment().format('MM-DD-YYYY'),
    type: 'Debit',
    description: `Bill Payment to ${billPayData.payeeName}`,
    amount: BILL_PAY_AMOUNT
};

const validationFields: Array<{ tag: string; errorId: string; expectedMsg: string }> = [
    { tag: 'payeeName', errorId: 'validationModel-name', expectedMsg: 'Payee name is required.' },
    { tag: 'address', errorId: 'validationModel-address', expectedMsg: 'Address is required.' },
    { tag: 'city', errorId: 'validationModel-city', expectedMsg: 'City is required.' },
    { tag: 'state', errorId: 'validationModel-state', expectedMsg: 'State is required.' },
    { tag: 'zipCode', errorId: 'validationModel-zipCode', expectedMsg: 'Zip Code is required.' },
    { tag: 'phoneNumber', errorId: 'validationModel-phoneNumber', expectedMsg: 'Phone number is required.' },
    { tag: 'account', errorId: 'validationModel-account-empty', expectedMsg: 'Account number is required.' },
    { tag: 'verifyAccount', errorId: 'validationModel-verifyAccount-empty', expectedMsg: 'Account number is required.' },
    { tag: 'amount', errorId: 'validationModel-amount-empty', expectedMsg: 'The amount cannot be empty.' }
];

test.describe.serial('Bill Pay tests', { tag: ['@billPay'] }, () => {
    test('should successfully pay a bill', async ({ billPayPage }) => {
        tx.accountId = await billPayPage.fillBillPayForm(billPayData, true);

        tx.id = await getTransactionId(tx.accountId, tx.type, tx.amount, tx.description);

        const expectedMsg = `Bill Payment to ${billPayData.payeeName} in the amount of $${normalizeAmount(BILL_PAY_AMOUNT)} from account ${process.env.CUSTOMER_DEFAULT_ACCOUNT} was successful.`;

        expect.soft(billPayPage.resultTitle).toHaveText(TITLES.BILL_PAY_COMPLETE);
        expect(billPayPage.resultMessage).toHaveText(expectedMsg);
    });

    validationFields.forEach(({ tag, errorId, expectedMsg }) => {
        test(`should show validation error when '${tag}' is empty`, async ({ billPayPage }) => {
            await billPayPage.fillBillPayForm(billPayData, false, tag);

            await billPayPage.submitBtn.click();

            const errorMsg: string = (await billPayPage.page.getByTestId(errorId).textContent()).trim();
            expect(errorMsg).toBe(expectedMsg);
        });
    });

    test.skip('should find a transaction by ID', async ({ transactionsPage }) => {
        await transactionsPage.findByTransactionId(tx.accountId, tx.id);
        await transactionsPage.page.waitForTimeout(5000);
    });

    test('should find a transaction by date', async ({ transactionsPage }) => {
        await transactionsPage.findByTransactionDate(tx.accountId, tx.date);

        const isPresent: boolean = await transactionsPage.findResults(tx.date, tx.description, BILL_PAY_AMOUNT);
        expect(isPresent).toBeTruthy();

        // Option 2: Only checks if are rows present.
        // const rowsCount: number = await transactionsPage.getTransactionRowsCount();
        // expect(rowsCount).toBeGreaterThan(0);
    });

    test('should find a transaction by amount', async ({ transactionsPage }) => {
        await transactionsPage.findByTransactionAmount(tx.accountId, tx.amount);

        const isPresent: boolean = await transactionsPage.findResults(tx.date, tx.description, BILL_PAY_AMOUNT);
        expect(isPresent).toBeTruthy();
    });
});
