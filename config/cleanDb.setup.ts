import { test as setup } from '../src/fixtures/custom.fixture';
import { cleanDatabase } from 'src/util/api';

setup('Cleaning db', async () => {
    await cleanDatabase();
});