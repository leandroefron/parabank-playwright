import { BasePage } from './base.page';
import { Page } from '@playwright/test';
import { URL } from 'src/constants';
import { selectDropdownByValue } from 'src/util/helpers';

export class TransferFundsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    get transferForm() {
        return this.page.getByTestId('showForm');
    }

    get resultTitle() {
        return this.page.getByTestId('showResult').locator('h1');
    }

    get resultMessage() {
        return this.page.getByTestId('showResult').locator('p').first();
    }

    get amountInput() {
        return this.transferForm.getByTestId('amount');
    }

    get fromAccountSelect() {
        return this.transferForm.getByTestId('fromAccountId');
    }

    get toAccountSelect() {
        return this.transferForm.getByTestId('toAccountId');
    }

    get transferBtn() {
        return this.page.locator('input[value="Transfer"]');
    }

    async goto(): Promise<void> {
        await super.goto(URL.TRANSFER_FUNDS);
    }

    async transferFunds(amount: string | number, fromAccount: string, toAccount: string): Promise<void> {
        await this.transferForm.waitFor({ state: 'visible' });

        const amountStr: string = typeof amount === 'number' ? amount.toString() : amount;

        await this.amountInput.fill(amountStr);
        selectDropdownByValue(this.fromAccountSelect, fromAccount);
        selectDropdownByValue(this.toAccountSelect, toAccount);
        await this.page.waitForTimeout(500);

        await this.transferBtn.click();
        await this.resultTitle.waitFor({ state: 'visible' });
    }
}
