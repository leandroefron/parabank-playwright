import { BasePage } from './base.page';
import { Page } from '@playwright/test';
import { URL } from '../constants';
import { BillPayData } from 'src/types';

export class BillPayPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    get billPayForm() {
        return this.page.getByTestId('billpayForm');
    }

    get billPayResult() {
        return this.page.getByTestId('billpayResult');
    }

    get payeeNameInput() {
        return this.page.locator('input[name="payee.name"]');
    }

    get addressInput() {
        return this.page.locator('input[name="payee.address.street"]');
    }

    get cityInput() {
        return this.page.locator('input[name="payee.address.city"]');
    }

    get stateInput() {
        return this.page.locator('input[name="payee.address.state"]');
    }

    get zipCodeInput() {
        return this.page.locator('input[name="payee.address.zipCode"]');
    }

    get phoneInput() {
        return this.page.locator('input[name="payee.phoneNumber"]');
    }

    get accountInput() {
        return this.page.locator('input[name="payee.accountNumber"]');
    }

    get fromAccountSelect() {
        return this.page.locator('select[name="fromAccountId"]');
    }

    get verifyAccountInput() {
        return this.page.locator('input[name="verifyAccount"]');
    }

    get amountInput() {
        return this.page.locator('input[name="amount"]');
    }

    get sendPaymentBtn() {
        return this.billPayForm.locator('input[value="Send Payment"]');
    }

    async goto(): Promise<void> {
        await super.goto(URL.BILL_PAY);
    }

    async fillAllFields(billPayData: BillPayData, submit: boolean): Promise<void> {
        try {
            await this.billPayForm.waitFor({ state: 'visible' });

            // Map of input fields to their corresponding data
            const fieldMap = {
                payeeName: this.payeeNameInput,
                address: this.addressInput,
                city: this.cityInput,
                state: this.stateInput,
                zipCode: this.zipCodeInput,
                phoneNumber: this.phoneInput,
                account: this.accountInput,
                verifyAccount: this.verifyAccountInput,
                amount: this.amountInput
            };

            // Fill each field dynamically
            for (const [key, input] of Object.entries(fieldMap)) {
                if (billPayData[key]) {
                    await input.fill(billPayData[key]);
                }
            }

            await this.fromAccountSelect.selectOption({ index: 0 });

            if (submit) {
                await this.sendPaymentBtn.click();
            }

            await this.billPayResult.waitFor({ state: 'visible' });
        } catch (error) {
            console.error('Error filling the bill pay form: ', error);
            throw error;
        }
    }
}
