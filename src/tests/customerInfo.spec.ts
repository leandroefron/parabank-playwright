import { test, expect } from '../fixtures/custom.fixture';
import { getCustomerDetails } from 'src/util/api';
import { CustomerData } from 'src/types';

const updatedProfileData: CustomerData = {
    firstName: 'FirstNameModified',
    lastName: 'LastNameModified',
    city: 'CityModified',
    phoneNumber: '999-111-000'
};

/**
 * Validates that the actual customer data matches the expected data.
 *
 * @param expected - The expected customer data.
 * @param actual - The actual customer data retrieved from the API.
 */
function validateUpdatedProfileData<T extends Record<string, any>>(expected: Partial<T>, actual: T): void {
    for (const [key, value] of Object.entries(expected)) {
        expect(actual[key], `Mismatch on field "${key}"`).toBe(value);
    }
}

test.describe('Customer info tests @all', { tag: ['@customers'] }, () => {
    test('should update customer contact info successfully', async ({ updateInfoPage }) => {
        await updateInfoPage.fillAndSubmitUpdateForm(updatedProfileData);

        // Retrieve the updated customer details from the API
        const customerDetails: CustomerData = await getCustomerDetails(process.env.CUSTOMER_ID);

        validateUpdatedProfileData(updatedProfileData, customerDetails);
    });
});
