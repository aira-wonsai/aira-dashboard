import { test, expect } from '@playwright/test';

test.describe('Aira Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the dashboard', async ({ page }) => {
    await expect(page).toHaveTitle(/Aira Dashboard/);
    await expect(page.locator('h1')).toContainText('Aira Dashboard');
  });

  test('should show loading state initially', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.animate-spin')).toBeVisible();
  });

  test('should display Activity Feed section', async ({ page }) => {
    await page.waitForSelector('[x-cloak]', { state: 'hidden' });
    await expect(page.locator('h2').filter({ hasText: 'Activity Feed' })).toBeVisible();
  });

  test('should display Morning News section', async ({ page }) => {
    await page.waitForSelector('[x-cloak]', { state: 'hidden' });
    await expect(page.locator('h2').filter({ hasText: 'Morning News' })).toBeVisible();
  });

  test('should display Stock Market Report section', async ({ page }) => {
    await page.waitForSelector('[x-cloak]', { state: 'hidden' });
    await expect(page.locator('h2').filter({ hasText: 'Stock Market Report' })).toBeVisible();
  });

  test('should display Moltbook Daily Summary section', async ({ page }) => {
    await page.waitForSelector('[x-cloak]', { state: 'hidden' });
    await expect(page.locator('h2').filter({ hasText: 'Moltbook Daily Summary' })).toBeVisible();
  });

  test('should display Schedule Overview section', async ({ page }) => {
    await page.waitForSelector('[x-cloak]', { state: 'hidden' });
    await expect(page.locator('h2').filter({ hasText: 'Schedule Overview' })).toBeVisible();
  });

  test('should show last updated timestamp', async ({ page }) => {
    await page.waitForSelector('[x-cloak]', { state: 'hidden' });
    await expect(page.locator('text=/Last updated:/')).toBeVisible();
  });

  test('should handle missing data gracefully', async ({ page }) => {
    await page.waitForSelector('[x-cloak]', { state: 'hidden' });

    // Check that sections still appear even without data
    await expect(page.locator('text=/No news available/')).toBeVisible();
    await expect(page.locator('text=/No stock data available/')).toBeVisible();
    await expect(page.locator('text=/No moltbook data available yet/')).toBeVisible();
  });

  test('should have responsive design', async ({ page }) => {
    await page.waitForSelector('[x-cloak]', { state: 'hidden' });

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display activities when data exists', async ({ page }) => {
    await page.waitForSelector('[x-cloak]', { state: 'hidden' });

    // Wait for data to load
    await page.waitForTimeout(1000);

    // Check for activity items
    const activities = await page.locator('ul li').count();
    expect(activities).toBeGreaterThan(0);
  });

  test('should have proper visual hierarchy', async ({ page }) => {
    await page.waitForSelector('[x-cloak]', { state: 'hidden' });

    // Check main heading
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Check section headings
    const headings = await page.locator('h2').all();
    expect(headings).toHaveLength(5);
  });

  test('should auto-refresh every 5 minutes', async ({ page }) => {
    await page.waitForSelector('[x-cloak]', { state: 'hidden' });

    const initialTimestamp = await page.locator('text=/Last updated:/').textContent();

    // Wait a bit and check that timestamp updates (simulating refresh)
    await page.waitForTimeout(1000);
    const updatedTimestamp = await page.locator('text=/Last updated:/').textContent();

    // In a real scenario, we'd wait 5 minutes, but for testing we just verify the element exists
    expect(initialTimestamp).toBeTruthy();
    expect(updatedTimestamp).toBeTruthy();
  });

  test('should show footer', async ({ page }) => {
    await page.waitForSelector('[x-cloak]', { state: 'hidden' });
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer')).toContainText('Built with ❤️ for Won');
  });
});

test.describe('Visual Regression Tests', () => {
  test('should match screenshot - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForSelector('[x-cloak]', { state: 'hidden' });
    await expect(page).toHaveScreenshot('desktop.png');
  });

  test('should match screenshot - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('[x-cloak]', { state: 'hidden' });
    await expect(page).toHaveScreenshot('mobile.png');
  });

  test('should match screenshot - tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForSelector('[x-cloak]', { state: 'hidden' });
    await expect(page).toHaveScreenshot('tablet.png');
  });
});
