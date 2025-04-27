import { test, expect } from '../fixtures/custom.fixture';
import { customerData } from 'src/data';
import { MESSAGES } from 'src/constants';

const validationFields = [
    { tag: 'First name', field: 'firstName' },
    { tag: 'Last name', field: 'lastName' },
    { tag: 'Address', field: 'address' },
    { tag: 'City', field: 'city' },
    { tag: 'State', field: 'state' },
    { tag: 'Zip Code', field: 'zipCode' },
    { tag: 'Social Security Number', field: 'ssn' },
    { tag: 'Username', field: 'username' },
    { tag: 'Password', field: 'password' },
    { tag: 'Password confirmation', field: 'confirmPassword' }
];

test.describe('Register page', { tag: ['@register'] }, () => {
    test('should successfully register a new customer @all', async ({ registerPage }) => {
        const username: string = await registerPage.fillRegisterForm(customerData, true);

        await expect(registerPage.welcomeTitle).toHaveText(`Welcome ${username}`);
        await expect(registerPage.welcomeMessage).toHaveText(MESSAGES.ACCOUNT_CREATED);
    });

    validationFields.forEach(({ tag, field }) => {
        test(`should show validation error when '${tag}' is empty`, async ({ registerPage }) => {
            await registerPage.fillRegisterForm(customerData, false);

            // Clear the specific field being tested
            await registerPage.fillInputField(field, '');

            await registerPage.submitBtn.click();

            const errorMsg: string = (await registerPage.getErrorMessage(field)).trim();
            const expectedErrorMsg: string = MESSAGES.VALIDATION_ERROR.replace('{field}', tag);

            expect(errorMsg).toBe(expectedErrorMsg);
        });
    });
});
