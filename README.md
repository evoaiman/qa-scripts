# 🧪 @am-bateriku/qa-scripts

Centralized QA testing package for all Bateriku projects. Write once, test everywhere!

## 🎯 Purpose

This package centralizes all E2E tests for Bateriku projects, allowing:
- **QA/Testers** to write and maintain tests in one place
- **Developers** to run the same tests locally before committing
- **CI/CD** to automatically run tests during deployments
- **Consistency** across local, staging, and production environments

## 🚀 Quick Start

### For Developers (Using the package in your project)

1. **Install the package:**
```bash
npm install --save-dev @am-bateriku/qa-scripts
```

2. **Run the post-install setup (automatic):**
The package automatically sets up git hooks and npm scripts after installation.

3. **Run tests:**
```bash
# Run tests for your project (auto-detected)
npm run qa:test

# Run with specific environment
npm run qa:test:local
npm run qa:test:staging

# Run in headed mode (see browser)
npm run qa:test:headed

# Debug mode
npm run qa:test:debug
```

### For QA/Testers (Maintaining tests)

1. **Clone this repository:**
```bash
git clone https://github.com/bateriku/qa-scripts.git
cd qa-scripts
npm install
```

2. **Write/update tests in the appropriate project folder:**
```
tests/
├── astra/
│   └── e2e/
│       ├── pages.cy.js
│       ├── forms.cy.js
│       └── purchase.cy.js
├── amaron/
├── akademi/
└── ...
```

3. **Test your changes:**
```bash
# Test specific project
npm run test:astra

# Test with staging environment
ENV=staging npm run test:astra
```

4. **Publish new version:**
```bash
npm version patch  # or minor/major
npm publish
git push --tags
```

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+ and npm 9+
- Git (for hooks)
- Chrome/Firefox/Edge browser

### Setting up NPM Registry (GitHub Packages)

1. **Create a Personal Access Token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Create a token with `write:packages` and `read:packages` scopes

2. **Configure npm:**
```bash
npm login --registry=https://npm.pkg.github.com
# Username: YOUR_GITHUB_USERNAME
# Password: YOUR_PERSONAL_ACCESS_TOKEN
# Email: YOUR_EMAIL
```

3. **Add to your project's `.npmrc`:**
```
@am-bateriku:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

4. **Set environment variable:**
```bash
export NPM_TOKEN=your_token_here
```

## 🔧 Configuration

### Environment Files

Create environment-specific files:
- `.env.local` - Local development
- `.env.staging` - Staging environment
- `.env.production` - Production environment

Example `.env.local`:
```env
BASE_URL=http://localhost:3000
ASTRA_URL=http://localhost:3001
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpass123
BROWSER=chrome
HEADLESS=false
```

### Project Detection

The package automatically detects which project you're in based on:
1. `package.json` name field
2. Directory name
3. Project-specific files

## 📝 Writing Tests

### Test Structure

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should do something', () => {
    cy.get('button').click()
    cy.url().should('include', '/success')
  })
})
```

### Using Shared Commands

```javascript
// Authentication
cy.login('user@example.com', 'password')
cy.logout()

// Forms
cy.fillContactForm({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '0123456789',
  message: 'Test message'
})

// Validation
cy.validateFormErrors(['email', 'phone'])
```

## 🎯 Available Commands

### CLI Commands

```bash
# Run tests
qa-test                          # Auto-detect project
qa-test --project astra         # Specific project
qa-test --env staging           # Specific environment
qa-test --spec "**/*forms*"    # Specific test files
qa-test --headed                # Visible browser
qa-test --browser firefox       # Different browser
qa-test --debug                 # Debug mode

# NPM Scripts (in your project)
npm run qa:test                 # Run tests
npm run qa:test:local           # Local environment
npm run qa:test:staging         # Staging environment
npm run qa:test:headed          # Headed mode
npm run qa:update               # Update package
```

## 🔗 Git Hooks

The package automatically installs a pre-commit hook that:
1. Fetches latest test scripts
2. Runs tests for your project
3. Blocks commit if tests fail

To skip hooks temporarily:
```bash
git commit --no-verify -m "Emergency fix"
```

## 📊 Test Reports

Test results are saved in:
- Screenshots: `cypress/screenshots/`
- Videos: `cypress/videos/`
- Reports: `reports/`

## 🏗️ Project Support

Currently supported projects:
- ✅ astra
- ✅ amaron
- ✅ akademi
- ✅ b2b-web
- ✅ b2c-web
- ✅ motor-maniac
- 🚧 ticketing (coming soon)

## 🐛 Troubleshooting

### Tests fail locally but pass in CI
- Check environment variables
- Ensure correct base URL
- Check browser version

### Package not found
```bash
npm install @am-bateriku/qa-scripts --save-dev
```

### Permission denied for hooks
```bash
chmod +x .git/hooks/pre-commit
```

### Tests timeout
- Increase timeout in `.env` file
- Check if application is running
- Check network connectivity

## 🤝 Contributing

### For QA Team

1. Create feature branch
2. Write/update tests
3. Test locally
4. Create pull request
5. After review, publish new version

### For Developers

Report issues or suggest improvements:
- Create issue in qa-scripts repository
- Include error messages and environment details

## 📚 Documentation

- [TESTER_GUIDE.md](docs/TESTER_GUIDE.md) - Detailed guide for QA team
- [DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) - Integration guide for developers
- [CI_CD_SETUP.md](docs/CI_CD_SETUP.md) - CI/CD configuration

## 📄 License

Private - Bateriku Internal Use Only

## 👥 Support

- QA Team: qa@bateriku.com
- Dev Team: dev@bateriku.com
- Slack: #qa-automation

---

Made with ❤️ by Bateriku QA Team