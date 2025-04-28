import { test, expect } from '../fixtures/custom.fixture';
import { billPayData } from 'src/data';
import { getTransactionId, normalizeAmount } from 'src/util/helpers';
import { BILL_PAY_AMOUNT, TITLES } from 'src/constants';
import moment from 'moment';

const tx = {
    id: '',
    accountId: '',
    date: moment().utc().format('MM-DD-YYYY'),
    type: 'Debit',
    description: `Bill Payment to ${billPayData.payeeName}`,
    amount: BILL_PAY_AMOUNT
};

const validationFields: Array<{ field: string; expectedMsg: string }> = [
    { field: 'payeeName', expectedMsg: 'Payee name is required.' },
    { field: 'address', expectedMsg: 'Address is required.' },
    { field: 'city', expectedMsg: 'City is required.' },
    { field: 'state', expectedMsg: 'State is required.' },
    { field: 'zipCode', expectedMsg: 'Zip Code is required.' },
    { field: 'phoneNumber', expectedMsg: 'Phone number is required.' },
    { field: 'account', expectedMsg: 'Account number is required.' },
    { field: 'verifyAccount', expectedMsg: 'Account number is required.' },
    { field: 'amount', expectedMsg: 'The amount cannot be empty.' }
];

test.describe.serial('Bill Pay tests @all', { tag: ['@bills'] }, () => {
    test('should successfully pay a bill', async ({ billPayPage }) => {
        await billPayPage.payBill(billPayData, true);

        const result: string = await billPayPage.getResultText();
        expect(result).toContain(TITLES.BILL_PAY_COMPLETE);

        tx.accountId = (await billPayPage.fromAccountIdResult.textContent())?.trim();
        tx.id = await getTransactionId(tx.accountId, tx.type, tx.amount, tx.description);

        const expectedMsg = `Bill Payment to ${billPayData.payeeName} in the amount of $${normalizeAmount(BILL_PAY_AMOUNT)} from account ${process.env.CUSTOMER_DEFAULT_ACCOUNT} was successful.`;
        expect(billPayPage.resultMessage).toHaveText(expectedMsg);
    });

    validationFields.forEach(({ field, expectedMsg }) => {
        test(`should show validation error when '${field}' is empty`, async ({ billPayPage }) => {
            await billPayPage.payBill(billPayData, true, field);

            const errorMsg: string = (await billPayPage.getErrorMessage(field)).trim();
            expect(errorMsg).toBe(expectedMsg);
        });
    });

    test('should find a transaction by ID', async ({ transactionsPage }) => {
        await verifyTransactionSearch(transactionsPage, 'findByTransactionId', tx.accountId, tx.id);
    });

    test('should find a transaction by date', async ({ transactionsPage }) => {
        await verifyTransactionSearch(transactionsPage, 'findByTransactionDate', tx.accountId, tx.date);
    });

    test('should find a transaction by amount', async ({ transactionsPage }) => {
        await verifyTransactionSearch(transactionsPage, 'findByTransactionAmount', tx.accountId, tx.amount);
    });
});

/**
 * Verifies a transaction search by a specific method.
 *
 * @param transactionsPage - The transactions page object.
 * @param searchMethod - The method to use for searching (e.g., 'findByTransactionId').
 * @param accountId - The account ID to search within.
 * @param searchValue - The value to search for (e.g., transaction ID, date, or amount).
 */
async function verifyTransactionSearch(
    transactionsPage: any,
    searchMethod: 'findByTransactionId' | 'findByTransactionDate' | 'findByTransactionAmount',
    accountId: string,
    searchValue: string | number
): Promise<void> {
    const result: string = await transactionsPage[searchMethod](accountId, searchValue);

    expect(result).toBe(TITLES.TRANSACTION_RESULTS);

    const isPresent = await transactionsPage.findResults(tx.date, tx.description, BILL_PAY_AMOUNT);
    expect(isPresent).toBeTruthy();
}
