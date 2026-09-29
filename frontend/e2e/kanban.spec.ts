import { test, expect } from '@playwright/test';

test.describe('Kanban Project Manager E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the page with 5 default columns and initial dummy cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Kanban Project Manager' })).toBeVisible();

    const expectedColumns = ['Backlog', 'Ready', 'In Progress', 'Review', 'Done'];
    for (const title of expectedColumns) {
      await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    }

    await expect(page.getByText('Audit third-party dependencies')).toBeVisible();
    await expect(page.getByText('Design token standardization')).toBeVisible();
    await expect(page.getByText('Next.js project setup')).toBeVisible();
  });

  test('should rename a column inline', async ({ page }) => {
    const backlogCol = page.locator('[data-testid="column-col-backlog"]');
    const renameButton = backlogCol.getByRole('button', { name: /Rename column Backlog/i });
    await renameButton.click();

    const titleInput = backlogCol.getByRole('textbox', { name: 'Edit column title' });
    await expect(titleInput).toBeVisible();

    await titleInput.fill('Sprint Goals');
    await titleInput.press('Enter');

    await expect(backlogCol.getByRole('heading', { name: 'Sprint Goals' })).toBeVisible();
  });

  test('should add a new card to a specific column', async ({ page }) => {
    const readyCol = page.locator('[data-testid="column-col-ready"]');
    const addCardTrigger = readyCol.getByRole('button', { name: /Add card to Ready/i });
    await addCardTrigger.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(modal.getByRole('heading', { name: 'Add New Card' })).toBeVisible();

    const titleInput = modal.getByLabel(/Card Title/i);
    const detailsInput = modal.getByLabel(/Details/i);

    await titleInput.fill('Automated E2E Feature');
    await detailsInput.fill('Verified seamlessly via Playwright suite');

    const submitBtn = modal.getByRole('button', { name: /Add Card/i });
    await submitBtn.click();

    await expect(modal).not.toBeVisible();
    await expect(readyCol.getByText('Automated E2E Feature')).toBeVisible();
    await expect(readyCol.getByText('Verified seamlessly via Playwright suite')).toBeVisible();
  });

  test('should delete an existing card', async ({ page }) => {
    const backlogCol = page.locator('[data-testid="column-col-backlog"]');
    await expect(backlogCol.getByText('Audit third-party dependencies')).toBeVisible();

    const deleteBtn = backlogCol.getByRole('button', {
      name: 'Delete card: Audit third-party dependencies',
    });
    await deleteBtn.click();

    await expect(backlogCol.getByText('Audit third-party dependencies')).not.toBeVisible();
  });

  test('should perform card drag and drop between columns', async ({ page }) => {
    const sourceCard = page.locator('[data-testid="card-card-1"]');
    const targetColumn = page.locator('[data-testid="column-col-ready"]');

    await expect(sourceCard).toBeVisible();
    await expect(targetColumn).toBeVisible();

    const dragHandle = sourceCard.getByLabel('Drag card handle');
    await dragHandle.focus();
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Space');

    // Verify card is now within the ready column
    await expect(targetColumn.locator('[data-testid="card-card-1"]')).toBeVisible();
  });
});
