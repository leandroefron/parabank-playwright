import { test, expect } from '../fixtures/custom.fixture';
import { billPayData } from 'src/data';

test.describe('Bill Pay tests', { tag: ['@billPay'] }, () => {
    test('should be able to pay a bill', async ({ billPayPage }) => {
        await billPayPage.billPayForm.waitFor({ state: 'visible' });
        await billPayPage.fillBillPayForm(billPayData, true);
    });
});
