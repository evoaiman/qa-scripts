# QA Tester Guide - @am-bateriku/qa-scripts

## Overview

This guide helps QA testers write, maintain, and publish tests for all Bateriku projects.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/bateriku/qa-scripts.git
cd qa-scripts
npm install
```

### 2. Repository Structure

```
qa-scripts/
├── tests/                    # All test files
│   ├── astra/               # Astra project tests
│   │   ├── e2e/            # Test files
│   │   ├── fixtures/       # Test data
│   │   └── support/        # Helper files
│   ├── amaron/             # Amaron tests
│   ├── akademi/            # Akademi tests
│   └── ...                 # Other projects
├── shared/                  # Shared utilities
│   └── commands/           # Reusable commands
└── configs/                # Environment configs
```

## Writing Tests

### Basic Test Structure

```javascript
describe('Feature Name', () => {
  // Run before each test
  beforeEach(() => {
    cy.visit('/')
  })
  
  it('should do something specific', () => {
    // Test steps
    cy.get('button').click()
    cy.url().should('include', '/success')
  })
  
  it('should handle errors', () => {
    // Error case
    cy.get('form').submit()
    cy.get('.error').should('be.visible')
  })
})
```

### Best Practices

#### 1. Use Descriptive Names
```javascript
// Good
describe('Contact Form - Submission Flow', () => {
  it('should successfully submit form with valid data', () => {})
  it('should show validation errors for empty required fields', () => {})
})

// Bad
describe('Test 1', () => {
  it('test form', () => {})
})
```

#### 2. Use Data Attributes
```javascript
// Good - reliable selectors
cy.get('[data-testid="submit-button"]')
cy.get('input[name="email"]')
cy.get('button[type="submit"]')

// Bad - fragile selectors
cy.get('.btn-primary-2')
cy.get('#app > div:nth-child(2) > button')
```

#### 3. Handle Waiting Properly
```javascript
// Good - explicit waits
cy.intercept('POST', '/api/submit').as('formSubmit')
cy.get('button').click()
cy.wait('@formSubmit')

// Bad - arbitrary waits
cy.wait(5000)
```

#### 4. Test Data Management
```javascript
// Use fixtures for test data
// tests/astra/fixtures/users.json
{
  "validUser": {
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }
}

// In test
cy.fixture('users').then((users) => {
  cy.fillContactForm(users.validUser)
})
```

## Common Test Scenarios

### 1. Page Navigation
```javascript
describe('Navigation', () => {
  it('should navigate between pages', () => {
    cy.visit('/')
    cy.get('a[href="/about"]').click()
    cy.url().should('include', '/about')
    cy.get('h1').should('contain', 'About')
  })
})
```

### 2. Form Testing
```javascript
describe('Contact Form', () => {
  it('should submit valid form', () => {
    cy.visit('/contact')
    
    // Fill form using shared command
    cy.fillContactForm({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '0123456789',
      message: 'Test message'
    })
    
    cy.get('button[type="submit"]').click()
    cy.get('.success-message').should('be.visible')
  })
  
  it('should validate required fields', () => {
    cy.visit('/contact')
    cy.get('button[type="submit"]').click()
    cy.validateFormErrors(['name', 'email', 'phone'])
  })
})
```

### 3. Authentication Testing
```javascript
describe('Authentication', () => {
  it('should login successfully', () => {
    cy.login('user@example.com', 'password123')
    cy.url().should('include', '/dashboard')
    cy.checkAuth()
  })
  
  it('should logout', () => {
    cy.login('user@example.com', 'password123')
    cy.logout()
    cy.url().should('include', '/login')
  })
})
```

### 4. API Testing
```javascript
describe('API Tests', () => {
  it('should fetch products', () => {
    cy.request('GET', `${Cypress.env('apiUrl')}/products`)
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('products')
        expect(response.body.products).to.be.an('array')
      })
  })
})
```

## Using Shared Commands

### Available Commands

```javascript
// Authentication
cy.login(email, password)           // Login via UI
cy.apiLogin(email, password)        // Login via API
cy.logout()                         // Logout
cy.checkAuth()                      // Verify authentication

// Forms
cy.fillField(selector, value)       // Fill input field
cy.selectOption(selector, value)    // Select dropdown option
cy.checkOption(selector)            // Check checkbox/radio
cy.submitForm(formSelector)         // Submit form
cy.fillContactForm(data)           // Fill contact form
cy.validateFormErrors(fields)       // Check validation errors
```

### Creating New Shared Commands

Add to `shared/commands/`:
```javascript
// shared/commands/custom.js
Cypress.Commands.add('myCustomCommand', (param) => {
  // Command implementation
  cy.get('element').should('exist')
})
```

## Testing Different Environments

### 1. Local Testing
```bash
# Test against local environment
ENV=local npm run test:astra
```

### 2. Staging Testing
```bash
# Test against staging
ENV=staging npm run test:astra
```

### 3. Environment Configuration

Create environment files:
```bash
# .env.staging
BASE_URL=https://staging.bateriku.com
ASTRA_URL=https://staging-astra.bateriku.com
TEST_USER_EMAIL=qa@staging.com
TEST_USER_PASSWORD=staging123
```

## Running Tests

### Run All Tests for a Project
```bash
npm run test:astra
npm run test:amaron
npm run test:akademi
```

### Run Specific Test File
```bash
npx cypress run --spec "tests/astra/e2e/forms.cy.js"
```

### Run in Interactive Mode (Debugging)
```bash
npx cypress open
# Then select project and test
```

### Run with Different Browsers
```bash
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

## Publishing Updates

### 1. Make Changes
```bash
# Create feature branch
git checkout -b feature/update-astra-tests

# Make your changes
# ... edit tests ...

# Test your changes
npm run test:astra
```

### 2. Commit Changes
```bash
git add .
git commit -m "Update Astra contact form tests"
git push origin feature/update-astra-tests
```

### 3. Create Pull Request
- Go to GitHub
- Create PR from your branch
- Add description of changes
- Request review from team

### 4. After Approval, Publish
```bash
# Checkout main branch
git checkout main
git pull

# Bump version
npm version patch  # for bug fixes
npm version minor  # for new features
npm version major  # for breaking changes

# Publish to npm
npm publish

# Push tags
git push --tags
```

## Debugging Failed Tests

### 1. Use Cypress UI
```bash
npx cypress open
```
Benefits:
- See tests run in real-time
- Time travel through steps
- Inspect elements
- View network requests

### 2. Add Debug Commands
```javascript
// Pause execution
cy.pause()

// Debug specific element
cy.get('button').debug()

// Take screenshot
cy.screenshot('debug-state')
```

### 3. Check Console Logs
```javascript
cy.log('Current URL:', cy.url())
cy.get('element').then(($el) => {
  console.log('Element:', $el)
})
```

## Test Data Management

### Using Fixtures
```javascript
// tests/astra/fixtures/products.json
{
  "battery": {
    "name": "Astra NS60",
    "price": 250,
    "warranty": "18 months"
  }
}

// In test
cy.fixture('products').then((products) => {
  cy.get('[name="product"]').type(products.battery.name)
})
```

### Dynamic Test Data
```javascript
const testData = {
  email: `test-${Date.now()}@example.com`,
  name: `User ${Math.random().toString(36).substring(7)}`
}
```

## Reporting Issues

When reporting test failures:

1. **Include Error Message**
```
AssertionError: expected 'Login' to equal 'Dashboard'
```

2. **Provide Steps to Reproduce**
```
1. Run test: npm run test:astra
2. Test: forms.cy.js - "should submit contact form"
3. Environment: staging
```

3. **Attach Screenshots**
Location: `cypress/screenshots/`

4. **Environment Details**
```
- Node version: 18.x
- NPM version: 9.x
- Browser: Chrome 120
- OS: MacOS/Windows/Linux
```

## Tips & Tricks

### 1. Faster Test Development
```bash
# Watch mode - auto-reruns tests
npx cypress open
```

### 2. Skip Tests Temporarily
```javascript
it.skip('test under development', () => {
  // Test will be skipped
})
```

### 3. Run Only Specific Test
```javascript
it.only('focus on this test', () => {
  // Only this test runs
})
```

### 4. Custom Timeout for Slow Operations
```javascript
cy.get('element', { timeout: 30000 }).should('exist')
```

### 5. Retry Flaky Tests
```javascript
// In cypress.config.js
{
  retries: {
    runMode: 2,
    openMode: 0
  }
}
```

## Checklist Before Publishing

- [ ] All tests pass locally
- [ ] Tests pass in staging environment
- [ ] No `.only` or `.skip` left in tests
- [ ] Descriptive test names used
- [ ] No hardcoded values (use fixtures/env vars)
- [ ] Screenshots/videos reviewed for failures
- [ ] Pull request created and reviewed
- [ ] Version bumped appropriately
- [ ] CHANGELOG updated (if exists)

## Getting Help

- **Slack Channel**: #qa-automation
- **QA Lead**: qa-lead@bateriku.com
- **Documentation**: This guide
- **Examples**: Look at existing tests in `tests/` folder

## Quick Commands Reference

```bash
# Development
npm install                    # Install dependencies
npm run test:astra            # Run Astra tests
npx cypress open              # Open Cypress UI

# Testing
ENV=staging npm run test:astra  # Test staging
npx cypress run --headed        # Run with browser visible
npx cypress run --spec "*.cy.js" # Run specific file

# Publishing
npm version patch             # Bump version
npm publish                   # Publish to registry
git push --tags              # Push version tags
```