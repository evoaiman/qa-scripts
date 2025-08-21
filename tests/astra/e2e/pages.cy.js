describe('Page Loading Tests', () => {
  const pages = [
    { url: '/', name: 'Homepage' },
    { url: '/about', name: 'About' },
    { url: '/contact', name: 'Contact' },
    { url: '/sponsorship', name: 'Sponsorship' },
    { url: '/privacy-policy', name: 'Privacy Policy' },
    { url: '/product-warranty', name: 'Product Warranty' }
  ]

  pages.forEach(page => {
    it(`should load ${page.name} without errors`, () => {
      // Visit the page
      cy.visit(page.url)
      
      // Check page loaded successfully
      cy.get('body').should('be.visible')
      
      // Check title exists
      cy.title().should('not.be.empty')
      
      // Check no error pages or critical errors
      cy.get('body').should('not.contain', '404')
      cy.get('body').should('not.contain', '500')
      cy.get('body').should('not.contain', 'Internal Server Error')
      cy.get('body').should('not.contain', 'Page Not Found')
      
      // Check no visible error alerts
      cy.get('.error-message, .alert-error, [role="alert"]').should('not.exist')
    })
  })

  it('should navigate between pages', () => {
    // Start at homepage
    cy.visit('/')
    
    // Go to about page
    cy.visit('/about')
    cy.url().should('include', '/about')
    
    // Go to contact page  
    cy.visit('/contact')
    cy.url().should('include', '/contact')
    
    // Return to homepage
    cy.visit('/')
    cy.url().should('eq', Cypress.config().baseUrl + '/en')
  })
})