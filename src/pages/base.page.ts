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

    async getResult2() {
        const sel = (await this.rightPanelContainer.locator('div').locator('div[style=""]').first().innerText()).trim();

        console.log('Sel:', sel);
    }

    async getResult(): Promise<string[]> {
        const items = this.rightPanelContainer.locator('div div');
        const visibleDiv = items.filter({
            has: this.page.locator('[style=""]')
        });

        // Wait for the element to be visible
        await visibleDiv.waitFor({ state: 'visible' });

        // Get the inner text of the visible <div>
        const title: string = (await visibleDiv.locator('h1').innerText()).trim();
        const message: string = await visibleDiv.locator('p').first().innerText();
        // console.log('title:', title);
        // console.log('message:', message);

        return [title, message];
    }

    async getVisibleContent(): Promise<{ title: string | null; messages: Locator }> {
        // Locate the first visible <div> inside the container+
        this.page.pause();
        const visibleDiv = this.rightPanelContainer
            .locator('div div')
            .filter({
                hasNot: this.page.locator('[style*="display: none;"]')
            })
            .first();

        // console.log('Visible div:', await visibleDiv.innerText());

        // Get the visible <h1> inside the visible <div>
        const title = await visibleDiv.locator('h1').first().textContent();

        // Get all <p> elements inside the same visible <div>
        const messages = await visibleDiv.locator('div > p').first();

        // console.log('messages; ', await messages.innerText());
        console.log('title; ', title);
        return {
            title: title?.trim() || null,
            messages: messages
        };
    }

    get bodyMessage() {
        return this.rightPanelContainer.locator('p');
    }

    async getDisplayedContent() {
        const rightPanelSelector = '#rightPanel';
        await this.page.pause();
        // Evaluate the DOM to find the visible content dynamically
        const content = await this.page.$eval(rightPanelSelector, rightPanel => {
            const visibleDiv = Array.from(rightPanel.children).find(child => {
                const style = window.getComputedStyle(child);
                return style.display !== 'none';
            });

            if (!visibleDiv) {
                return null;
            }

            // Extract h1 and p elements from the visible div
            const h1 = visibleDiv.querySelector('h1')?.textContent?.trim() || null;
            const paragraphs = Array.from(visibleDiv.querySelectorAll('p')).map(p => p.textContent?.trim());

            console.log('h1:', h1);
            // console.log('paragraphs:', paragraphs);

            return {
                h1,
                paragraphs
            };
        });

        if (!content) {
            console.error('No visible content found in #rightPanel');
            return null;
        }

        return content;
    }
}
