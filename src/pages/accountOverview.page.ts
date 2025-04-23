import { Page, Locator } from '@playwright/test';

export class AccountOverviewPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get overview(): Locator {
        return this.page.getByTestId('showOverview');
    }

    get accountTable(): Locator {
        return this.page.getByTestId('accountTable').locator('tbody');
    }

    async getBalanceFromAccount(accountNumber: string): Promise<string | null> {
        await this.accountTable.waitFor({ state: 'visible' });
        // Locate the row containing the account number
        const row: Locator = this.accountTable
            .locator('tr')
            .filter({
                has: this.page.locator(`td:nth-child(1) a:has-text("${accountNumber}")`)
            })
            .first();

        // Check if the row exists
        if ((await row.count()) === 0) {
            return null; // Account number not found
        }

        // Get the text content of the second cell in the row
        const balance: string = await row.locator('td:nth-child(2)').textContent();

        return balance?.replace('$', '').trim() || null;
    }

    async getAccountsQty(): Promise<number> {
        await this.accountTable.waitFor({ state: 'visible' });

        // Check if there is at least one row with an account number link
        const accountRows: Locator = this.accountTable.locator('tr').filter({
            has: this.page.locator('td:nth-child(1) a')
        });

        return await accountRows.count();
    }
}
