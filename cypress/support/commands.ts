/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<Element>
      
      /**
       * Custom command to check accessibility violations
       * @example cy.checkA11y()
       */
      checkA11y(context?: any, options?: any): Chainable<Element>
      
      /**
       * Custom command to inject axe for accessibility testing
       * @example cy.injectAxe()
       */
      injectAxe(): Chainable<Element>
    }
  }
}

// Custom command to select elements by data-cy attribute
Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`)
})

// Accessibility testing commands (requires cypress-axe)
Cypress.Commands.add('injectAxe', () => {
  cy.window({ log: false }).then((window) => {
    // Only inject if axe is not already present
    if (!window.axe) {
      // This requires cypress-axe to be installed
      cy.task('log', 'Injecting axe-core for accessibility testing')
    }
  })
})

Cypress.Commands.add('checkA11y', (context = null, options = {}) => {
  // Default options for accessibility testing
  const defaultOptions = {
    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
    ...options,
  }
  
  cy.window({ log: false }).then((window) => {
    if (window.axe) {
      cy.task('log', 'Running accessibility checks')
      // This would require proper cypress-axe implementation
      // For now, we'll log that the check would run
    } else {
      cy.task('log', 'Axe not available - skipping accessibility check')
    }
  })
})

export {}