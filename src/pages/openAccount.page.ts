import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';
import { URLS } from '@/constants';
import { selectDropdownByValue } from 'src/util/helpers';

export class OpenNewAccountPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Locators
    get openAccountForm(): Locator {
        return this.page.getByTestId('openAccountForm');
    }

    private get typeAccountSelect(): Locator {
        return this.openAccountForm.getByTestId('type');
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
        await super.goto(URLS.OPEN_ACCOUNT);
    }

    /**
     * Opens a new account and returns the newly created account number.
     *
     * @param type - Type of account to open (e.g., 'SAVINGS', 'CHECKING')
     * @param accountId - ID of the existing account to transfer funds from
     */
    async openNewAccount(type: string, accountId: string): Promise<void> {
        await this.openAccountForm.waitFor({ state: 'visible' });

        try {
            await this.fillNewAccountForm(type, accountId);

            await this.openAccountBtn.click();
        } catch (error) {
            throw new Error(`Failed to open a new account: ${error.message}`);
        }
    }

    async fillNewAccountForm(type: string, accountId: string): Promise<void> {
        await selectDropdownByValue(this.typeAccountSelect, type);
        await selectDropdownByValue(this.fromAccountIdSelect, accountId);
    }
}
