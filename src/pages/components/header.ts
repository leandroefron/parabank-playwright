import { Page } from '@playwright/test';

export class Header {
    constructor(private page: Page) {}

    get adminPageLnk() {
        return this.page.getByText('Admin Page');
    }
}
