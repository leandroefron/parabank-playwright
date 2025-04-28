import { Page, Locator } from '@playwright/test';
import { Sidebar } from './components/sidebar';

export class BasePage {
    readonly page: Page;
    readonly sidebar: Sidebar;

    constructor(page: Page) {
        this.page = page;
        this.sidebar = new Sidebar(page);
    }

    // Locators
    get rightPanelContainer() {
        return this.page.getByTestId('rightPanel');
    }

    get title() {
        return this.rightPanelContainer.locator('.title').first();
    }

    // Actions
    async goto(url: string = '/parabank'): Promise<void> {
        await this.page.goto(url);
    }

    /**
     * Retrieves the first visible result locator from the right panel container.
     *
     * @returns The first visible `Locator` element.
     */
    async getResultLocator(): Promise<Locator | null> {
        const items = this.rightPanelContainer.locator(':scope > div > div');
        const elementName: string = await items.nth(0).getAttribute('id');

        if (elementName !== 'showOverview') {
            await this.page.getByTestId(elementName).waitFor({ state: 'hidden', timeout: 5000 });
        }

        for (let i: number = 0; i < (await items.count()); i++) {
            const item: Locator = items.nth(i);
            const style: string = await item.getAttribute('style');

            if (!style) {
                return item;
            }
        }

        return null;
    }

    /**
     * Retrieves the result text from the right panel container.
     *
     * @returns The result text, including the title and body if available.
     */
    async getResultText(): Promise<string> {
        const result: Locator = await this.getResultLocator();

        if (!result) {
            throw new Error('No visible result locator found.');
        }

        if ((await result.locator(':scope > p').count()) > 0) {
            const title: string = (await result.locator('h1').textContent())?.trim() || ' ';
            const body: string = (await result.locator('p').first().textContent())?.trim() || ' ';
            const message = `${title} ${body}`;

            return message;
        }

        const title: string = await result.locator('h1').textContent();

        return title.trim();
    }
}
