import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';
import { selectDropdownByValue } from 'src/util/helpers';
import { URLS } from '@/constants';

export class RequestLoanPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Locators
    get requestLoanForm(): Locator {
        return this.page.getByTestId('requestLoanForm');
    }

    private get requestLoanResult(): Locator {
        return this.page.getByTestId('requestLoanResult');
    }

    get loanRequestDeniedMsg(): Locator {
        return this.requestLoanResult.getByTestId('loanRequestDenied').locator('p');
    }

    private get loanRequestApprovedMsg(): Locator {
        return this.requestLoanResult.getByTestId('loanRequestApproved').locator('p').first();
    }

    get newAccountId(): Locator {
        return this.requestLoanResult.getByTestId('loanRequestApproved').getByTestId('newAccountId');
    }

    private get loanAmountInput(): Locator {
        return this.requestLoanForm.getByTestId('amount');
    }

    private get downPaymentInput(): Locator {
        return this.requestLoanForm.getByTestId('downPayment');
    }

    private get fromAccountSelect(): Locator {
        return this.requestLoanForm.getByTestId('fromAccountId');
    }

    get loanStatus(): Locator {
        return this.requestLoanResult.getByTestId('loanStatus');
    }

    private get submitBtn(): Locator {
        return this.requestLoanForm.getByRole('button', { name: 'Apply Now' });
    }

    // Actions
    async goto(): Promise<void> {
        await super.goto(URLS.LOANS);
    }

    /**
     * Applies for a loan and returns the result message.
     *
     * @param loanAmount - The amount of the loan.
     * @param downPayment - The down payment for the loan.
     * @param account - The account to use for the loan.
     */
    async applyForALoan(loanAmount: number, downPayment: number, account: string): Promise<void> {
        try {
            await this.fillLoanForm(loanAmount, downPayment, account);

            await this.submitBtn.click();
        } catch (error) {
            throw new Error(`Failed to apply for a loan: ${error.message}`);
        }
    }

    /**
     * Fills the loan application form.
     *
     * @param loanAmount - The amount of the loan.
     * @param downPayment - The down payment for the loan.
     * @param account - The account to use for the loan.
     */
    async fillLoanForm(loanAmount: number, downPayment: number, account: string): Promise<void> {
        await this.requestLoanForm.waitFor({ state: 'visible' });

        await this.loanAmountInput.fill(loanAmount.toString());
        await this.downPaymentInput.fill(downPayment.toString());

        await selectDropdownByValue(this.fromAccountSelect, account);
    }
}
