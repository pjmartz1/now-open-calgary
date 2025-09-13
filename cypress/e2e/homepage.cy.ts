describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the homepage successfully', () => {
    cy.contains('Now Open Calgary').should('be.visible')
    cy.get('h1').should('contain.text', 'Now Open Calgary')
  })

  it('should display the navigation header', () => {
    cy.get('header').should('be.visible')
    cy.get('nav').should('be.visible')
    
    // Check for navigation links
    cy.get('nav').should('contain.text', 'Restaurants')
    cy.get('nav').should('contain.text', 'Retail')
    cy.get('nav').should('contain.text', 'Services')
  })

  it('should display featured businesses', () => {
    cy.get('[data-testid="business-grid"]', { timeout: 10000 }).should('be.visible')
    
    // Wait for businesses to load
    cy.get('[data-testid="business-card"]').should('have.length.at.least', 1)
  })

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-6')
    
    // Check mobile navigation
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible')
    cy.get('[data-testid="mobile-menu-button"]').click()
    cy.get('[data-testid="mobile-menu"]').should('be.visible')
  })

  it('should have proper SEO meta tags', () => {
    cy.get('head title').should('contain', 'Now Open Calgary')
    cy.get('head meta[name="description"]').should('exist')
    cy.get('head meta[property="og:title"]').should('exist')
  })

  it('should allow searching for businesses', () => {
    cy.get('input[placeholder*="search"]', { timeout: 5000 }).should('be.visible')
    cy.get('input[placeholder*="search"]').type('restaurant')
    cy.get('button[type="submit"]').click()
    
    // Should navigate to businesses page with search results
    cy.url().should('include', '/businesses')
    cy.url().should('include', 'search=restaurant')
  })

  it('should navigate to category pages', () => {
    cy.get('a[href="/restaurants"]').click()
    cy.url().should('include', '/restaurants')
    cy.contains('Restaurants').should('be.visible')
  })
})