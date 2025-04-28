import { Page } from '@playwright/test';
import { AccountOverviewPage } from '../accountOverview.page';

export class Sidebar {
    constructor(private page: Page) {}

    // Common Locators
    private get container() {
        return this.page.getByTestId('leftPanel');
    }

    get welcomeMsg() {
        return this.page.locator('#leftPanel .smallText');
    }

    private get title() {
        return this.page.locator('#leftPanel h2');
    }

    // Login Form Locators
    get loginPanel() {
        return this.page.getByTestId('loginPanel');
    }

    private get usernameInput() {
        return this.page.locator('.login input[name="username"]');
    }

    private get passwordInput() {
        return this.page.locator('.login input[name="password"]');
    }

    private get logInBtn() {
        return this.page.locator('.login input[value="Log In"]');
    }

    private get registerLnk() {
        return this.page.getByLabel('Register');
    }

    // Sidebar Locators
    private get openNewAccountLnk() {
        return this.page.getByText('Open New Account');
    }

    private get accountsOverviewLnk() {
        return this.page.getByText('Accounts Overview');
    }

    private get transferFundsLnk() {
        return this.page.getByText('Transfer Funds');
    }

    private get updateUserInfoLnk() {
        return this.page.getByText('Update Contact Info');
    }

    private get logOutLnk() {
        return this.page.getByText('Log Out');
    }

    // Actions

    /**
     * Logs in a user using the provided credentials.
     *
     * @param username - The username of the user.
     * @param password - The password of the user.
     */
    async loginUser(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.logInBtn.click();
    }

    /**
     * Logs out the currently logged-in user.
     *
     * @throws Error if the user is not logged in.
     */
    async logOutUser() {
        const isLoggedIn: boolean = await this.welcomeMsg.isVisible();
        if (isLoggedIn) {
            await this.logOutLnk.click();
        } else {
            throw new Error('Customer is not logged in, cannot log out.');
        }
    }

    /**
     * Navigates to the Accounts Overview page.
     *
     * @returns An instance of the `AccountOverviewPage`.
     */
    async openAccountsOverview(): Promise<AccountOverviewPage> {
        await this.accountsOverviewLnk.click();
        return new AccountOverviewPage(this.page);
    }
}
