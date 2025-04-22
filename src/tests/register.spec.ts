import { test, expect } from '../fixtures/custom.fixture';
import { customerData } from 'src/data';
import { MESSAGES } from 'src/constants';

const fieldMap = {
    firstName: { tag: 'First name', testId: 'customer.firstName', errorId: 'customer.firstName.errors' },
    lastName: { tag: 'Last name', testId: 'customer.lastName', errorId: 'customer.lastName.errors' },
    address: { tag: 'Address', testId: 'customer.address.street', errorId: 'customer.address.street.errors' },
    city: { tag: 'City', testId: 'customer.address.city', errorId: 'customer.address.city.errors' },
    state: { tag: 'State', testId: 'customer.address.state', errorId: 'customer.address.state.errors' },
    zipCode: { tag: 'Zip Code', testId: 'customer.address.zipCode', errorId: 'customer.address.zipCode.errors' },
    phoneNumber: { tag: 'Phone number', testId: 'customer.phoneNumber', errorId: 'customer.phoneNumber.errors' },
    ssn: { tag: 'Social Security Number', testId: 'customer.ssn', errorId: 'customer.ssn.errors' },
    username: { tag: 'Username', testId: 'customer.username', errorId: 'customer.username.errors' },
    password: { tag: 'Password', testId: 'customer.password', errorId: 'customer.password.errors' },
    confirm: { tag: 'Password confirmation', testId: 'repeatedPassword', errorId: 'repeatedPassword.errors' }
};

test.describe('Register page tests', { tag: ['@register'] }, () => {
    test('should be able to register a new user', async ({ registerPage, homePage }) => {
        const username: string = await registerPage.fillRegisterForm(customerData, true);
        await homePage.title.waitFor({ state: 'visible' });

        expect(homePage.title).toHaveText(`Welcome ${username}`);
        expect(homePage.bodyMessage).toHaveText(MESSAGES.ACCOUNT_CREATED);
    });

    for (const [key, { tag, testId, errorId }] of Object.entries(fieldMap)) {
        test(`should show validation error when '${tag}' is empty`, async ({ registerPage, page }) => {
            await registerPage.fillRegisterForm(customerData, false);

            // Clear the specific field being tested
            await page.getByTestId(testId).fill('');

            await registerPage.submitBtn.click();

            await expect(page.getByTestId(errorId)).toHaveText(`${tag} is required.`);
        });
    }
});
