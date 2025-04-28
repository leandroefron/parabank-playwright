import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';
import { URL } from 'src/constants';
import { selectDropdownByValue } from 'src/util/helpers';

export class TransactionsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    get transactionForm(): Locator {
        return this.page.getByTestId('transactionForm');
    }

    get accountIdSelect() {
        return this.transactionForm.getByTestId('accountId');
    }

    get transactionIdInput(): Locator {
        return this.transactionForm.getByTestId('transactionId');
    }

    get findByIdBtn(): Locator {
        return this.transactionForm.getByTestId('findById');
    }

    get transactionDateInput(): Locator {
        return this.transactionForm.getByTestId('transactionDate');
    }

    get findByDateBtn(): Locator {
        return this.transactionForm.getByTestId('findByDate');
    }

    get amountInput(): Locator {
        return this.transactionForm.getByTestId('amount');
    }

    get findByAmountBtn(): Locator {
        return this.transactionForm.getByTestId('findByAmount');
    }

    get txTable(): Locator {
        return this.page.getByTestId('transactionTable');
    }

    get txTableRows(): Locator {
        return this.txTable.getByTestId('transactionBody').locator('tr');
    }

    async goto(): Promise<void> {
        await super.goto(URL.TRANSACTIONS);
    }

    async findByTransactionId(accountId: string, txId: string): Promise<string> {
        await selectDropdownByValue(this.accountIdSelect, accountId);
        await this.transactionIdInput.waitFor({ state: 'visible' });
        await this.transactionIdInput.fill(txId);
        await this.findByIdBtn.click();

        const result: string = await this.getResultText();
        return result.trim();
    }

    async findByTransactionDate(accountId: string, txDate: string): Promise<string> {
        await selectDropdownByValue(this.accountIdSelect, accountId);
        await this.transactionDateInput.waitFor({ state: 'visible' });
        await this.transactionDateInput.fill(txDate);
        await this.findByDateBtn.click();

        const result: string = await this.getResultText();
        return result.trim();
    }

    async findByTransactionAmount(accountId: string, txAmount: number): Promise<string> {
        await selectDropdownByValue(this.accountIdSelect, accountId);
        await this.amountInput.waitFor({ state: 'visible' });
        await this.amountInput.fill(txAmount.toString());
        await this.findByAmountBtn.click();

        const result: string = await this.getResultText();
        return result.trim();
    }

    async getTransactionRowsCount(): Promise<number> {
        await this.txTable.waitFor({ state: 'visible' });
        const rowsCount: number = await this.txTableRows.count();

        return rowsCount;
    }

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
