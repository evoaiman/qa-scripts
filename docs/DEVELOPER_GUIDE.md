# Developer Guide - @am-bateriku/qa-scripts

## Overview

This guide helps developers integrate and use the centralized QA testing package in their projects.

## Installation

### 1. Initial Setup

```bash
# Navigate to your project
cd /path/to/your/project (e.g., astra)

# Install the package
npm install --save-dev @am-bateriku/qa-scripts
```

### 2. Configure NPM Registry

Add to your project's `.npmrc`:
```
@am-bateriku:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

Set up your GitHub token:
```bash
# Add to ~/.bashrc or ~/.zshrc
export NPM_TOKEN=ghp_your_token_here
```

### 3. Automatic Setup

After installation, the package automatically:
- ✅ Installs git hooks (pre-commit)
- ✅ Adds npm scripts to package.json
- ✅ Creates necessary directories

## Usage

### Running Tests Locally

```bash
# Basic test run (auto-detects project)
npm run qa:test

# With specific environment
npm run qa:test:local      # Uses .env.local
npm run qa:test:staging    # Uses .env.staging

# Debug mode (visible browser)
npm run qa:test:headed

# Run specific test file
npx qa-test --spec "**/forms.cy.js"
```

### Environment Configuration

Create `.env.local` in your project root:
```env
# For local testing
BASE_URL=http://localhost:3000
API_URL=http://localhost:3000/api
TEST_USER_EMAIL=test@local.com
TEST_USER_PASSWORD=localpass123
```

### Pre-commit Hook

Tests run automatically before each commit. To bypass (emergency only):
```bash
git commit --no-verify -m "Emergency fix"
```

## Debugging Failed Tests

### 1. Run in Headed Mode
```bash
npm run qa:test:headed
```
This opens Cypress UI where you can:
- See tests running in real-time
- Inspect elements
- Debug step-by-step

### 2. Check Screenshots
Failed tests automatically capture screenshots:
```
cypress/screenshots/[project-name]/[test-name].png
```

### 3. Enable Debug Output
```bash
npm run qa:test:debug
```

### 4. Run Specific Test
```bash
npx qa-test --spec "**/specific-test.cy.js"
```

## Common Issues & Solutions

### Issue: Tests pass locally but fail in CI

**Solution:**
1. Check environment variables match
2. Ensure same Node/npm versions
3. Clear cache: `npm cache clean --force`

### Issue: "Project not detected"

**Solution:**
Specify project explicitly:
```bash
npx qa-test --project astra
```

### Issue: Timeout errors

**Solution:**
Increase timeouts in `.env.local`:
```env
DEFAULT_TIMEOUT=20000
PAGE_LOAD_TIMEOUT=60000
```

### Issue: Authentication failures

**Solution:**
Check test credentials in `.env.local`:
```env
TEST_USER_EMAIL=correct@email.com
TEST_USER_PASSWORD=correctpassword
```

## Best Practices

### 1. Keep Tests Updated
```bash
# Regularly update to latest version
npm run qa:update
```

### 2. Test Before Pushing
```bash
# Run full test suite
npm run qa:test:staging
```

### 3. Use Proper Selectors
```javascript
// Good - specific selectors
cy.get('[data-testid="submit-button"]')
cy.get('button[type="submit"]')

// Bad - fragile selectors
cy.get('.btn-2')
cy.get('div > span > button')
```

### 4. Handle Async Operations
```javascript
// Wait for API calls
cy.intercept('POST', '/api/submit').as('submitForm')
cy.get('button').click()
cy.wait('@submitForm')
```

## Writing Project-Specific Tests

While tests are maintained in the qa-scripts repo, you can contribute:

### 1. Report Issues
Create issues in qa-scripts repo with:
- Test name and file
- Error message
- Steps to reproduce
- Environment details

### 2. Suggest New Tests
Open a pull request or issue with:
- Feature to test
- Test scenarios
- Expected behavior

### 3. Temporary Local Tests
For quick local testing before official tests are added:
```javascript
// Create local-tests.cy.js (add to .gitignore)
describe('Local Tests', () => {
  it('temporary test', () => {
    // Your test here
  })
})
```

## CI/CD Integration

### GitHub Actions
```yaml
name: QA Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run qa:test:staging
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### GitLab CI
```yaml
qa-tests:
  stage: test
  script:
    - npm ci
    - npm run qa:test:staging
  variables:
    NPM_TOKEN: $NPM_TOKEN
```

## Advanced Usage

### Custom Commands
Use shared commands in tests:
```javascript
// Login
cy.login('user@example.com', 'password')

// Fill forms
cy.fillContactForm({
  name: 'Test User',
  email: 'test@example.com'
})

// API testing
cy.apiLogin('user@example.com', 'password')
```

### Parallel Testing
```bash
npx qa-test --parallel
```

### Visual Regression Testing
```bash
npx qa-test --update-snapshots
```

## Monitoring & Reporting

### Test Results
Check test results in:
- Terminal output
- `cypress/screenshots/` - Failed test screenshots
- `cypress/videos/` - Test execution videos

### Cypress Dashboard (Optional)
```bash
npx qa-test --record --key YOUR_RECORD_KEY
```

## Getting Help

- **QA Team**: qa@bateriku.com
- **Slack**: #qa-automation
- **GitHub Issues**: https://github.com/bateriku/qa-scripts/issues

## Quick Reference

```bash
# Installation
npm install --save-dev @am-bateriku/qa-scripts

# Daily commands
npm run qa:test              # Run tests
npm run qa:test:headed       # Debug mode
npm run qa:update            # Update package

# Troubleshooting
npx qa-test --debug          # Debug output
npx qa-test --project astra  # Specific project
git commit --no-verify       # Skip tests (emergency)
```