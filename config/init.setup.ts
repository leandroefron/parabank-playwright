import { test as setup } from '@/fixtures/custom.fixture';
import * as api from 'src/util/api';
import { INITIAL_BALANCE, MINIMUM_BALANCE } from '@/constants';

setup('Init setup', async () => {
    try {
        await api.cleanDatabase();
        await api.initializeDatabase();
        await setAppParameters();
    } catch (error) {
        console.error('Error during init setup:', error);
        throw error;
    }
});

async function setAppParameters() {
    const parameters: { key: string; value: string }[] = [
        { key: 'initialBalance', value: INITIAL_BALANCE.toString() },
        { key: 'minimumBalance', value: MINIMUM_BALANCE.toString() }
    ];

    for (const param of parameters) {
        await api.setParameter(param.key, param.value);
    }
}
