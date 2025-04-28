import { Page, Locator } from '@playwright/test';
import { Sidebar } from './components/sidebar';

export class BasePage {
    readonly page: Page;
    readonly sidebar: Sidebar;

    constructor(page: Page) {
        this.page = page;
        this.sidebar = new Sidebar(page);
    }

    get rightPanelContainer() {
        return this.page.getByTestId('rightPanel');
    }

    // get title(): Locator {
    //     // Locate all <h1> elements inside the #rightPanel and filter for visible ones
    //     return this.rightPanelContainer
    //         .locator('div').locator('div')
    //         .filter({
    //             hasNot: this.page.locator('[style*="display: none;"]')
    //         })
    //         .first();
    // }

    get title(): Locator {
        // Locate all <div> elements inside the #rightPanel and filter for those without "display: none;"
        return this.rightPanelContainer
            .locator('div div') // Select nested <div> elements
            .filter({
                hasNot: this.page.locator('[style*="display: none;"]') // Exclude elements with "display: none;"
            })
            .first(); // Get the first matching visible <div>
    }

    async goto(url: string = '/parabank'): Promise<void> {
        await this.page.goto(url);
    }

    async getResultLocator(): Promise<Locator> {
        const items = this.rightPanelContainer.locator(':scope > div > div');

        for (let i: number = 0; i < (await items.count()); i++) {
            const item: Locator = items.nth(i);
            const style: string = await item.getAttribute('style');

            if (style === '' || style === null) {
                return item;
            }
        }
    }

    async getResultText(): Promise<string> {
        await this.page.waitForTimeout(1500);

        const result: Locator = await this.getResultLocator();

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
