import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';
import { URL } from 'src/constants';

export class OpenNewAccountPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    get container(): Locator {
        return this.page.getByTestId('openAccountForm');
    }

    get typeAccountSelect(): Locator {
        return this.page.getByTestId('type');
    }

    get fromAccountSelect(): Locator {
        return this.page.getByTestId('fromAccountId');
    }

    get openAccountBtn(): Locator {
        return this.page.locator('input[value="Open New Account"]');
    }

    get openAccountResult(): Locator {
        return this.page.getByTestId('openAccountResult');
    }

    get newAccountNumber(): Locator {
        return this.page.getByTestId('newAccountId');
    }

    async goto(): Promise<void> {
        await super.goto(URL.OPEN_ACCOUNT);
    }

    async openNewAccount(type: string): Promise<string> {
        // Select the account type and the first available account
        await this.typeAccountSelect.selectOption(type);
        await this.fromAccountSelect.selectOption({ index: 0 });
    
        await this.openAccountBtn.click();
    
        // Wait for the result and retrieve the new account number
        await this.openAccountResult.waitFor({ state: 'visible' });
        const accountNumber: string = await this.newAccountNumber.textContent();
    
        if (!accountNumber) {
            throw new Error('Failed to retrieve the new account number.');
        }

        return accountNumber.trim();
    }

    // async openNewAccount(type: string): Promise<void> {
    //     await this.typeAccountSelect.selectOption(type);
    //     await this.fromAccountSelect.selectOption({ index: 0 });
    //     await this.openAccountBtn.click();
    //     await this.setNewAccountNumber();
    // }

    // async setNewAccountNumber(): Promise<void> {
    //     await this.openAccountResult.waitFor({ state: 'visible' });

    //     const accountNumber: string = await this.newAccountNumber.textContent();
    //     if (!accountNumber) {
    //         throw new Error('Failed to retrieve the new account number.');
    //     }

    //     process.env.CUSTOMER_NEW_ACCOUNT_ID = accountNumber.trim();
    // }
}
