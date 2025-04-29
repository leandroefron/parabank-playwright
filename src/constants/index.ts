export const INITIAL_BALANCE = 1000.0;
export const MINIMUM_BALANCE = 100.0;
export const TRANSFER_AMOUNT = 50.0;
export const BILL_PAY_AMOUNT = 50.0;

export const URLS = {
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
    LOAN_DENIED_AMOUNT: 'We cannot grant a loan in that amount with your available funds and down payment.',
    LOAN_DENIED_NO_FUNDS: 'You do not have sufficient funds for the given down payment.',
    VALIDATION_ERROR: '{field} is required.'
};

export const TITLES = {
    WELCOME: 'Welcome {name}',
    CUSTOMER_LOGIN: 'Customer Login',
    ACCOUNTS_OVERVIEW: 'Accounts Overview',
    ACCOUNT_OPENED: 'Account Opened!',
    BILL_PAY_COMPLETE: 'Bill Payment Complete',
    TRANSFER_COMPLETE: 'Transfer Complete!',
    LOAN_PROCESSED: 'Loan Request Processed',
    TRANSACTION_RESULTS: 'Transaction Results',
    PROFILE_UPDATED: 'Profile Updated'
};

export const ACCOUNT_TYPES = {
    CHECKING: '0',
    SAVINGS: '1',
    LOAN: '2'
};