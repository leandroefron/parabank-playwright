import { test as setup, BrowserContext, chromium } from '../src/fixtures/custom.fixture';
import { RegisterPage } from 'src/pages/register.page';
import { customerData } from 'src/data';
import { STORAGE_STATE } from '../playwright.config';
import { setCustomerEnvVars } from 'src/util/helpers';

setup('Creating new customer', async () => {
    const browser = await chromium.launch({ headless: true });

    try {
        const context: BrowserContext = await browser.newContext();
        const page = await context.newPage();
        const registerPage = new RegisterPage(page);
        await registerPage.goto();

        const username: string = await registerPage.fillRegisterForm(customerData, true);
        await setCustomerEnvVars(username, customerData.password);

        await page.context().storageState({ path: STORAGE_STATE });
        console.log('✅ Customer created successfully:', username);

        await context.close();
        await browser.close();
    } catch (error) {
        throw new Error(`Creating new customer \n${error}`);
    }
});
