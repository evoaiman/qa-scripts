# qa-scripts

[![npm version](https://img.shields.io/npm/v/qa-scripts.svg)](https://www.npmjs.com/package/qa-scripts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/qa-scripts.svg)](https://www.npmjs.com/package/qa-scripts)

A centralized QA test automation framework for web applications using Cypress. Write once, test everywhere!

## Features

- 🚀 **Centralized Testing** - Maintain all E2E tests in one package
- 🔄 **Auto-detection** - Automatically detects which project you're testing
- 🌍 **Environment Support** - Built-in support for local, staging, and production environments  
- 🎯 **Git Hooks** - Automatic pre-commit hooks to run tests before code commits
- 📊 **Test Reports** - Comprehensive test reports with screenshots and videos
- 🛠️ **CLI Tool** - Powerful command-line interface for running tests
- 🎨 **Customizable** - Easily extend with custom commands and configurations

## Installation

```bash
npm install --save-dev qa-scripts
```

Or install globally:

```bash
npm install -g qa-scripts
```

## Quick Start

### Basic Usage

```bash
# Run tests for auto-detected project
qa-test

# Run tests for specific project
qa-test --project myapp

# Run tests in specific environment
qa-test --env staging

# Run tests in headed mode (see browser)
qa-test --headed

# Debug mode
qa-test --headed --debug
```

### NPM Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test:e2e": "qa-test",
    "test:e2e:staging": "qa-test --env staging",
    "test:e2e:headed": "qa-test --headed"
  }
}
```

## Configuration

### Environment Files

Create environment-specific `.env` files in your project root:

```bash
# .env.local
BASE_URL=http://localhost:3000
API_URL=http://localhost:3001/api
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpass123

# .env.staging
BASE_URL=https://staging.example.com
API_URL=https://api-staging.example.com
TEST_USER_EMAIL=staging@example.com
TEST_USER_PASSWORD=stagingpass123

# .env.production
BASE_URL=https://example.com
API_URL=https://api.example.com
TEST_USER_EMAIL=prod@example.com
TEST_USER_PASSWORD=prodpass123
```

### Project Structure

Organize your tests by project:

```
tests/
├── project-1/
│   ├── cypress.config.js
│   └── e2e/
│       ├── auth.cy.js
│       ├── dashboard.cy.js
│       └── settings.cy.js
├── project-2/
│   ├── cypress.config.js
│   └── e2e/
│       └── smoke.cy.js
└── shared/
    ├── commands/
    └── fixtures/
```

## Writing Tests

### Basic Test Structure

```javascript
describe('User Authentication', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should login successfully', () => {
    cy.get('[data-cy=email]').type('user@example.com')
    cy.get('[data-cy=password]').type('password123')
    cy.get('[data-cy=submit]').click()
    cy.url().should('include', '/dashboard')
  })
})
```

### Using Custom Commands

```javascript
// Login command
cy.login('user@example.com', 'password')

// API testing
cy.apiRequest('GET', '/users')
  .should((response) => {
    expect(response.status).to.eq(200)
  })

// Form helpers
cy.fillForm({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Test message'
})
```

## CLI Options

```bash
qa-test [options]

Options:
  -p, --project <name>     Project name to test
  -e, --env <environment>  Environment (local|staging|production) [default: "local"]
  -s, --spec <pattern>     Specific test files to run
  -b, --browser <browser>  Browser to use (chrome|firefox|edge) [default: "chrome"]
  --headed                 Run tests in headed mode
  --debug                  Enable debug mode
  --no-exit                Keep Cypress open after tests
  -h, --help              Display help
```

## Git Hooks

The package automatically sets up pre-commit hooks during installation. To skip hooks temporarily:

```bash
git commit --no-verify -m "Emergency fix"
```

To disable hooks:

```bash
rm .git/hooks/pre-commit
```

## Test Reports

Test results are automatically saved:

- **Screenshots**: `cypress/screenshots/` (on failures)
- **Videos**: `cypress/videos/`
- **JSON Reports**: `reports/results.json`

## API

### Programmatic Usage

```javascript
const { runTests } = require('qa-scripts');

// Run tests programmatically
runTests({
  project: 'myapp',
  env: 'staging',
  headed: false,
  spec: '**/*smoke*'
}).then(results => {
  console.log('Tests completed:', results);
});
```

### Project Detection

```javascript
const { detectProject } = require('qa-scripts');

const project = detectProject();
console.log('Detected project:', project);
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 [Email Support](mailto:support@example.com)
- 🐛 [Report Issues](https://github.com/evoaiman/qa-scripts/issues)
- 💬 [Discussions](https://github.com/evoaiman/qa-scripts/discussions)

## Links

- [GitHub Repository](https://github.com/evoaiman/qa-scripts)
- [NPM Package](https://www.npmjs.com/package/qa-scripts)
- [Documentation](https://github.com/evoaiman/qa-scripts/wiki)

---

Made with ❤️ by the QA community