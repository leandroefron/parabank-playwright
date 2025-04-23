import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';
import { URL } from '../constants';
import { getRandomUsername } from 'src/util/helpers';
import { CustomerRegisterData } from '../types/index';

export class RegisterPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    get customerForm(): Locator {
        return this.page.getByTestId('customerForm');
    }

    get firstNameInput(): Locator {
        return this.page.getByTestId('customer.firstName');
    }

    get firstNameError(): Locator {
        return this.page.getByTestId('customer.firstName.errors');
    }

    get lastNameInput(): Locator {
        return this.page.getByTestId('customer.lastName');
    }

    get lastNameError(): Locator {
        return this.page.getByTestId('customer.lastName.errors');
    }

    get addressInput(): Locator {
        return this.page.getByTestId('customer.address.street');
    }

    get addressError(): Locator {
        return this.page.getByTestId('customer.address.street.errors');
    }

    get cityInput(): Locator {
        return this.page.getByTestId('customer.address.city');
    }

    get cityError(): Locator {
        return this.page.getByTestId('customer.address.city.errors');
    }

    get stateInput(): Locator {
        return this.page.getByTestId('customer.address.state');
    }

    get stateError(): Locator {
        return this.page.getByTestId('customer.address.state.errors');
    }

    get zipCodeInput(): Locator {
        return this.page.getByTestId('customer.address.zipCode');
    }

    get zipCodeError(): Locator {
        return this.page.getByTestId('customer.address.zipCode.errors');
    }

    get phoneNumberInput(): Locator {
        return this.page.getByTestId('customer.phoneNumber');
    }

    get phoneNumberError(): Locator {
        return this.page.getByTestId('customer.phoneNumber.errors');
    }

    get ssnInput(): Locator {
        return this.page.getByTestId('customer.ssn');
    }

    get ssnError(): Locator {
        return this.page.getByTestId('customer.ssn.errors');
    }

    get usernameInput(): Locator {
        return this.page.getByTestId('customer.username');
    }

    get usernameError(): Locator {
        return this.page.getByTestId('customer.username.errors');
    }

    get passwordInput(): Locator {
        return this.page.getByTestId('customer.password');
    }

    get passwordError(): Locator {
        return this.page.getByTestId('customer.password.errors');
    }

    get confirmInput(): Locator {
        return this.page.getByTestId('repeatedPassword');
    }

    get confirmError(): Locator {
        return this.page.getByTestId('repeatedPassword.errors');
    }

    get submitBtn(): Locator {
        return this.customerForm.locator('input[type="submit"]');
    }

    async goto(): Promise<void> {
        await super.goto(URL.REGISTER);
    }

    async fillRegisterForm(customerData: CustomerRegisterData, submit: boolean): Promise<string> {
        try {
            await this.customerForm.waitFor({ state: 'visible' });

            // Generate a random username
            customerData.username = await getRandomUsername();

            if (!customerData.username || customerData.username.trim() === '') {
                throw new Error('Generated username is empty or invalid.');
            }

            // Map of input fields to their corresponding data
            const fieldMap = {
                firstName: this.firstNameInput,
                lastName: this.lastNameInput,
                address: this.addressInput,
                city: this.cityInput,
                state: this.stateInput,
                zipCode: this.zipCodeInput,
                phoneNumber: this.phoneNumberInput,
                ssn: this.ssnInput,
                username: this.usernameInput,
                password: this.passwordInput,
                confirmPassword: this.confirmInput
            };

            // Fill each field dynamically
            for (const [key, input] of Object.entries(fieldMap)) {
                if (customerData[key]) {
                    await input.fill(customerData[key]);
                }
            }

            if (submit) {
                await this.submitBtn.click();
                await this.title.waitFor({ state: 'visible' });
            }

            return customerData.username;
        } catch (error) {
            console.error('Error filling the registration form: ', error);
            throw error;
        }
    }
}
