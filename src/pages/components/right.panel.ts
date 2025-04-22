// import { Locator, Page } from '@playwright/test';
// import { RegisterForm } from '../register.page';
// import { AccountOverview } from '../accountOverview.page';
// import { UpdateInfoPage } from '../updateInfo.page';
// // import { OpenNewAccountForm } from '../components/openNewAccount';

// export class RightPanel {
//     // private _registerForm?: RegisterForm;
//     // private _accountOverview?: AccountOverview;
//     // private _updateInfoPage?: UpdateInfoPage;
//     // private _openNewAccountForm?: OpenNewAccountForm;

//     constructor(private page: Page) {}

//     // get registerForm(): RegisterForm {
//     //     if (!this._registerForm) {
//     //         this._registerForm = new RegisterForm(this.page);
//     //     }
//     //     return this._registerForm;
//     // }

//     // get accountOverview(): AccountOverview {
//     //     if (!this._accountOverview) {
//     //         this._accountOverview = new AccountOverview(this.page);
//     //     }
//     //     return this._accountOverview;
//     // }

//     // get updateInfoPage(): UpdateInfoPage {
//     //     if (!this._updateInfoPage) {
//     //         this._updateInfoPage = new UpdateInfoPage(this.page);
//     //     }
//     //     return this._updateInfoPage;
//     // }

//     // get openNewAccountForm(): OpenNewAccountForm {
//     //     if (!this._openNewAccountForm) {
//     //         this._openNewAccountForm = new OpenNewAccountForm(this.page);
//     //     }
//     //     return this._openNewAccountForm;
//     // }

//     // get container() {
//     //     return this.page.getByTestId('rightPanel');
//     // }

//     // get title(): Locator {
//     //     // Locate all <h1> elements inside the #rightPanel and filter for visible ones
//     //     return this.container
//     //         .locator('h1')
//     //         .filter({
//     //             hasNot: this.page.locator('[style*="display: none;"]')
//     //         })
//     //         .first();
//     // }

//     // get title() {
//     //     return this.container.locator('div:visible > h1');
//     // }

//     // get bodyMessage(): Locator {
//     //     // Locate all <h1> elements inside the #rightPanel and filter for visible ones
//     //     return this.container.locator('p').filter({
//     //         hasNot: this.page.locator('[style*="display: none;"]'),
//     //     }).first();
//     // }

//     async getVisibleContent(): Promise<{ title: string | null; messages: Locator }> {
//         // Locate the first visible <div> inside the container
//         const visibleDiv = this.container
//             .locator('div')
//             .filter({
//                 hasNot: this.page.locator('[style*="display: none;"]')
//             })
//             .first();

//         // console.log('Visible div:', await visibleDiv.innerText());

//         // Get the visible <h1> inside the visible <div>
//         const title = await visibleDiv.locator('h1').first().textContent();

//         // Get all <p> elements inside the same visible <div>
//         const messages = await visibleDiv.locator('div > p').first();

//         console.log('messages; ', await messages.innerText());
//         return {
//             title: title?.trim() || null,
//             messages: messages
//         };
//     }

//     get bodyMessage() {
//         return this.container.locator('div:visible > p');
//     }
// }
