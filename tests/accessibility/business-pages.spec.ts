import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Business Pages Accessibility', () => {
  test('businesses page should not have accessibility violations', async ({ page }) => {
    await page.goto('/businesses')
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('restaurant category page should be accessible', async ({ page }) => {
    await page.goto('/restaurants')
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('search functionality should be accessible', async ({ page }) => {
    await page.goto('/businesses')
    await page.waitForLoadState('networkidle')
    
    // Check search form accessibility
    const searchForm = page.locator('form[role="search"]')
    if (await searchForm.count() > 0) {
      await expect(searchForm).toBeVisible()
      
      // Check that search input has proper labeling
      const searchInput = searchForm.locator('input[type="search"]')
      await expect(searchInput).toHaveAttribute('aria-label')
    }
    
    // Run accessibility scan
    const results = await new AxeBuilder({ page })
      .include('form[role="search"]')
      .analyze()
    
    expect(results.violations).toEqual([])
  })

  test('business grid should have proper ARIA structure', async ({ page }) => {
    await page.goto('/restaurants')
    await page.waitForLoadState('networkidle')
    
    // Wait for business grid to load
    const businessGrid = page.locator('[data-testid="business-grid"]')
    await expect(businessGrid).toBeVisible()
    
    // Check for proper list semantics
    const businessCards = page.locator('[data-testid="business-card"]')
    const cardCount = await businessCards.count()
    
    if (cardCount > 0) {
      // Check that business cards are properly labeled
      for (let i = 0; i < Math.min(cardCount, 5); i++) {
        const card = businessCards.nth(i)
        await expect(card).toHaveAttribute('aria-label')
      }
    }
  })

  test('filter controls should be keyboard accessible', async ({ page }) => {
    await page.goto('/businesses')
    await page.waitForLoadState('networkidle')
    
    // Find filter controls
    const categoryFilter = page.locator('select[aria-label*="category"]')
    const communityFilter = page.locator('select[aria-label*="community"]')
    
    if (await categoryFilter.count() > 0) {
      // Test keyboard navigation to filter
      await categoryFilter.focus()
      await expect(categoryFilter).toBeFocused()
      
      // Test that we can navigate with keyboard
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('ArrowUp')
    }
    
    if (await communityFilter.count() > 0) {
      await communityFilter.focus()
      await expect(communityFilter).toBeFocused()
    }
  })
})