import { BillPayData, UserRegisterData } from 'src/types';

export const userData: UserRegisterData = {
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
    payeeName: `${userData.firstName} ${userData.lastName}`,
    address: userData.address,
    city: userData.city,
    state: userData.state,
    zipCode: userData.zipCode,
    phoneNumber: userData.phoneNumber,
    account: '222555',
    verifyAccount: '222555',
    amount: '50'
};
