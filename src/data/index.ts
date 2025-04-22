import { BillPayData, UserRegisterData } from 'src/types';

export const customerData: UserRegisterData = {
    firstName: 'Peter',
    lastName: 'Smith',
    address: '1234 Main St',
    city: 'Miami',
    state: 'Florida',
    zipCode: '12345',
    phoneNumber: '555-666-777',
    ssn: '12456789',
    username: '',
    password: 'a',
    confirmPassword: 'a'
    // password: 'Password123!',
    // confirmPassword: 'Password123!'
};

export const profileFieldMap = {
    firstName: 'firstName',
    lastName: 'lastName',
    phoneNumber: 'phoneNumber',
    city: 'address.city',
    address: 'address.street',
    state: 'address.state',
    zipCode: 'address.zipCode',
    ssn: 'ssn'
};

export const billPayData: BillPayData = {
    payeeName: `${customerData.firstName} ${customerData.lastName}`,
    address: customerData.address,
    city: customerData.city,
    state: customerData.state,
    zipCode: customerData.zipCode,
    phoneNumber: customerData.phoneNumber,
    account: '222555',
    verifyAccount: '222555',
    amount: '50'
};
