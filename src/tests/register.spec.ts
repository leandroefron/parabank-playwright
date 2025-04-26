import { test, expect } from '../fixtures/custom.fixture';
import { customerData } from 'src/data';
import { MESSAGES } from 'src/constants';

const validationFields = [
    { tag: 'First name', testId: 'customer.firstName', errorId: 'customer.firstName.errors' },
    { tag: 'Last name', testId: 'customer.lastName', errorId: 'customer.lastName.errors' },
    { tag: 'Address', testId: 'customer.address.street', errorId: 'customer.address.street.errors' },
    { tag: 'City', testId: 'customer.address.city', errorId: 'customer.address.city.errors' },
    { tag: 'State', testId: 'customer.address.state', errorId: 'customer.address.state.errors' },
    { tag: 'Zip Code', testId: 'customer.address.zipCode', errorId: 'customer.address.zipCode.errors' },
    { tag: 'Social Security Number', testId: 'customer.ssn', errorId: 'customer.ssn.errors' },
    { tag: 'Username', testId: 'customer.username', errorId: 'customer.username.errors' },
    { tag: 'Password', testId: 'customer.password', errorId: 'customer.password.errors' },
    { tag: 'Password confirmation', testId: 'repeatedPassword', errorId: 'repeatedPassword.errors' }
];

test.describe('Register page', { tag: ['@register'] }, () => {
    test('should successfully register a new customer', async ({ registerPage }) => {
        const username: string = await registerPage.fillRegisterForm(customerData, true);

        await expect(registerPage.welcomeTitle).toHaveText(`Welcome ${username}`);
        await expect(registerPage.welcomeMessage).toHaveText(MESSAGES.ACCOUNT_CREATED);
    });

    validationFields.forEach(({ tag, testId, errorId }) => {
        test(`should show validation error when '${tag}' is empty`, async ({ registerPage }) => {
            await registerPage.fillRegisterForm(customerData, false);

            // Clear the specific field being tested
            await clearField(registerPage, testId);

            await registerPage.submitBtn.click();

            const errorMsg: string = await getErrorMessage(registerPage, errorId);
            const expectedErrorMsg: string = MESSAGES.VALIDATION_ERROR.replace('{field}', tag);

            expect(errorMsg).toBe(expectedErrorMsg);
        });
    });
});

// Helper function to clear a specific field
async function clearField(registerPage, testId: string): Promise<void> {
    await registerPage.page.getByTestId(testId).fill('');
}

// Helper function to retrieve the error message
async function getErrorMessage(registerPage, errorId: string): Promise<string> {
    return (await registerPage.page.getByTestId(errorId).textContent()).trim();
}
