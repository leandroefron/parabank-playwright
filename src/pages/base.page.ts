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
        const result: Locator = await this.getResultLocator();

        if (result.locator(':scope > p')) {
            const title: string = await result.locator('h1').innerText();
            const body: string = await result.locator('p').first().innerText();
            const message = `${title} ${body}`;

            return message;
        }

        const title: string = (await result.locator('h1').textContent());

        return title;
    }

    // async getResult(): Promise<void> {
    //     const items = this.rightPanelContainer.locator(':scope > div > div');

    //     for (let i = 0; i < await items.count(); i++) {
    //         const item = items.nth(i);
    //         const style = await item.getAttribute('style');
    //         console.log(`Item #${i} has style: '${style}'`);

    //         if (style === '' || style === null) {
    //             console.log(`Item #${i} has an empty style`);
    //             console.log('Item content:', await item.locator('h1').innerText());
    //             // console.log('Item content:', await item.innerText());
    //         } else {
    //             console.log(`Item #${i} has style: '${style}'`);
    //         }
    //     }

    //     // const visibleDivs = this.rightPanelContainer.locator(':scope > div > div').filter({
    //     //     hasNot: this.page.locator('[style*="display:none"]') // Exclude elements with "display:none"
    //     // });

    //     // console.log('Visible divs:', await visibleDivs.allInnerTexts());

    //     // const visibleDiv = items.filter({
    //     //     has: this.page.locator('[style=""]')
    //     // });

    //     // const emptyStyleDivs = this.rightPanelContainer.locator(':scope > div > div').filter({
    //     //     has: this.page.locator('[style=""]')
    //     // });

    //     // console.log('Empty style divs:', await emptyStyleDivs.allInnerTexts());

    //     // console.log('Visible div:', await visibleDiv.allInnerTexts());

    //     //         const divs2 = await this.rightPanelContainer.locator(':scope > div > div'); // Select direct div children

    //     // const count2 = await divs2.count();
    //     // const eleg = await divs2.evaluateAll(divs => divs.filter(div => div.getAttribute('style') === ''));
    //     // console.log('Eleg:', await eleg.allInnerTexts());
    //     // console.log('Count2:', count2);
    //     // console.log('Divs2:', await divs2.allInnerTexts());
    //     // // const emptyStyleDivs = this.rightPanelContainer.locator(':scope > div > div').filter({
    //     // //     predicate: async (el) => {
    //     // //       const style = await el.getAttribute('style');
    //     // //       return style === '';
    //     // //     }
    //     // //   });

    //     // const emptyDivHandles = await this.rightPanelContainer.locator(':scope > div > div').evaluateAll(divs =>
    //     //     divs.filter(div => div.getAttribute('style') === '')
    //     //   );

    //     //   console.log(`Found ${emptyDivHandles.length} div(s) with empty style.`);

    //     //   console.log('Empty divs:', emptyDivHandles);

    //     // const divs = await this.rightPanelContainer.locator(':scope > div');
    //     // const count = await divs.count();

    //     // for (let i = 0; i < count; i++) {
    //     // const div = divs.nth(i);
    //     // const style = await div.getAttribute('style');

    //     // if (style === '' || style === null) {
    //     //     console.log(`Div #${i} has an empty style`);
    //     //     console.log('Div content:', await div.innerText());
    //     // } else {
    //     //     console.log(`Div #${i} has style: '${style}'`);

    //     // }
    //     // }

    //     // console.log('Visible div:', await items.count());
    //     // console.log(await visibleDiv.innerText())

    //     // // Wait for the element to be visible
    //     // await visibleDiv.waitFor({ state: 'visible' });

    //     // // Get the inner text of the visible <div>
    //     // const title: string = (await visibleDiv.locator('h1').innerText()).trim();
    //     // const message: string = await visibleDiv.locator('p').first().innerText();
    //     // // console.log('title:', title);
    //     // // console.log('message:', message);

    //     // return [title, message];
    // }
}
