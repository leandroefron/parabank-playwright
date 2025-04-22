import { BasePage } from './base.page';
import { Page } from '@playwright/test';
import { URL } from 'src/constants';

export class OpenNewAccountPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    get container() {
        return this.page.getByTestId('openAccountForm');
    }

    get typeAccountSelect() {
        return this.page.getByTestId('type');
    }

    get fromAccountSelect() {
        return this.page.getByTestId('fromAccountId');
    }

    get openAccountBtn() {
        return this.page.locator('input[value="Open New Account"]');
    }

    get openAccountResult() {
        return this.page.getByTestId('openAccountResult');
    }

    get newAccountNumber() {
        return this.page.getByTestId('newAccountId');
    }

    async goto(): Promise<void> {
        await super.goto(URL.OPEN_ACCOUNT);
    }

    async openNewAccount(type: string) {
        await this.typeAccountSelect.selectOption(type);
        await this.fromAccountSelect.selectOption({ index: 0 });
        await this.openAccountBtn.click();
        await this.setNewAccountNumber();
    }

    async setNewAccountNumber() {
        await this.openAccountResult.waitFor({ state: 'visible' });

        const accountNumber: string = await this.newAccountNumber.textContent();
        if (!accountNumber) {
            throw new Error('Failed to retrieve the new account number.');
        }

        process.env.CUSTOMER_NEW_ACCOUNT_ID = accountNumber.trim();
    }
}
