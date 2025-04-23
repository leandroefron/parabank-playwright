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
};

export interface BillPayData {
    payeeName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    account: string;
    verifyAccount: string;
    amount: string;
};

export interface AccountData {
    id: string;
    customerId: string;
    type: string;
    balance: string;
};

export interface CreateAccountData {
    customerId: string;
    newAccountType: string;
    fromAccountId: string;
};
