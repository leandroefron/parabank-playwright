import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';
import { selectDropdownByValue } from 'src/util/helpers';
import { URLS } from '@/constants';

export class TransactionsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Locators
    get transactionForm(): Locator {
        return this.page.getByTestId('transactionForm');
    }

    private get accountIdSelect() {
        return this.transactionForm.getByTestId('accountId');
    }

    private get transactionIdInput(): Locator {
        return this.transactionForm.getByTestId('transactionId');
    }

    private get findByIdBtn(): Locator {
        return this.transactionForm.getByTestId('findById');
    }

    private get transactionDateInput(): Locator {
        return this.transactionForm.getByTestId('transactionDate');
    }

    private get findByDateBtn(): Locator {
        return this.transactionForm.getByTestId('findByDate');
    }

    private get amountInput(): Locator {
        return this.transactionForm.getByTestId('amount');
    }

    private get findByAmountBtn(): Locator {
        return this.transactionForm.getByTestId('findByAmount');
    }

    private get txTable(): Locator {
        return this.page.getByTestId('transactionTable');
    }

    private get txTableRows(): Locator {
        return this.txTable.getByTestId('transactionBody').locator('tr');
    }

    // Actions
    async goto(): Promise<void> {
        await super.goto(URLS.TRANSACTIONS);
    }

    /**
     * Searches for a transaction by ID.
     *
     * @param accountId - The account ID to search within.
     * @param txId - The transaction ID to search for.
     * @returns The result text after the search.
     */
    async findByTransactionId(accountId: string, txId: string): Promise<string> {
        return this.performTransactionSearch(accountId, this.transactionIdInput, txId, this.findByIdBtn);
    }

    /**
     * Searches for a transaction by date.
     *
     * @param accountId - The account ID to search within.
     * @param txDate - The transaction date to search for.
     * @returns The result text after the search.
     */
    async findByTransactionDate(accountId: string, txDate: string): Promise<string> {
        return this.performTransactionSearch(accountId, this.transactionDateInput, txDate, this.findByDateBtn);
    }

    /**
     * Searches for a transaction by amount.
     *
     * @param accountId - The account ID to search within.
     * @param txAmount - The transaction amount to search for.
     * @returns The result text after the search.
     */
    async findByTransactionAmount(accountId: string, txAmount: number): Promise<string> {
        return this.performTransactionSearch(accountId, this.amountInput, txAmount.toString(), this.findByAmountBtn);
    }

    /**
     * Performs a transaction search based on the provided input and button.
     *
     * @param accountId - The account ID to search within.
     * @param inputField - The input field to fill.
     * @param value - The value to input.
     * @param searchButton - The button to click for the search.
     * @returns The result text after the search.
     */
    private async performTransactionSearch(accountId: string, inputField: Locator, value: string, searchButton: Locator): Promise<string> {
        await selectDropdownByValue(this.accountIdSelect, accountId);
        await inputField.waitFor({ state: 'visible' });
        await inputField.fill(value);
        await searchButton.click();

        const result: string = await this.getVisibleResultText();
        return result.trim();
    }

    /**
     * Gets the count of transaction rows in the table.
     *
     * @returns The number of rows in the transaction table.
     */
    async getTransactionRowsCount(): Promise<number> {
        await this.txTable.waitFor({ state: 'visible' });
        return this.txTableRows.count();
    }

    /**
     * Finds results in the transaction table based on the provided criteria.
     *
     * @param date - The transaction date to match.
     * @param description - The transaction description to match.
     * @param debitAmount - (Optional) The debit amount to match.
     * @param creditAmount - (Optional) The credit amount to match.
     * @returns `true` if a matching transaction is found, otherwise `false`.
     */
    async findResults(date: string, description: string, debitAmount?: number, creditAmount?: number): Promise<boolean> {
        await this.txTable.waitFor({ state: 'visible' });

        const rows: Locator[] = await this.txTableRows.all();

        for (const row of rows) {
            const cells: Locator[] = await row.locator('td').all();

            const [rowDate, rowDescription, rowDebitRaw, rowCreditRaw] = await Promise.all(cells.map(cell => cell.textContent().then(text => text?.trim() || '')));

            const rowDebitAmount: string = rowDebitRaw.replace('$', '');
            const rowCreditAmount: string = rowCreditRaw.replace('$', '');

            const matches: boolean =
                rowDate === date &&
                rowDescription === description &&
                (!debitAmount || parseFloat(rowDebitAmount) === debitAmount) &&
                (!creditAmount || parseFloat(rowCreditAmount) === creditAmount);

            if (matches) return true;
        }

        return false;
    }
}
