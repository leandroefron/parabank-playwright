import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';
import { URL } from '../constants';
import { BillPayData } from 'src/types';
import { selectDropdownByValue } from 'src/util/helpers';

export class BillPayPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Locators
    get billPayForm(): Locator {
        return this.page.getByTestId('billpayForm');
    }

    private get billPayResult(): Locator {
        return this.page.getByTestId('billpayResult');
    }

    get resultTitle(): Locator {
        return this.billPayResult.locator('h1');
    }

    get resultMessage(): Locator {
        return this.billPayResult.locator('p').first();
    }

    private get payeeNameInput(): Locator {
        return this.page.locator('input[name="payee.name"]');
    }

    private get addressInput(): Locator {
        return this.page.locator('input[name="payee.address.street"]');
    }

    private get cityInput(): Locator {
        return this.page.locator('input[name="payee.address.city"]');
    }

    private get stateInput(): Locator {
        return this.page.locator('input[name="payee.address.state"]');
    }

    private get zipCodeInput(): Locator {
        return this.page.locator('input[name="payee.address.zipCode"]');
    }

    private get phoneInput(): Locator {
        return this.page.locator('input[name="payee.phoneNumber"]');
    }

    private get accountInput(): Locator {
        return this.page.locator('input[name="payee.accountNumber"]');
    }

    private get verifyAccountInput(): Locator {
        return this.page.locator('input[name="verifyAccount"]');
    }

    private get amountInput(): Locator {
        return this.page.locator('input[name="amount"]');
    }

    get submitBtn(): Locator {
        return this.billPayForm.locator('input[value="Send Payment"]');
    }

    private get fromAccountIdSelect(): Locator {
        return this.billPayForm.locator('select[name="fromAccountId"]');
    }

    private get fromAccountIdResult(): Locator {
        return this.billPayResult.getByTestId('fromAccountId');
    }

    // Actions
    async goto(): Promise<void> {
        await super.goto(URL.BILL_PAY);
    }

    /**
     * Fill and optionally submit the bill pay form.
     *
     * @param billPayData - Data to fill the form
     * @param submit - Whether to submit the form after filling
     * @param fieldToOmit - Optional field name to skip filling
     */
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

            for (const [field, input] of Object.entries(fieldMap) as [keyof BillPayData, Locator][]) {
                if (field !== fieldToOmit && billPayData[field] !== undefined) {
                    await input.fill(String(billPayData[field]));
                }
            }

            await selectDropdownByValue(this.fromAccountIdSelect, process.env.CUSTOMER_DEFAULT_ACCOUNT);

            if (submit && !fieldToOmit) {
                await this.submitBtn.click();
                await this.billPayResult.waitFor({ state: 'visible' });

                const accountId = (await this.fromAccountIdResult.textContent())?.trim();

                if (!accountId) {
                    throw new Error('Failed to retrieve the account ID after payment.');
                }

                return accountId;
            }

            return null;
        } catch (error) {
            throw new Error(`Failed to fill the bill pay form: ${error.message}`);
        }
    }
}
