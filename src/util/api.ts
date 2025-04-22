import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { createApiContext } from './helpers';
import { AccountData, CreateAccountData, CustomerData } from 'src/types';

const baseURL = `${process.env.BASE_URL}${process.env.SERVICES_URL}`;

export async function cleanDatabase(): Promise<void> {
    try {
        const baseURL = `${process.env.BASE_URL}${process.env.SERVICES_URL}`;
        const apiContext: APIRequestContext = await createApiContext();
        const response: APIResponse = await apiContext.post(`${baseURL}/cleanDB`, {
            data: ''
        });

        expect(response.status()).toBe(204);
    } catch (error) {
        throw new Error('Error cleaning database: ' + error);
    }
}

export async function getCustomerId(username: string, password: string): Promise<string> {
    try {
        const apiContext: APIRequestContext = await createApiContext();
        const response: APIResponse = await apiContext.get(`${baseURL}/login/${username}/${password}`);

        expect(response.status()).toBe(200);

        const body: CustomerData = await response.json();

        return body.id;
    } catch (error) {
        throw new Error('Getting customer id: ' + error);
    }
}

export async function getCustomerDetails(customerId: string): Promise<CustomerData> {
    try {
        const apiContext: APIRequestContext = await createApiContext();
        const response: APIResponse = await apiContext.get(`${baseURL}/customers/${customerId}`);

        expect(response.status()).toBe(200);

        const body: CustomerData = await response.json();

        return body;
    } catch (error) {
        throw new Error('Getting customer details: ' + error);
    }
}

export async function getCustomerAccounts(customerId: string): Promise<AccountData[]> {
    try {
        const apiContext: APIRequestContext = await createApiContext();
        const response: APIResponse = await apiContext.get(`${baseURL}/customers/${customerId}/accounts`);

        expect(response.status()).toBe(200);

        const body: AccountData[] = await response.json();

        return body;
    } catch (error) {
        throw new Error('Getting customer accounts: ' + error);
    }
}

export async function createAccount(data: CreateAccountData): Promise<string> {
    const { customerId, newAccountType, fromAccountId } = data;
    const qs = `customerId=${customerId}&newAccountType=${newAccountType}&fromAccountId=${fromAccountId}`;

    try {
        const apiContext: APIRequestContext = await createApiContext();
        const response: APIResponse = await apiContext.post(`${baseURL}/createAccount?${qs}`, {
            data: ''
        });

        expect(response.status()).toBe(200);

        const body: AccountData = await response.json();

        return body.id;
    } catch (error) {
        throw new Error('Error cleaning database: ' + error);
    }
}

export async function getAccountById(accountId: string): Promise<AccountData> {
    try {
        const apiContext: APIRequestContext = await createApiContext();
        const response: APIResponse = await apiContext.get(`${baseURL}/accounts/${accountId}`);

        expect(response.status()).toBe(200);

        const body: AccountData = await response.json();

        return body;
    } catch (error) {
        throw new Error('Getting account: ' + error);
    }
}
