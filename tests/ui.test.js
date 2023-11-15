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
    const registerButton = await page.$('a[href="/register"]');
    const isRegisterButton = await registerButton.isVisible();
    expect(isRegisterButton).toBe(true);
});