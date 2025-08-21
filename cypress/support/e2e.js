// Support file for Cypress
// You can add custom commands here

// Disable uncaught exception handling to prevent test failures
Cypress.on('uncaught:exception', () => {
  // Return false to prevent the error from failing the test
  return false
})

// Custom command example (optional)
Cypress.Commands.add('fillContactForm', (name, email, phone, message) => {
  cy.get('input[name="name"]').type(name)
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="phone"]').type(phone)
  cy.get('textarea[name="message"]').type(message)
})