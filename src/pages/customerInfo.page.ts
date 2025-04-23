import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';
import { URL } from 'src/constants';
import { CustomerData } from 'src/types/index';

export class UpdateInfoPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    get updateProfileForm(): Locator {
        return this.page.getByTestId('updateProfileForm');
    }

    get firstNameInput(): Locator {
        return this.page.getByTestId('customer.firstName');
    }

    get lastNameInput(): Locator {
        return this.page.getByTestId('customer.lastName');
    }

    get addressInput(): Locator {
        return this.page.getByTestId('customer.address.street');
    }

    get cityInput(): Locator {
        return this.page.getByTestId('customer.address.city');
    }

    get stateInput(): Locator {
        return this.page.getByTestId('customer.address.state');
    }

    get zipCodeInput(): Locator {
        return this.page.getByTestId('customer.address.zipCode');
    }

    get phoneNumberInput(): Locator {
        return this.page.getByTestId('customer.phoneNumber');
    }

    get updateBtn(): Locator {
        return this.updateProfileForm.locator('input[value="Update Profile"]');
    }

    async goto(): Promise<void> {
        await super.goto(URL.PROFILE);
    }

    async fillAndSubmitUpdateForm(fieldsToUpdate: CustomerData): Promise<void> {
        await this.updateProfileForm.waitFor({ state: 'visible' });

        const fieldMap = {
            firstName: this.firstNameInput,
            lastName: this.lastNameInput,
            address: this.addressInput,
            city: this.cityInput,
            state: this.stateInput,
            zipCode: this.zipCodeInput,
            phoneNumber: this.phoneNumberInput
        };

        for (const [field, value] of Object.entries(fieldsToUpdate)) {
            const input: Locator = fieldMap[field];
            if (!input) {
                throw new Error(`Field "${field}" is not recognized.`);
            }

            const isEditable: boolean = await input.isEditable();
            if (!isEditable) {
                throw new Error(`Field "${field}" is not editable.`);
            }
            await this.page.waitForTimeout(400);
            await input.fill(value);
        }

        await this.updateBtn.click();
    }
}
