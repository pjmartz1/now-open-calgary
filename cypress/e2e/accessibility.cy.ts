describe('Accessibility Tests', () => {
  it('should not have any detectable accessibility violations on homepage', () => {
    cy.visit('/')
    cy.injectAxe()
    
    // Wait for page to fully load
    cy.get('[data-testid="business-grid"]', { timeout: 10000 }).should('be.visible')
    
    // Check for accessibility violations
    cy.checkA11y(null, {
      rules: {
        // Skip color-contrast rule for now as it can be flaky in CI
        'color-contrast': { enabled: false },
      },
    })
  })

  it('should be keyboard navigable', () => {
    cy.visit('/')
    
    // Test tab navigation through header
    cy.get('body').tab()
    cy.focused().should('have.attr', 'href')
    
    // Continue tabbing through navigation
    for (let i = 0; i < 5; i++) {
      cy.focused().tab()
    }
    
    // Should be able to activate links with Enter key
    cy.focused().then(($el) => {
      if ($el.attr('href')) {
        cy.wrap($el).type('{enter}')
      }
    })
  })

  it('should have proper ARIA labels', () => {
    cy.visit('/')
    
    // Check for essential ARIA attributes
    cy.get('[role="navigation"]').should('exist')
    cy.get('[role="main"]').should('exist')
    
    // Check for proper heading hierarchy
    cy.get('h1').should('have.length', 1)
    cy.get('h2').should('exist')
  })

  it('should have proper form labels', () => {
    cy.visit('/businesses')
    
    // Check search form accessibility
    cy.get('input[type="search"]').should('have.attr', 'aria-label')
    cy.get('select').each(($select) => {
      cy.wrap($select).should('have.attr', 'aria-label')
    })
  })

  it('should have sufficient color contrast', () => {
    cy.visit('/')
    cy.injectAxe()
    
    cy.checkA11y(null, {
      rules: {
        'color-contrast': { enabled: true },
      },
    })
  })

  it('should work with screen readers', () => {
    cy.visit('/')
    
    // Check for screen reader friendly content
    cy.get('[aria-label]').should('have.length.at.least', 1)
    cy.get('[aria-describedby]').should('exist')
    
    // Check for skip links
    cy.get('a[href="#main-content"]').should('exist')
  })
})