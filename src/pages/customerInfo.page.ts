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

    private get inputFields(): Record<string, Locator> {
        return {
            firstName: this.page.getByTestId('customer.firstName'),
            lastName: this.page.getByTestId('customer.lastName'),
            address: this.page.getByTestId('customer.address.street'),
            city: this.page.getByTestId('customer.address.city'),
            state: this.page.getByTestId('customer.address.state'),
            zipCode: this.page.getByTestId('customer.address.zipCode'),
            phoneNumber: this.page.getByTestId('customer.phoneNumber')
        };
    }

    private get updateBtn(): Locator {
        return this.updateProfileForm.locator('input[value="Update Profile"]');
    }

    // Actions
    async goto(): Promise<void> {
        await super.goto(URL.PROFILE);
    }

    /**
     * Fills and submits the update profile form.
     *
     * @param fieldsToUpdate - The fields to update with their new values.
     */
    async fillAndSubmitUpdateForm(fieldsToUpdate: CustomerData): Promise<void> {
        await this.updateProfileForm.waitFor({ state: 'visible' });

        for (const [field, value] of Object.entries(fieldsToUpdate)) {
            const input = this.inputFields[field];
            if (!input) {
                throw new Error(`Field "${field}" is not recognized.`);
            }
            await this.fillInputField(input, field, value);
        }

        await this.updateBtn.click();
    }

    /**
     * Fills a specific input field.
     *
     * @param input - The locator for the input field.
     * @param field - The name of the field being updated.
     * @param value - The value to fill in the field.
     */
    private async fillInputField(input: Locator, field: string, value: string): Promise<void> {
        if (!input.isEditable()) {
            throw new Error(`Field "${field}" is not editable.`);
        }

        await this.page.waitForTimeout(400);
        await input.fill(value);
    }
}
