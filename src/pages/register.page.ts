import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';
import { getRandomUsername } from 'src/util/helpers';
import { CustomerData } from '@/interfaces';
import { URLS } from '../constants';

export class RegisterPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Locators
    get customerForm(): Locator {
        return this.page.getByTestId('customerForm');
    }

    private get inputFields(): Record<string, Locator> {
        return {
            firstName: this.page.getByTestId('customer.firstName'),
            lastName: this.page.getByTestId('customer.lastName'),
            address: this.page.getByTestId('customer.address.street'),
            city: this.page.getByTestId('customer.address.city'),
            state: this.page.getByTestId('customer.address.state'),
            zipCode: this.page.getByTestId('customer.address.zipCode'),
            phoneNumber: this.page.getByTestId('customer.phoneNumber'),
            ssn: this.page.getByTestId('customer.ssn'),
            username: this.page.getByTestId('customer.username'),
            password: this.page.getByTestId('customer.password'),
            confirmPassword: this.page.getByTestId('repeatedPassword')
        };
    }

    private get errorFields(): Record<string, Locator> {
        return {
            firstName: this.page.getByTestId('customer.firstName.errors'),
            lastName: this.page.getByTestId('customer.lastName.errors'),
            address: this.page.getByTestId('customer.address.street.errors'),
            city: this.page.getByTestId('customer.address.city.errors'),
            state: this.page.getByTestId('customer.address.state.errors'),
            zipCode: this.page.getByTestId('customer.address.zipCode.errors'),
            phoneNumber: this.page.getByTestId('customer.phoneNumber.errors'),
            ssn: this.page.getByTestId('customer.ssn.errors'),
            username: this.page.getByTestId('customer.username.errors'),
            password: this.page.getByTestId('customer.password.errors'),
            confirmPassword: this.page.getByTestId('repeatedPassword.errors')
        };
    }

    get submitBtn(): Locator {
        return this.customerForm.locator('input[type="submit"]');
    }

    get welcomeTitle(): Locator {
        return this.rightPanelContainer.locator('h1');
    }

    get welcomeMessage(): Locator {
        return this.rightPanelContainer.locator('p');
    }

    // Actions
    async goto(): Promise<void> {
        await super.goto(URLS.REGISTER);
    }

    /**
     * Registers a customer by filling the form and submitting it.
     *
     * @param customerData - Data for registration.
     * @param submit - Whether to submit the form.
     * @param fieldToOmit - Optional field to omit while filling the form.
     */
    async registerCustomer(customerData: CustomerData, submit: boolean, fieldToOmit?: string): Promise<string> {
        await this.customerForm.waitFor({ state: 'visible' });

        try {
            if (!customerData.username || customerData.username.trim() === '') {
                customerData.username = await getRandomUsername();
            }

            await this.fillRegisterForm(customerData, fieldToOmit);

            if (submit) {
                await this.submitBtn.click();
            }

            return customerData.username;
        } catch (error) {
            throw new Error(`Failed to fill the registration form: ${error.message}`);
        }
    }

    /**
     * Fills the registration form with the provided data.
     *
     * @param customerData - Data for registration.
     * @param fieldToOmit - Optional field to omit while filling the form.
     */
    async fillRegisterForm(customerData: CustomerData, fieldToOmit?: string): Promise<void> {
        for (const [field, input] of Object.entries(this.inputFields)) {
            if (field !== fieldToOmit && customerData[field] !== undefined) {
                await input.fill(String(customerData[field]));
            }
        }
    }

    /**
     * Get an error message for a specific field.
     * @param field - Field name
     */
    async getErrorMessage(field: string): Promise<string> {
        const errorLocator: Locator = this.errorFields[field];

        if (!errorLocator) {
            throw new Error(`Error field locator for "${field}" not found.`);
        }

        await errorLocator.waitFor({ state: 'visible' });
        const errorMessage: string = (await errorLocator.textContent()).trim();

        return errorMessage;
    }
}
