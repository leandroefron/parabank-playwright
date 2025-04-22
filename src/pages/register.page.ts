import { BasePage } from './base.page';
import { Page } from '@playwright/test';
import { URL } from '../constants';
import { getRandomUsername } from 'src/util/helpers';
import { UserRegisterData } from '../types/index';

export class RegisterPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    get customerForm() {
        return this.page.getByTestId('customerForm');
    }

    get firstNameInput() {
        return this.page.getByTestId('customer.firstName');
    }

    get firstNameError() {
        return this.page.getByTestId('customer.firstName.errors');
    }

    get lastNameInput() {
        return this.page.getByTestId('customer.lastName');
    }

    get lastNameError() {
        return this.page.getByTestId('customer.lastName.errors');
    }

    get addressInput() {
        return this.page.getByTestId('customer.address.street');
    }

    get addressError() {
        return this.page.getByTestId('customer.address.street.errors');
    }

    get cityInput() {
        return this.page.getByTestId('customer.address.city');
    }

    get cityError() {
        return this.page.getByTestId('customer.address.city.errors');
    }

    get stateInput() {
        return this.page.getByTestId('customer.address.state');
    }

    get stateError() {
        return this.page.getByTestId('customer.address.state.errors');
    }

    get zipCodeInput() {
        return this.page.getByTestId('customer.address.zipCode');
    }

    get zipCodeError() {
        return this.page.getByTestId('customer.address.zipCode.errors');
    }

    get phoneNumberInput() {
        return this.page.getByTestId('customer.phoneNumber');
    }

    get phoneNumberError() {
        return this.page.getByTestId('customer.phoneNumber.errors');
    }

    get ssnInput() {
        return this.page.getByTestId('customer.ssn');
    }

    get ssnError() {
        return this.page.getByTestId('customer.ssn.errors');
    }

    get usernameInput() {
        return this.page.getByTestId('customer.username');
    }

    get usernameError() {
        return this.page.getByTestId('customer.username.errors');
    }

    get passwordInput() {
        return this.page.getByTestId('customer.password');
    }

    get passwordError() {
        return this.page.getByTestId('customer.password.errors');
    }

    get confirmInput() {
        return this.page.getByTestId('repeatedPassword');
    }

    get confirmError() {
        return this.page.getByTestId('repeatedPassword.errors');
    }

    get submitBtn() {
        return this.customerForm.locator('input[type="submit"]');
    }

    async goto(): Promise<void> {
        await super.goto(URL.REGISTER);
    }

    async fillAllFields(userData: UserRegisterData, submit: boolean): Promise<string> {
        try {
            await this.customerForm.waitFor({ state: 'visible' });

            // Generate a random username
            userData.username = await getRandomUsername();

            if (!userData.username || userData.username.trim() === '') {
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
                if (userData[key]) {
                    await input.fill(userData[key]);
                }
            }

            if (submit) {
                await this.submitBtn.click();
            }

            return userData.username;
        } catch (error) {
            console.error('Error filling the registration form: ', error);
            throw error;
        }
    }
}
