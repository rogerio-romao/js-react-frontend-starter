import { expect, test } from '@playwright/test';

test('mainpage', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(
        page.getByRole('heading', { name: 'React App' })
    ).toBeVisible();
    await expect(page).toHaveTitle('JS Frontend Starter / React');
    await expect(page.getByRole('paragraph')).toHaveText('Count: 0');
    await page.getByRole('button', { name: 'Increment' }).click();
    await expect(page.getByRole('paragraph')).toHaveText('Count: 1');
    await page.getByRole('button', { name: 'Increment' }).click();
    await expect(page.getByRole('paragraph')).toHaveText('Count: 2');
});
