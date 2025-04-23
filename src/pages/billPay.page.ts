import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';
import { URL } from '../constants';
import { BillPayData } from 'src/types';

export class BillPayPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    get billPayForm(): Locator {
        return this.page.getByTestId('billpayForm');
    }

    get billPayResult(): Locator {
        return this.page.getByTestId('billpayResult');
    }

    get payeeNameInput(): Locator {
        return this.page.locator('input[name="payee.name"]');
    }

    get addressInput(): Locator {
        return this.page.locator('input[name="payee.address.street"]');
    }

    get cityInput(): Locator {
        return this.page.locator('input[name="payee.address.city"]');
    }

    get stateInput(): Locator {
        return this.page.locator('input[name="payee.address.state"]');
    }

    get zipCodeInput(): Locator {
        return this.page.locator('input[name="payee.address.zipCode"]');
    }

    get phoneInput(): Locator {
        return this.page.locator('input[name="payee.phoneNumber"]');
    }

    get accountInput(): Locator {
        return this.page.locator('input[name="payee.accountNumber"]');
    }

    get fromAccountSelect(): Locator {
        return this.page.locator('select[name="fromAccountId"]');
    }

    get verifyAccountInput(): Locator {
        return this.page.locator('input[name="verifyAccount"]');
    }

    get amountInput(): Locator {
        return this.page.locator('input[name="amount"]');
    }

    get sendPaymentBtn(): Locator {
        return this.billPayForm.locator('input[value="Send Payment"]');
    }

    async goto(): Promise<void> {
        await super.goto(URL.BILLS);
    }

    async fillBillPayForm(billPayData: BillPayData, submit: boolean): Promise<void> {
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
