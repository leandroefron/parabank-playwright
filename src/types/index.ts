export interface CustomerData {
    id?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phoneNumber?: string;
    ssn?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
}

export interface BillPayData {
    payeeName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    account: string;
    verifyAccount: string;
    amount: number;
}

export interface AccountData {
    id: string;
    customerId: string;
    type: string;
    balance: string;
}

export interface CreateAccountData {
    customerId: string;
    newAccountType: string;
    fromAccountId: string;
}

export interface TxData {
    id: number;
    accountId: string;
    type: string;
    date: string;
    amount: number;
    description: string;
}

export interface TxRowData {
    date: string;
    transaction: string;
    debit: string;
    credit: string;
}
