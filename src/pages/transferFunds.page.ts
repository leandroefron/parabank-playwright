import { BasePage } from './base.page';
import { Page } from '@playwright/test';
import { URL } from 'src/constants';
import { selectDropdownByValue } from 'src/util/helpers';

export class TransferFundsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Locators
    get transferForm() {
        return this.page.getByTestId('showForm');
    }

    private get resultTitle() {
        return this.page.getByTestId('showResult').locator('h1');
    }

    get resultMessage() {
        return this.page.getByTestId('showResult').locator('p').first();
    }

    private get amountInput() {
        return this.transferForm.getByTestId('amount');
    }

    private get fromAccountSelect() {
        return this.transferForm.getByTestId('fromAccountId');
    }

    private get toAccountSelect() {
        return this.transferForm.getByTestId('toAccountId');
    }

    private get transferBtn() {
        return this.page.locator('input[value="Transfer"]');
    }

    // Actions
    async goto(): Promise<void> {
        await super.goto(URL.TRANSFERS);
    }

    /**
     * Transfers funds between accounts and returns the result message.
     *
     * @param amount - The amount to transfer.
     * @param fromAccount - The source account ID.
     * @param toAccount - The destination account ID.
     */
    async transferFunds(amount: number, fromAccount: string, toAccount: string): Promise<void> {
        try {
            await this.fillTransferForm(amount, fromAccount, toAccount);
            
            await this.transferBtn.click();
        } catch (error) {
            throw new Error(`Failed to transfer funds: ${error.message}`);
        }
    }

    /**
     * Fills the transfer form with the provided details.
     *
     * @param amount - The amount to transfer.
     * @param fromAccount - The source account ID.
     * @param toAccount - The destination account ID.
     */
    async fillTransferForm(amount: number, fromAccount: string, toAccount: string): Promise<void> {
        await this.transferForm.waitFor({ state: 'visible' });

        await this.amountInput.fill(amount.toString());
        selectDropdownByValue(this.fromAccountSelect, fromAccount);
        selectDropdownByValue(this.toAccountSelect, toAccount);

        await this.page.waitForTimeout(500);
    }
}
