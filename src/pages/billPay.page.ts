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

    get resultTitle(): Locator {
        return this.billPayResult.locator('h1');
    }

    get resultMessage(): Locator {
        return this.billPayResult.locator('p').first();
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

    get verifyAccountInput(): Locator {
        return this.page.locator('input[name="verifyAccount"]');
    }

    get amountInput(): Locator {
        return this.page.locator('input[name="amount"]');
    }

    get submitBtn(): Locator {
        return this.billPayForm.locator('input[value="Send Payment"]');
    }

    get fromAccountIdSelect(): Locator {
        return this.billPayForm.locator('select[name="fromAccountId"]');
    }

    get fromAccountId(): Locator {
        return this.billPayResult.getByTestId('fromAccountId');
    }

    async goto(): Promise<void> {
        await super.goto(URL.BILLS);
    }

    async fillBillPayForm(billPayData: BillPayData, submit: boolean, fieldToOmit?: string): Promise<string | null> {
        try {
            await this.billPayForm.waitFor({ state: 'visible' });

            const fieldMap: { [K in keyof BillPayData]: Locator } = {
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

            for (const [key, input] of Object.entries(fieldMap)) {
                if (key !== fieldToOmit && billPayData[key as keyof BillPayData]) {
                    await input.fill(String(billPayData[key as keyof BillPayData]));
                }
            }

            // await this.fromAccountIdSelect.selectOption({ index: 0 });
            await this.fromAccountIdSelect.selectOption({ label: process.env.CUSTOMER_DEFAULT_ACCOUNT });

            if (submit && !fieldToOmit) {
                await this.submitBtn.click();
                await this.billPayResult.waitFor({ state: 'visible' });
                const accountId: string = await this.fromAccountId.textContent();

                return accountId;
            }

            return null;
        } catch (error) {
            console.error('Error filling the bill pay form: ', error);
            throw error;
        }
    }
}
