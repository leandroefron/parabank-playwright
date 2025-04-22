import { test as setup } from '../src/fixtures/custom.fixture';
import { RegisterPage } from 'src/pages/register.page';
import { userData } from 'src/data';
import { BrowserContext, chromium } from '@playwright/test';
import { STORAGE_STATE } from '../playwright.config';
import { setCustomerEnvVars } from 'src/util/helpers';

setup('Creating new user', async () => {
    const browser = await chromium.launch({ headless: true });

    try {
        const context: BrowserContext = await browser.newContext();
        const page = await context.newPage();
        const registerPage = new RegisterPage(page);
        await registerPage.goto();

        const username: string = await registerPage.fillAllFields(userData, true);
        await setCustomerEnvVars(username, userData.password);

        await page.context().storageState({ path: STORAGE_STATE });
        console.log('User created successfully:', username);

        await context.close();
        await browser.close();
    } catch (error) {
        throw new Error(`Creating new user \n${error}`);
    }
});