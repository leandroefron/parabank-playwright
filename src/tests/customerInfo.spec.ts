import { test, expect } from '../fixtures/custom.fixture';
import { profileFieldMap } from 'src/data';
import { getCustomerDetails } from 'src/util/api';

const updatedProfileData = {
    firstName: 'FirstNameModified',
    lastName: 'LastNameModified',
    city: 'CityModified',
    phoneNumber: '999-111-000'
};

/**
 * Validates that the updated profile data matches the expected values.
 * @param updatedData - The data that was updated.
 * @param fieldMap - A mapping of field names to their paths in the customer details object.
 * @param customerDetails - The customer details object retrieved from the API.
 */
async function validateUpdatedProfileData(updatedData: { [key: string]: string }, fieldMap: { [key: string]: string }, customerDetails: object): Promise<void> {
    for (const [key, expectedValue] of Object.entries(updatedData)) {
        const path: string = fieldMap[key as keyof typeof updatedProfileData];
        const actualValue: any = path.split('.').reduce((obj, k) => obj?.[k], customerDetails);

        expect(actualValue).toBe(expectedValue);
    }
}

test.describe('Customer info tests', { tag: ['@customers'] }, () => {
    test('should update customer contact info', async ({ updateInfoPage }) => {
        await updateInfoPage.updateFields(updatedProfileData);

        const customerDetails: object = await getCustomerDetails(process.env.CUSTOMER_ID);

        await validateUpdatedProfileData(updatedProfileData, profileFieldMap, customerDetails);
    });
});
