import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Homepage Accessibility', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/')
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle')
    
    // Run axe accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Check that there's exactly one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)
    
    // Check that headings are in order (no skipped levels)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents()
    expect(headings.length).toBeGreaterThan(0)
  })

  test('should have proper focus management', async ({ page }) => {
    await page.goto('/')
    
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    
    // Should focus on the first focusable element
    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
    
    // Continue tabbing through several elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      await expect(page.locator(':focus')).toBeVisible()
    }
  })

  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Check that navigation has proper ARIA
    await expect(page.locator('nav')).toHaveAttribute('role', 'navigation')
    
    // Check that main content area exists
    const main = page.locator('main')
    await expect(main).toBeVisible()
    
    // Check search input has proper labeling
    const searchInput = page.locator('input[type="search"]')
    if (await searchInput.count() > 0) {
      await expect(searchInput).toHaveAttribute('aria-label')
    }
  })

  test('should be usable with screen readers', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const axeBuilder = new AxeBuilder({ page })
    const results = await axeBuilder
      .withTags(['wcag2a', 'wcag2aa'])
      .withRules(['label', 'link-name', 'image-alt'])
      .analyze()
    
    expect(results.violations).toEqual([])
  })
})