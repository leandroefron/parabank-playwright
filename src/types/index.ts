export type UserData = {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    ssn: string;
};

export type UserRegisterData = UserData & {
    username: string;
    password: string;
    confirmPassword: string;
};

export type BillPayData = {
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

export type AccountData = {
    id: string;
    customerId: string;
    type: string;
    balance: string;
};

export type CustomerData = {
    id: string;
    firstName: string;
    lastName: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    phoneNumber: string;
    ssn: string;
};

export type CreateAccountData = {
    customerId: string;
    newAccountType: string;
    fromAccountId: string;
};
