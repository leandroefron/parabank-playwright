import { test as setup } from '../src/fixtures/custom.fixture';
import * as api from 'src/util/api';
import { INITIAL_BALANCE, MINIMUM_BALANCE } from 'src/constants';

setup('Setup db', async () => {
    await api.cleanDatabase();
    await api.initializeDatabase();
});

setup('Setting parameters', async () => {
        await api.setParameter('initialBalance', INITIAL_BALANCE);
        await api.setParameter('minimumBalance', MINIMUM_BALANCE);
});
