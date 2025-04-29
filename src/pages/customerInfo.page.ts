import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';
import { URLS } from '@/constants';
import { CustomerData } from '@/interfaces';

export class UpdateInfoPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Locators
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
        await super.goto(URLS.PROFILE);
    }

    /**
     * Fills and submits the update profile form.
     *
     * @param fieldsToUpdate - The fields to update with their new values.
     */
    async updateProfile(fieldsToUpdate: CustomerData): Promise<void> {
        await this.updateProfileForm.waitFor({ state: 'visible' });

        try {
            await this.fillProfileForm(fieldsToUpdate);

            await this.updateBtn.click();
        } catch (error) {
            throw new Error(`Failed to update profile: ${error.message}`);
        }
    }

    /**
     * Fills the update profile form with the provided data.
     *
     * @param fieldsToUpdate - The fields to update with their new values.
     */
    private async fillProfileForm(fieldsToUpdate: CustomerData): Promise<void> {
        for (const [field, value] of Object.entries(fieldsToUpdate)) {
            const input: Locator = this.inputFields[field];
            if (!input) {
                throw new Error(`Field "${field}" is not recognized.`);
            }
            if (!input.isEditable()) {
                throw new Error(`Field "${field}" is not editable.`);
            }

            await this.page.waitForTimeout(200);
            await input.fill(value);
        }
    }
}
