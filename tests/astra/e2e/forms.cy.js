describe('Form Tests', () => {
  
  it('should fill and submit contact form', () => {
    // Visit contact page
    cy.visit('/contact')
    
    // Check form exists
    cy.get('form').should('be.visible')
    
    // Fill the form
    cy.get('input[name="name"]').type('Test User')
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="mobileNo"]').type('0123456789')
    cy.get('textarea[name="message"]').type('This is a test message')
    
    // Submit the form
    cy.get('button[type="submit"]').click()
    
    // Check for success (either message or redirect)
    cy.get('body').should('exist') // Wait for page to be ready
    
    // Check if we got success message or redirected
    cy.get('body').then($body => {
      const hasSuccess = $body.find('.success, .text-green-500').length > 0
      const urlChanged = !cy.url().includes('/contact')
      
      // Either success message or redirect is fine
      expect(hasSuccess || urlChanged).to.be.true
    })
  })

  it('should show validation errors for empty form', () => {
    cy.visit('/contact')
    
    // Try to submit empty form
    cy.get('button[type="submit"]').click()
    
    // Should show validation errors
    cy.get('.error, .text-red-500, [aria-invalid="true"]').should('be.visible')
  })

  it('should handle form fields correctly', () => {
    cy.visit('/contact')
    
    // Type and verify each field
    cy.get('input[name="name"]').type('John Doe')
    cy.get('input[name="name"]').should('have.value', 'John Doe')
    cy.get('input[name="email"]').type('john@test.com')
    cy.get('input[name="email"]').should('have.value', 'john@test.com')
    cy.get('input[name="mobileNo"]').type('0987654321')
    cy.get('input[name="mobileNo"]').should('have.value', '0987654321')
    cy.get('textarea[name="message"]').type('Test message')
    cy.get('textarea[name="message"]').should('have.value', 'Test message')
    
    // Clear and retype
    cy.get('input[name="name"]').clear()
    cy.get('input[name="name"]').type('Jane Doe')
    cy.get('input[name="name"]').should('have.value', 'Jane Doe')
  })
})