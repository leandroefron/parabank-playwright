import { Page } from '@playwright/test';
import { AccountOverviewPage } from '../accountOverview.page';

export class Sidebar {
    constructor(private page: Page) {}

    // Common
    get container() {
        return this.page.getByTestId('leftPanel');
    }

    get welcomeMsg() {
        return this.page.locator('#leftPanel .smallText');
    }

    get title() {
        return this.page.locator('#leftPanel h2');
    }

    // Login Form
    get loginPanel() {
        return this.page.getByTestId('loginPanel');
    }

    get usernameInput() {
        return this.page.locator('.login input[name="username"]');
    }

    get passwordInput() {
        return this.page.locator('.login input[name="password"]');
    }

    get logInBtn() {
        return this.page.locator('.login input[value="Log In"]');
    }

    get registerLnk() {
        return this.page.getByLabel('Register');
    }

    // Sidebar
    get openNewAccountLnk() {
        return this.page.getByText('Open New Account');
    }

    get accountsOverviewLnk() {
        return this.page.getByText('Accounts Overview');
    }

    get transferFundsLnk() {
        return this.page.getByText('Transfer Funds');
    }

    get updateUserInfoLnk() {
        return this.page.getByText('Update Contact Info');
    }

    get logOutLnk() {
        return this.page.getByText('Log Out');
    }

    async loginUser(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.logInBtn.click();

        await this.welcomeMsg.waitFor({ state: 'visible' });
    }

    async logOutUser() {
        const isLoggedIn: boolean = await this.welcomeMsg.isVisible();
        if (isLoggedIn) {
            await this.logOutLnk.click();
        } else {
            throw new Error('Customer is not logged in, cannot log out.');
        }
    }

    async openAccountsOverview(): Promise<AccountOverviewPage> {
        await this.accountsOverviewLnk.click();

        return new AccountOverviewPage(this.page);
    }
}
