import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';
import { URL } from '../constants';

export class RequestLoanPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    get requestLoanForm(): Locator {
        return this.page.getByTestId('requestLoanForm');
    }

    get requestLoanResult(): Locator {
        return this.page.getByTestId('requestLoanResult');
    }

    get loanRequestDeniedMsg(): Locator {
        return this.requestLoanResult.getByTestId('loanRequestDenied').locator('p');
    }

    get loanRequestApprovedMsg(): Locator {
        return this.requestLoanResult.getByTestId('loanRequestApproved').locator('p').first();
    }

    get newAccountId(): Locator {
        return this.requestLoanResult.getByTestId('loanRequestApproved').getByTestId('newAccountId');
    }

    get loanAmountInput(): Locator {
        return this.requestLoanForm.getByTestId('amount');
    }

    get downPaymentInput(): Locator {
        return this.requestLoanForm.getByTestId('downPayment');
    }

    get fromAccountSelect(): Locator {
        return this.requestLoanForm.getByTestId('fromAccountId');
    }

    get loanStatus(): Locator {
        return this.requestLoanResult.getByTestId('loanStatus');
    }
    get submitBtn(): Locator {
        return this.requestLoanForm.locator('input[value="Apply Now"]');
    }

    async goto(): Promise<void> {
        await super.goto(URL.LOANS);
    }

    async applyForALoan(loanAmount: number, downPayment: number): Promise<string | null> {
        try {
            await this.fillLoanForm(loanAmount, downPayment);

            await this.submitBtn.click();

            await this.loanStatus.waitFor({ state: 'visible' });

            // Check if a new account ID is visible and return it
            if (await this.newAccountId.isVisible()) {
                return (await this.newAccountId.innerText()).trim();
            }

            return null;
        } catch (error) {
            console.error('Error applying for a loan:', error);
            throw new Error(`Failed to apply for a loan: ${error.message}`);
        }
    }

    async fillLoanForm(loanAmount: number, downPayment: number): Promise<void> {
        await this.requestLoanForm.waitFor({ state: 'visible' });

        // Fill in the loan amount and down payment
        await this.loanAmountInput.fill(loanAmount.toString());
        await this.downPaymentInput.fill(downPayment.toString());

        // Select the "from account" dropdown option
        const fromAccount: string = process.env.CUSTOMER_DEFAULT_ACCOUNT;
        if (!fromAccount) {
            throw new Error('Environment variable CUSTOMER_DEFAULT_ACCOUNT is not defined.');
        }
        await this.fromAccountSelect.selectOption({ value: fromAccount });
    }
}
