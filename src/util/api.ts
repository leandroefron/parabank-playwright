import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { createApiContext, mapCustomerData } from './helpers';
import { AccountData, CreateAccountData, CustomerData, TxData } from '@/interfaces';

const url: string = `${process.env.BASE_URL}${process.env.SERVICES_ROUTE}`;

export async function cleanDatabase(): Promise<void> {
    try {
        const apiContext: APIRequestContext = await createApiContext();
        const response: APIResponse = await apiContext.post(`${url}/cleanDB`, {
            data: ''
        });

        expect(response.status()).toBe(204);
    } catch (error) {
        throw new Error('Error cleaning database: ' + error);
    }
}

export async function initializeDatabase(): Promise<void> {
    try {
        const apiContext: APIRequestContext = await createApiContext();
        const response: APIResponse = await apiContext.post(`${url}/initializeDB`, {
            data: ''
        });

        expect(response.status()).toBe(204);
    } catch (error) {
        throw new Error('Error initializing database: ' + error);
    }
}

export async function getCustomerId(username: string, password: string): Promise<string> {
    try {
        const apiContext: APIRequestContext = await createApiContext();
        const response: APIResponse = await apiContext.get(`${url}/login/${username}/${password}`);

        expect(response.status()).toBe(200);

        const body: any = await response.json();
        const customerData: CustomerData = mapCustomerData(body);

        return customerData.id;
    } catch (error) {
        throw new Error('Getting customer id: ' + error);
    }
}

export async function getCustomerDetails(customerId: string): Promise<CustomerData> {
    try {
        const apiContext: APIRequestContext = await createApiContext();
        const response: APIResponse = await apiContext.get(`${url}/customers/${customerId}`);

        expect(response.status()).toBe(200);

        const body: CustomerData = await response.json();
        const customerData: CustomerData = mapCustomerData(body);

        return customerData;
    } catch (error) {
        throw new Error('Getting customer details: ' + error);
    }
}

export async function getCustomerAccounts(customerId: string): Promise<AccountData[]> {
    try {
        const apiContext: APIRequestContext = await createApiContext();
        const response: APIResponse = await apiContext.get(`${url}/customers/${customerId}/accounts`);

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
        const response: APIResponse = await apiContext.post(`${url}/createAccount?${qs}`, {
            data: ''
        });

        expect(response.status()).toBe(200);

        const body: AccountData = await response.json();

        return body.id;
    } catch (error) {
        throw new Error('Creating account: ' + error.message);
    }
}

export async function getAccountById(accountId: string): Promise<AccountData> {
    try {
        const apiContext: APIRequestContext = await createApiContext();
        const response: APIResponse = await apiContext.get(`${url}/accounts/${accountId}`);

        expect(response.status()).toBe(200);

        const body: AccountData = await response.json();

        return body;
    } catch (error) {
        throw new Error('Getting account: ' + error);
    }
}

export async function setParameter(name: string, value: string): Promise<void> {
    try {
        const apiContext: APIRequestContext = await createApiContext();
        const response: APIResponse = await apiContext.post(`${url}/setParameter/${name}/${value}`, {
            data: ''
        });

        expect(response.status()).toBe(204);
    } catch (error) {
        throw new Error('Error cleaning database: ' + error);
    }
}

export async function getTxsByAccount(accountId: string): Promise<TxData[]> {
    try {
        const apiContext: APIRequestContext = await createApiContext();
        const response: APIResponse = await apiContext.get(`${url}/accounts/${accountId}/transactions`);

        expect(response.status()).toBe(200);

        const body: TxData[] = await response.json();

        return body;
    } catch (error) {
        throw new Error('Getting account: ' + error);
    }
}
