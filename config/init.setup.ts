import { test as setup } from '../src/fixtures/custom.fixture';
import * as api from 'src/util/api';
import { INITIAL_BALANCE, MINIMUM_BALANCE } from 'src/constants';

async function setAppParameters() {
    const parameters: { key: string; value: string }[] = [
        { key: 'initialBalance', value: INITIAL_BALANCE },
        { key: 'minimumBalance', value: MINIMUM_BALANCE }
    ];

    for (const param of parameters) {
        await api.setParameter(param.key, param.value);
    }
}

setup('Setup database', async () => {
    try {
        await api.cleanDatabase();
        await api.initializeDatabase();
    } catch (error) {
        console.error('Error during database setup:', error);
        throw error;
    }
});

setup('Set application parameters', async () => {
    try {
        await setAppParameters();
    } catch (error) {
        console.error('Error while setting application parameters:', error);
        throw error;
    }
});
