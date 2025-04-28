import { BillPayData, CustomerData } from '@/interfaces';
import { BILL_PAY_AMOUNT } from '@/constants';

export const customerData: CustomerData = {
    firstName: 'Peter',
    lastName: 'Smith',
    address: '1234 Main St',
    city: 'Miami',
    state: 'Florida',
    zipCode: '12345',
    phoneNumber: '555-666-777',
    ssn: '12456789',
    username: '',
    password: 'Password123!',
    confirmPassword: 'Password123!'
};

export const billPayData: BillPayData = {
    payeeName: 'John Biller',
    address: '5678 First St',
    city: 'Dallas',
    state: 'Texas',
    zipCode: '67889',
    phoneNumber: '222-555-1234',
    account: '4444',
    verifyAccount: '4444',
    amount: BILL_PAY_AMOUNT
};
