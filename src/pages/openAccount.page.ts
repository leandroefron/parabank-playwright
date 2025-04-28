import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';
import { URL } from 'src/constants';
import { selectDropdownByValue } from 'src/util/helpers';

export class OpenNewAccountPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Locators
    get container(): Locator {
        return this.page.getByTestId('openAccountForm');
    }

    private get typeAccountSelect(): Locator {
        return this.container.getByTestId('type');
    }

    private get fromAccountIdSelect(): Locator {
        return this.page.getByTestId('fromAccountId');
    }

    get openAccountBtn(): Locator {
        return this.page.locator('input[value="Open New Account"]');
    }

    private get openAccountResult(): Locator {
        return this.page.getByTestId('openAccountResult');
    }

    get newAccountNumber(): Locator {
        return this.page.getByTestId('newAccountId');
    }

    // Actions
    async goto(): Promise<void> {
        await super.goto(URL.OPEN_ACCOUNT);
    }

    /**
     * Opens a new account and returns the newly created account number.
     *
     * @param type - Type of account to open (e.g., 'SAVINGS', 'CHECKING')
     * @param accountId - ID of the existing account to transfer funds from
     */
    async openNewAccount(type: string, accountId: string): Promise<string> {
        try {
            await this.fillNewAccountForm(type, accountId);
            await this.openAccountBtn.click();

            const result: string = await this.getResultText();
            return result.trim();
        } catch (error) {
            throw new Error(`Failed to open a new account: ${error.message}`);
        }
    }

    async fillNewAccountForm(type: string, accountId: string): Promise<void> {
        await this.container.waitFor({ state: 'visible' });

        await selectDropdownByValue(this.typeAccountSelect, type);
        await selectDropdownByValue(this.fromAccountIdSelect, accountId);
    }
}
