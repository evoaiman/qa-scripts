// Shared form interaction commands

/**
 * Fill a form field with retry logic
 * @param {string} selector - Field selector
 * @param {string} value - Value to enter
 */
Cypress.Commands.add('fillField', (selector, value) => {
  cy.get(selector)
    .should('be.visible')
    .clear()
    .type(value)
    .should('have.value', value)
})

/**
 * Select from dropdown
 * @param {string} selector - Dropdown selector
 * @param {string} value - Option to select
 */
Cypress.Commands.add('selectOption', (selector, value) => {
  cy.get(selector).select(value)
})

/**
 * Check a checkbox or radio button
 * @param {string} selector - Checkbox/radio selector
 */
Cypress.Commands.add('checkOption', (selector) => {
  cy.get(selector).check().should('be.checked')
})

/**
 * Submit form and wait for response
 * @param {string} formSelector - Form selector
 */
Cypress.Commands.add('submitForm', (formSelector = 'form') => {
  cy.get(formSelector).submit()
  
  // Wait for either success message or redirect
  cy.get('.success, .alert-success', { timeout: 10000 })
    .should('be.visible')
    .or(() => {
      cy.url().should('not.include', cy.location('pathname'))
    })
})

/**
 * Fill contact form (common across projects)
 * @param {object} data - Form data
 */
Cypress.Commands.add('fillContactForm', (data = {}) => {
  const defaults = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '0123456789',
    message: 'This is a test message'
  }
  
  const formData = { ...defaults, ...data }
  
  cy.fillField('input[name="name"]', formData.name)
  cy.fillField('input[name="email"]', formData.email)
  cy.fillField('input[name="phone"], input[name="mobileNo"]', formData.phone)
  cy.fillField('textarea[name="message"]', formData.message)
})

/**
 * Validate form errors
 * @param {string[]} fields - Fields that should show errors
 */
Cypress.Commands.add('validateFormErrors', (fields) => {
  fields.forEach(field => {
    cy.get(`[name="${field}"]`)
      .parent()
      .find('.error, .text-red-500, [aria-invalid="true"]')
      .should('be.visible')
  })
})