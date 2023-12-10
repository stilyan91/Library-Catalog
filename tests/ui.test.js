const { expect, test } = require("@playwright/test");
const pageUrl = "http://localhost:3001"

test('Verify All Books link is visible', async ({ page }) => {
    await page.goto(pageUrl);
    await page.waitForSelector("#site-header > nav");
    const allBooksLink = await page.$('a[href="/catalog"]');
    const isAllBooksLinkVisible = await allBooksLink.isVisible();
    expect(isAllBooksLinkVisible).toBe(true);
});

test('Verify Login button is visible', async ({ page }) => {
    await page.goto(pageUrl);
    await page.waitForSelector("#site-header > nav");
    const loginButton = await page.$('#guest > a:nth-child(1)');
    const isLoginButton = await loginButton.isVisible();
    expect(isLoginButton).toBe(true);
});


test('Verify Register button is visible', async ({ page }) => {
    await page.goto(pageUrl);
    await page.waitForSelector("#site-header > nav");
    // const registerButton = await page.$('a[href="/register"]');
    const registerButton = await page.locator('xpath=/html/body/div/header/nav/section/div[1]/a[2]');
    const isRegisterButton = await registerButton.isVisible();
    expect(isRegisterButton).toBe(true);
});

test('Verify All Books is visible after login', async ({ page }) => {
    await page.goto(`${pageUrl}/login`);
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');

    const allBooksLink = await page.$('a[href="/catalog"]');
    const isAllBooksLinkVisible = await allBooksLink.isVisible();
    expect(isAllBooksLinkVisible).toBe(true);
});


test('Verify Email Is Visible', async ({ page }) => {
    await page.goto(`${pageUrl}/login`);
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');

    const email = await page.$('#user > span');
    const isEmailVisible = await email.isVisible();
    expect(isEmailVisible).toBe(true);
});

test('Verify Submit the Form with Valid Credentials', async ({ page }) => {
    await page.goto(`${pageUrl}/login`);
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');

    await page.$('a[href="/catalog"]');
    expect(page.url()).toBe('http://localhost:3001/catalog');
});

test('Submit the Form with Empty Input Fields', async ({ page }) => {
    await page.goto(`${pageUrl}/login`);
    await page.click('input[type="submit"]');
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required');
        await dialog.accept();
    });
    await page.$('a[href="/login"]');
    expect(page.url()).toBe('http://localhost:3001/login');
});

test('Submit the Form with Empty Email Input Field', async ({ page }) => {
    await page.goto(`${pageUrl}/login`);
    await page.fill('input[name="password"]', "123456")
    await page.click('input[type="submit"]');
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required');
        await dialog.accept();
    });
    await page.$('a[href="/login"]');
    expect(page.url()).toBe('http://localhost:3001/login');
});

test('Submit the Form with Empty Password Input Field', async ({ page }) => {
    await page.goto(`${pageUrl}/login`);
    await page.fill('input[name="email"]', "peter@abv.bg")
    await page.click('input[type="submit"]');
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required');
        await dialog.accept();
    });
    await page.$('a[href="/login"]');
    expect(page.url()).toBe('http://localhost:3001/login');
});

test('Add book with correct data', async ({ page }) => {
    await page.goto(`${pageUrl}/login`);
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');

    await Promise.all([
        await page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3001/catalog'),

    ]);
    await page.click('a[href="/create"]');
    await page.waitForSelector('#create-form');

    await page.fill('#title', 'Test Book');
    await page.fill('#description', 'This is a test book description');
    await page.fill('#image', 'https://example.com/book-image.jpg');
    await page.selectOption('#type', 'Fiction');
    await page.click('#create-form > fieldset > input[type="submit"]');

    await page.waitForURL('http://localhost:3001/catalog');
    expect(page.url()).toBe('http://localhost:3001/catalog');
});


test('Submit the Form with Empty Title Field', async ({ page }) => {
    await page.goto(`${pageUrl}/login`);
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');

    await Promise.all([
        await page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3001/catalog'),

    ]);
    await page.click('a[href="/create"]');
    await page.waitForSelector('#create-form');

    await page.fill('#description', 'This is a test book description');
    await page.fill('#image', 'https://example.com/book-image.jpg');
    await page.selectOption('#type', 'Fiction');
    await page.click('#create-form > fieldset > input[type="submit"]');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required');
        await dialog.accept();
    });

    await page.waitForURL('http://localhost:3001/create');
    expect(page.url()).toBe('http://localhost:3001/create');
});


test('Submit the Form with Empty Description Field', async ({ page }) => {
    await page.goto(`${pageUrl}/login`);
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');

    await Promise.all([
        await page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3001/catalog'),

    ]);
    await page.click('a[href="/create"]');
    await page.waitForSelector('#create-form');

    await page.fill('#title', 'Test Book');
    await page.fill('#image', 'https://example.com/book-image.jpg');
    await page.selectOption('#type', 'Fiction');
    await page.click('#create-form > fieldset > input[type="submit"]');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required');
        await dialog.accept();
    });

    await page.waitForURL('http://localhost:3001/create');
    expect(page.url()).toBe('http://localhost:3001/create');
});



test('Submit the Form with Empty Image URL Field', async ({ page }) => {
    await page.goto(`${pageUrl}/login`);
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');

    await Promise.all([
        await page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3001/catalog'),

    ]);
    await page.click('a[href="/create"]');
    await page.waitForSelector('#create-form');

    await page.fill('#title', 'Test Book');
    await page.fill('#description', 'This is a test book description');
    await page.selectOption('#type', 'Fiction');
    await page.click('#create-form > fieldset > input[type="submit"]');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required');
        await dialog.accept();
    });

    await page.waitForURL('http://localhost:3001/create');
    expect(page.url()).toBe('http://localhost:3001/create');
});



test('Verify That All Books Are Displayed', async ({ page }) => {
    await page.goto(`${pageUrl}/login`);
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await Promise.all([
        await page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3001/catalog'),

    ]);

    await page.waitForSelector('.dashboard');
    const bookElements = await page.$$('.other-books-list li');
    expect(bookElements.length).toBeGreaterThan(0);
});

// test('Verify That No Books Are Displayed', async ({ page }) => {
//     await page.goto(`${pageUrl}/login`);
//     await page.fill('input[name="email"]', 'peter@abv.bg');
//     await page.fill('input[name="password"]', '123456');
//     await Promise.all([
//         await page.click('input[type="submit"]'),
//         page.waitForURL('http://localhost:3001/catalog'),

//     ]);

//     await page.waitForSelector('.dashboard');
//     const noBooksMessage = await page.toContain('.no-books');
//     expect(noBooksMessage).toBe('No books in database!');
// });


test('Verify That Logged-In User Sees Details Button and Button Works Correctly', async ({ page }) => {
    await page.goto(`${pageUrl}/login`);
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await Promise.all([
        await page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3001/catalog'),

    ]);

    await page.click('a[href="/catalog"]');
    await page.waitForSelector('.otherBooks');
    await page.click('.otherBooks a.button');
    await page.waitForSelector('.book-information');

    const detailsPageTitle = await page.textContent('.book-information h3');
    expect(detailsPageTitle).toBe('Test Book');
});

test('Verify That Guest User Sees Details Button and Button Works Correctly', async ({ page }) => {
    await page.goto(`${pageUrl}`);
    await page.click('a[href="/catalog"]');
    await page.waitForSelector('.otherBooks');


    const detailsButton = await page.$('#dashboard-page > ul > li:nth-child(1) > a');
    expect(detailsButton).toBeTruthy();
});

test('Verify That All Info Is Displayed Correctly', async ({ page }) => {
    await page.goto(`${pageUrl}/login`);
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await Promise.all([
        await page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3001/catalog'),

    ]);

    await page.click('a[href="/catalog"]');
    await page.waitForSelector('.otherBooks');
    await page.click('.otherBooks a.button');
    await page.waitForSelector('.book-information');

    const bookTitle = await page.textContent('#details-page > div.book-information > h3');
    const bookDescription = await page.textContent('#details-page > div.book-description > p');
    const bookType = await page.textContent('#details-page > div.book-information > p.type')

    expect(bookTitle).toContain('Test Book');
    expect(bookDescription).toContain('This is a test book description');
    expect(bookType).toContain('Type: Fiction');

});

test('Verify If Edit and Delete Buttons Are Visible for Creator', async ({ page }) => {
    await page.goto(`${pageUrl}/login`);
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await Promise.all([
        await page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3001/catalog'),

    ]);

    await page.click('a[href="/catalog"]');
    await page.waitForSelector('.otherBooks');
    await page.click('.otherBooks a.button');
    await page.waitForSelector('.book-information');
    const editButton = await page.$('#details-page > div.book-information > div > a:nth-child(1)');
    const deleteButton = await page.$('#details-page > div.book-information > div > a:nth-child(2)');
    expect(deleteButton).toBeTruthy();
    expect(editButton).toBeTruthy();
});

test('Verify If Edit and Delete Buttons Are Not Visible for Non-Creator', async ({ page }) => {
    await page.goto(`${pageUrl}/login`);
    await page.fill('input[name="email"]', 'john@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await Promise.all([
        await page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3001/catalog'),

    ]);

    await page.click('a[href="/catalog"]');
    await page.waitForSelector('.otherBooks');
    await page.click('.otherBooks a.button');
    await page.waitForSelector('.book-information');

    const editButton = await page.$$("text='Edit'");
    const deleteButton = await page.$$("text='Delete'");
    expect(editButton.length).toBe(0);
    expect(deleteButton.length).toBe(0);
});

test('Verify If Like Button Is Not Visible for Creator', async ({ page }) => {
    await page.goto(`${pageUrl}/login`);
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await Promise.all([
        await page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3001/catalog'),

    ]);

    await page.click('a[href="/catalog"]');
    await page.waitForSelector('.otherBooks');
    await page.click('.otherBooks a.button');
    await page.waitForSelector('#details-page > div.book-information');
    const likeButton = await page.$('#details-page > div.book-information > div > a');
    const isLikeVisible = await likeButton.textContent('Like');
    expect(isLikeVisible.includes('Like')).toBe(false);

});
test('Verify If Like Button Is Visible for Non-Creator', async ({ page }) => {
    await page.goto(`${pageUrl}/login`);
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await Promise.all([
        await page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3001/catalog'),

    ]);

    await page.click('a[href="/catalog"]');
    await page.waitForSelector('.otherBooks');
    await page.click('.otherBooks a.button');
    await page.waitForSelector('#details-page > div.book-information');
    const likeButton = await page.$('#details-page > div.book-information > div > a');
    const isVisibleLikeButton = await likeButton.isVisible();
    expect(isVisibleLikeButton).toBe(true);

});

test('Verify That the "Logout" Button Is Visible', async ({ page }) => {
    await page.goto(`${pageUrl}/login`);
    await page.fill('input[name="email"]', 'john@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await Promise.all([
        await page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3001/catalog'),

    ]);
    await page.waitForSelector('#logoutBtn')
    const logoutButton = await page.$('a[href="javascript:void(0)"]');
    const isLogoutButtonVisible = await logoutButton.isVisible();
    expect(isLogoutButtonVisible).toBe(true);
});
test('Verify That the "Logout" Button Redirects Correctly', async ({ page }) => {
    await page.goto(`${pageUrl}/login`);
    await page.fill('input[name="email"]', 'john@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');

    const logoutLink = await page.$('a[href="javascript:void(0)"]');
    await logoutLink.click();

    await page.waitForURL('http://localhost:3001/');

    const redirectURL = page.url();
    expect(redirectURL).toBe('http://localhost:3001/');
});