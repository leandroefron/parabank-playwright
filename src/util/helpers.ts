import path from 'path';
import { Locator, Page } from '@playwright/test';
import { APIRequestContext, request } from '@playwright/test';
import * as api from './api';
import { AccountData } from 'src/types';
import { CustomerData } from 'src/types';
export const authFile = 'playwright/.auth/user.json';

const ROOT_DIR = process.cwd();
const TMP_FILE = path.join(ROOT_DIR, 'tmp/user.json');

export async function getRandomUsername(prefix: string = 'testuser', length: number = 8): Promise<string> {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const randomSuffix: string = Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');

    return Promise.resolve(`${prefix}_${randomSuffix}`);
}

export async function createApiContext(): Promise<APIRequestContext> {
    const apiContext: APIRequestContext = await request.newContext({
        extraHTTPHeaders: {
            accept: 'application/json',
            'Content-Type': 'application/json' // Add this line to set the Content-Type header
        }
    });

    return apiContext;
}

export async function setCustomerEnvVars(customerUserName: string, password: string): Promise<void> {
    process.env.CUSTOMER_USERNAME = customerUserName;
    process.env.CUSTOMER_ID = await api.getCustomerId(customerUserName, password);

    const accountData: AccountData[] = await api.getCustomerAccounts(process.env.CUSTOMER_ID);
    process.env.CUSTOMER_DEFAULT_ACCOUNT = accountData[0].id;
}

// export async function saveUser(username: string): Promise<void> {
//     fs.mkdirSync(path.dirname(TMP_FILE), { recursive: true });
//     fs.writeFileSync(TMP_FILE, JSON.stringify({ username }, null, 2));
// }

/**
 * Selects an option from a dropdown by its value.
 *
 * @param locator - The Playwright Locator for the dropdown element.
 * @param value - The value attribute of the option to select.
 * @throws Error if the dropdown is not visible or the value cannot be selected.
 */
export async function selectDropdownByValue(locator: Locator, value: string | number): Promise<void> {
    await locator.waitFor({ state: 'visible' });

    const isEnabled: boolean = await locator.isEnabled();
    if (!isEnabled) {
        throw new Error('Dropdown is not enabled.');
    }

    const valueStr: string = typeof value === 'number' ? value.toString() : value;

    try {
        await locator.selectOption({ value: valueStr });
    } catch (error) {
        throw new Error(`Failed to select the option with value "${value}": ${error}`);
    }
}

/**
 * Retrieves the balance of an account by its ID.
 *
 * @param accountId - The ID of the account to retrieve the balance for.
 * @returns The balance of the account as a number.
 * @throws Error if the account data cannot be retrieved or the balance is invalid.
 */
export async function getBalanceFromAccount(accountId: string): Promise<number> {
    try {
        // Fetch account data using the API
        const accountData: AccountData = await api.getAccountById(accountId);

        // Parse the balance as a number
        const balance: number = Number(accountData.balance);

        // Validate the parsed balance
        if (isNaN(balance)) {
            throw new Error(`Invalid balance value for account "${accountId}": ${accountData.balance}`);
        }

        return balance;
    } catch (error) {
        throw new Error(`Failed to retrieve balance for account "${accountId}": ${error}`);
    }
}

export function mapCustomerData(data: any): CustomerData {
    return {
        id: data.id ?? '', 
        firstName: data.firstName ?? '', 
        lastName: data.lastName ?? '',
        address: data.address.street ?? '', 
        city: data.address.city ?? '',
        state: data.address.state ?? '',
        zipCode: data.address.zipCode ?? '',
        phoneNumber: data.phoneNumber ?? '', 
        ssn: data.ssn ?? ''
    };
}