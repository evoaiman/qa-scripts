// Shared authentication commands for all projects

/**
 * Login command for authenticated areas
 * @param {string} email - User email
 * @param {string} password - User password
 */
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('input[name="email"], input[type="email"]').type(email)
  cy.get('input[name="password"], input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  
  // Wait for redirect or success indicator
  cy.url().should('not.include', '/login')
})

/**
 * Logout command
 */
Cypress.Commands.add('logout', () => {
  // Try multiple logout methods
  cy.get('button:contains("Logout"), a:contains("Logout")').click({ force: true })
  cy.url().should('include', '/login')
})

/**
 * Check if user is authenticated
 */
Cypress.Commands.add('checkAuth', () => {
  cy.getCookie('auth-token').should('exist')
})

/**
 * Login via API (faster for setup)
 * @param {string} email - User email
 * @param {string} password - User password
 */
Cypress.Commands.add('apiLogin', (email, password) => {
  cy.request('POST', `${Cypress.env('apiUrl')}/login`, {
    email,
    password
  }).then((response) => {
    // Store auth token
    window.localStorage.setItem('authToken', response.body.token)
    cy.setCookie('auth-token', response.body.token)
  })
})