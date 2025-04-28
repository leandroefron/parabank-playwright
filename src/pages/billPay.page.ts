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

    private get inputFields(): Record<keyof BillPayData, Locator> {
        return {
            payeeName: this.page.locator('input[name="payee.name"]'),
            address: this.page.locator('input[name="payee.address.street"]'),
            city: this.page.locator('input[name="payee.address.city"]'),
            state: this.page.locator('input[name="payee.address.state"]'),
            zipCode: this.page.locator('input[name="payee.address.zipCode"]'),
            phoneNumber: this.page.locator('input[name="payee.phoneNumber"]'),
            account: this.page.locator('input[name="payee.accountNumber"]'),
            verifyAccount: this.page.locator('input[name="verifyAccount"]'),
            amount: this.page.locator('input[name="amount"]')
        };
    }

    private get errorFields(): Record<string, Locator> {
        return {
            payeeName: this.page.getByTestId('validationModel-name'),
            address: this.page.getByTestId('validationModel-address'),
            city: this.page.getByTestId('validationModel-city'),
            state: this.page.getByTestId('validationModel-state'),
            zipCode: this.page.getByTestId('validationModel-zipCode'),
            phoneNumber: this.page.getByTestId('validationModel-phoneNumber'),
            account: this.page.getByTestId('validationModel-account-empty'),
            verifyAccount: this.page.getByTestId('validationModel-verifyAccount-empty'),
            amount: this.page.getByTestId('validationModel-amount-empty')
        };
    }

    get submitBtn(): Locator {
        return this.billPayForm.locator('input[value="Send Payment"]');
    }

    private get fromAccountIdSelect(): Locator {
        return this.billPayForm.locator('select[name="fromAccountId"]');
    }

    get fromAccountIdResult(): Locator {
        return this.billPayResult.getByTestId('fromAccountId');
    }

    // Actions
    async goto(): Promise<void> {
        await super.goto(URL.BILL_PAY);
    }

    /**
     * Fills and optionally submits the bill pay form.
     *
     * @param billPayData - Data to fill the form.
     * @param submit - Whether to submit the form after filling.
     * @param fieldToOmit - Optional field name to skip filling.
     */
    async payBill(billPayData: BillPayData, submit: boolean, fieldToOmit?: string): Promise<void> {
        await this.billPayForm.waitFor({ state: 'visible' });

        try {
            await this.fillBillPayForm(billPayData, fieldToOmit);

            await this.submitBtn.click();
        } catch (error) {
            throw new Error(`Failed to fill the bill pay form: ${error.message}`);
        }
    }

    /**
     * Fills the bill pay form with the provided data.
     *
     * @param billPayData - Data to fill the form.
     * @param fieldToOmit - Optional field name to skip filling.
     */
    async fillBillPayForm(billPayData: BillPayData, fieldToOmit?: string): Promise<void> {
        for (const [field, input] of Object.entries(this.inputFields)) {
            if (field !== fieldToOmit && billPayData[field] !== undefined) {
                await input.fill(String(billPayData[field]));
            }
        }

        await selectDropdownByValue(this.fromAccountIdSelect, process.env.CUSTOMER_DEFAULT_ACCOUNT);
    }

    /**
     * Get an error message for a specific field.
     * @param field - Field name
     */
    async getErrorMessage(field: string): Promise<string> {
        const errorLocator: Locator = this.errorFields[field];

        if (!errorLocator) {
            throw new Error(`Error field locator for "${field}" not found.`);
        }

        await errorLocator.waitFor({ state: 'visible' });
        const errorMessage: string = (await errorLocator.textContent()).trim();

        return errorMessage;
    }
}
