import { Page, Locator } from '@playwright/test';

export class AccountOverviewPage {
    constructor(private page: Page) {}

    get container() {
        return this.page.getByTestId('overviewAccountsApp');
    }

    get accountTable() {
        return this.page.getByTestId('accountTable').locator('tbody');
    }

    async getAvailableAmount(accountNumber: string): Promise<string | null> {
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

        // Get the text content of the third cell in the row
        const availableAmount = await row.locator('td:nth-child(3)').textContent();

        return availableAmount?.replace('$', '').trim() || null;
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
