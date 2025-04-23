import { Page, Locator } from '@playwright/test';
import { Header } from './components/header';
import { Footer } from './components/footer';
import { Top } from './components/top';
import { Sidebar } from './components/sidebar';

export class BasePage {
    readonly page: Page;
    readonly header: Header;
    readonly footer: Footer;
    readonly top: Top;
    readonly sidebar: Sidebar;
    // private _header: Header;
    // private _footer: Footer;
    // private _top: Top;
    // private _sidebar: Sidebar;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.footer = new Footer(page);
        this.top = new Top(page);
        this.sidebar = new Sidebar(page);
    }

    // get header(): Header {
    //     if (!this._header) {
    //         this._header = new Header(this.page);
    //     }
    //     return this._header;
    // }

    // get footer(): Footer {
    //     if (!this._footer) {
    //         this._footer = new Footer(this.page);
    //     }
    //     return this._footer;
    // }

    // get top(): Top {
    //     if (!this._top) {
    //         this._top = new Top(this.page);
    //     }
    //     return this._top;
    // }

    // get sidebar(): Sidebar {
    //     if (!this._sidebar) {
    //         this._sidebar = new Sidebar(this.page);
    //     }
    //     return this._sidebar;
    // }

    get rightPanelContainer() {
        return this.page.getByTestId('rightPanel');
    }

    get title(): Locator {
        // Locate all <h1> elements inside the #rightPanel and filter for visible ones
        return this.rightPanelContainer
            .locator('h1')
            .filter({
                hasNot: this.page.locator('[style*="display: none;"]')
            })
            .first();
    }

    async goto(url: string = '/'): Promise<void> {
        await this.page.goto(url);
    }

    async getVisibleContent(): Promise<{ title: string | null; messages: Locator }> {
        // Locate the first visible <div> inside the container
        const visibleDiv = this.rightPanelContainer
            .locator('div')
            .filter({
                hasNot: this.page.locator('[style*="display: none;"]')
            })
            .first();

        // console.log('Visible div:', await visibleDiv.innerText());

        // Get the visible <h1> inside the visible <div>
        const title = await visibleDiv.locator('h1').first().textContent();

        // Get all <p> elements inside the same visible <div>
        const messages = await visibleDiv.locator('div > p').first();

        console.log('messages; ', await messages.innerText());
        return {
            title: title?.trim() || null,
            messages: messages
        };
    }

    get bodyMessage() {
        return this.rightPanelContainer.locator('p');
    }
}
