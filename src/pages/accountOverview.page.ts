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
        const accountRow: Locator = this.accountTable
            .locator('tr')
            .filter({
                has: this.page.locator(`td:nth-child(1) a:has-text("${accountNumber}")`)
            })
            .first();

        if ((await accountRow.count()) === 0) {
            console.warn(`Account not found: ${accountNumber}`);
            return null;
        }

        // Get the text content of the second cell in the row
        const balanceText: string = await accountRow.locator('td:nth-child(2)').textContent();

        if (!balanceText) {
            console.error(`Could not retrieve balance for account: ${accountNumber}`);
            return null;
          }

          return balanceText.replace(/\$/, '').trim() || null;
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
