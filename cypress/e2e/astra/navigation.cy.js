describe('Navigation Tests', () => {
  
  it('should refresh page without breaking', () => {
    // Visit homepage
    cy.visit('/')
    
    // Get title before refresh
    cy.title().then(initialTitle => {
      // Refresh the page
      cy.reload()
      
      // Check title is same after refresh
      cy.title().should('eq', initialTitle)
    })
    
    // Check page content still exists
    cy.get('body').should('be.visible')
  })

  it('should handle browser back and forward', () => {
    // Visit homepage
    cy.visit('/')
    
    // Go to about page
    cy.visit('/about')
    cy.url().should('include', '/about')
    
    // Go back
    cy.go('back')
    cy.url().should('eq', Cypress.config().baseUrl + '/en')
    
    // Go forward
    cy.go('forward')
    cy.url().should('include', '/about')
  })

  it('should have working navigation menu', () => {
    cy.visit('/')
    
    // Check if navigation exists
    cy.get('nav, header').should('exist')
    
    // Check for links in navigation
    cy.get('nav a, header a').should('have.length.greaterThan', 0)
  })

  it('should load images and assets', () => {
    cy.visit('/')
    
    // Check if images exist on page
    cy.get('img').should('have.length.greaterThan', 0)
    
    // Check first image has src
    cy.get('img').first().should('have.attr', 'src')
  })
})