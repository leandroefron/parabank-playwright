import { test as base } from '@playwright/test';

import { BasePage } from 'src/pages/base.page';
import { HomePage } from 'src/pages/home.page';
import { RegisterPage } from 'src/pages/register.page';
import { OpenNewAccountPage } from 'src/pages/openNewAccount.page';
import { AccountOverviewPage } from 'src/pages/accountOverview.page';
import { TransferFundsPage } from 'src/pages/transferFunds.page';
import { BillPayPage } from 'src/pages/billPay.page';
import { UpdateInfoPage } from 'src/pages/updateInfo.page';
import { RequestLoanPage } from 'src/pages/requestLoan.page';

type PageObjects = {
    basePage: BasePage;
    homePage: HomePage;
    registerPage: RegisterPage;
    openNewAccountPage: OpenNewAccountPage;
    accountOverviewPage: AccountOverviewPage;
    transferFundsPage: TransferFundsPage;
    billPayPage: BillPayPage;
    updateInfoPage: UpdateInfoPage;
    requestLoanPage: RequestLoanPage;
};

export const test = base.extend<PageObjects>({
    basePage: async ({ page }, use) => {
        const basePage = new BasePage(page);
        await basePage.goto();
        await basePage.sidebar.loginPanel.waitFor({ state: 'visible' });
        await use(basePage);
    },

    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    registerPage: async ({ page }, use) => {
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        await registerPage.customerForm.waitFor({ state: 'visible' });
        await use(registerPage);
    },

    openNewAccountPage: async ({ page }, use) => {
        const openNewAccountPage = new OpenNewAccountPage(page);
        await openNewAccountPage.goto();

        await openNewAccountPage.openAccountBtn.waitFor({ state: 'visible', timeout: 5000 });
        if (!(await openNewAccountPage.openAccountBtn.isEnabled())) {
            throw new Error('Open Account button is not enabled.');
        }

        await use(openNewAccountPage);
    },

    accountOverviewPage: async ({ page }, use) => {
        // const accountOverviewPage = new AccountOverviewPage(page);
        // await accountOverviewPage.goto();
        // await accountOverviewPage.overview.waitFor({ state: 'visible' });
        // await use(accountOverviewPage);
        await use(new AccountOverviewPage(page));
    },

    transferFundsPage: async ({ page }, use) => {
        const transferFundsPage = new TransferFundsPage(page);
        await transferFundsPage.goto();
        await transferFundsPage.transferForm.waitFor({ state: 'visible' });
        await use(transferFundsPage);
    },

    billPayPage: async ({ page }, use) => {
        const billPayPage = new BillPayPage(page);
        await billPayPage.goto();
        await billPayPage.billPayForm.waitFor({ state: 'visible' });
        await use(billPayPage);
    },

    updateInfoPage: async ({ page }, use) => {
        const updateInfoPage = new UpdateInfoPage(page);
        await updateInfoPage.goto();
        await updateInfoPage.updateProfileForm.waitFor({ state: 'visible' });
        await use(updateInfoPage);
    },

    requestLoanPage: async ({ page }, use) => {
        const requestLoanPage = new RequestLoanPage(page);
        await requestLoanPage.goto();
        await requestLoanPage.requestLoanForm.waitFor({ state: 'visible' });
        await use(requestLoanPage);
    }
});

export { expect, Page, Locator } from '@playwright/test';
