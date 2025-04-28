import { APIRequestContext, Locator, request } from '@playwright/test';
import { AccountData, TxData, CustomerData } from 'src/types';
import * as api from './api';

export const authFile = 'playwright/.auth/user.json';

/**
 * Generates a random username with a given prefix and length.
 *
 * @param prefix - The prefix for the username.
 * @param length - The length of the random suffix.
 * @returns A randomly generated username.
 */
export async function getRandomUsername(prefix: string = 'testuser', length: number = 8): Promise<string> {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const randomSuffix: string = Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    const username: string = `${prefix}_${randomSuffix}`;

    if (!username.trim()) {
        throw new Error('Generated username is empty or invalid.');
    }

    return username;
}

/**
 * Creates a new API request context with default headers.
 *
 * @returns A Playwright APIRequestContext instance.
 */
export async function createApiContext(): Promise<APIRequestContext> {
    return request.newContext({
        extraHTTPHeaders: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

/**
 * Sets customer-related environment variables.
 *
 * @param customerUserName - The customer's username.
 * @param password - The customer's password.
 */
export async function setCustomerEnvVars(customerUserName: string, password: string): Promise<void> {
    process.env.CUSTOMER_USERNAME = customerUserName;
    process.env.CUSTOMER_ID = await api.getCustomerId(customerUserName, password);

    const accountData: AccountData[] = await api.getCustomerAccounts(process.env.CUSTOMER_ID);
    if (accountData.length === 0) {
        throw new Error(`No accounts found for the customer id: ${process.env.CUSTOMER_ID}`);
    }
    process.env.CUSTOMER_DEFAULT_ACCOUNT = accountData[0].id;
}

/**
 * Selects an option from a dropdown by its value.
 *
 * @param locator - The Playwright Locator for the dropdown element.
 * @param value - The value attribute of the option to select.
 */
export async function selectDropdownByValue(locator: Locator, value: string | number): Promise<void> {
    await locator.waitFor({ state: 'visible' });

    if (!(await locator.isEnabled())) {
        throw new Error('Dropdown is not enabled.');
    }

    try {
        await locator.selectOption(value.toString());
    } catch (error) {
        throw new Error(`Failed to select the option with value "${value}": ${error}`);
    }
}

/**
 * Retrieves the balance of an account by its ID.
 *
 * @param accountId - The ID of the account to retrieve the balance for.
 * @returns The balance of the account as a number.
 */
export async function getBalanceFromAccount(accountId: string): Promise<number> {
    try {
        const accountData: AccountData = await api.getAccountById(accountId);
        const balance: number = parseFloat(accountData.balance);

        if (isNaN(balance)) {
            throw new Error(`Invalid balance value for account "${accountId}": ${accountData.balance}`);
        }

        return balance;
    } catch (error) {
        throw new Error(`Failed to retrieve balance for account "${accountId}": ${error.message}`);
    }
}

/**
 * Maps raw customer data to a strongly typed CustomerData object.
 *
 * @param data - The raw customer data.
 * @returns A mapped CustomerData object.
 */
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

/**
 * Retrieves the transaction ID for a specific transaction.
 *
 * @param accountId - The ID of the account.
 * @param type - The type of the transaction (e.g., Debit, Credit).
 * @param amount - The amount of the transaction.
 * @param description - The description of the transaction (optional).
 * @returns The transaction ID as a string, or null if not found.
 */
export async function getTransactionId(accountId: string, type: string, amount: number, description?: string): Promise<string | null> {
    try {
        const transactions: TxData[] = await api.getTxsByAccount(accountId);

        const matchingTransaction: TxData = transactions.find(txn => {
            const matchesType: boolean = txn.type === type;
            const matchesAmount: boolean = txn.amount === amount;
            const matchesDescription: boolean = description ? txn.description === description : true;

            return matchesType && matchesAmount && matchesDescription;
        });

        return matchingTransaction ? matchingTransaction.id.toString() : null;
    } catch (error) {
        throw new Error(`Failed to retrieve transaction ID for account "${accountId}": ${error.message}`);
    }
}

/**
 * Normalizes an amount to a string with two decimal places.
 *
 * @param amount - The amount to normalize.
 * @returns The normalized amount as a string.
 */
export function normalizeAmount(amount: number | string): string {
    return parseFloat(amount.toString()).toFixed(2);
}
