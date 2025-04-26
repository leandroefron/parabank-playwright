export const INITIAL_BALANCE = '1000.00';
export const MINIMUM_BALANCE = '100.00';
export const TRANSFER_AMOUNT = '50.00';
export const BILL_PAY_AMOUNT = 50.0;

export const URL = {
    REGISTER: '/parabank/register.htm',
    BASE: '/parabank/index.htm',
    OPEN_ACCOUNT: '/parabank/openaccount.htm',
    OVERVIEW: '/parabank/overview.htm',
    TRANSFERS: '/parabank/transfer.htm',
    BILL_PAY: '/parabank/billpay.htm',
    TRANSACTIONS: '/parabank/findtrans.htm',
    PROFILE: '/parabank/updateprofile.htm',
    LOANS: '/parabank/requestloan.htm'
};

export const MESSAGES = {
    ACCOUNT_CREATED: 'Your account was created successfully. You are now logged in.',
    LOAN_APPROVED: 'Congratulations, your loan has been approved.',
    LOAN_DENIED_AMOUNT: 'We cannot grant a loan in that amount with your available funds and down payment.',
    LOAN_DENIED_NO_FUNDS: 'You do not have sufficient funds for the given down payment.',
    VALIDATION_ERROR: '{field} is required.',
    WELCOME: 'Welcome {name}'
};

export const TITLES = {
    CUSTOMER_LOGIN: 'Customer Login',
    ACCOUNT_OPENED: 'Account Opened!',
    BILL_PAY_COMPLETE: 'Bill Payment Complete',
    TRANSFER_COMPLETE: 'Transfer Complete!'
};
