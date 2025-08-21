# Contributing to qa-scripts

First off, thank you for considering contributing to qa-scripts! It's people like you that make qa-scripts such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what behavior you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, Node version, npm version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Provide specific examples to demonstrate the enhancement**
- **Describe the current behavior and expected behavior**
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code follows the existing code style.
6. Issue that pull request!

## Development Setup

1. Fork and clone the repository:
```bash
git clone https://github.com/your-username/qa-scripts.git
cd qa-scripts
```

2. Install dependencies:
```bash
npm install
```

3. Create a test project:
```bash
mkdir cypress/my-project
cd cypress/my-project
# Add your test files
```

4. Run tests locally:
```bash
npm test
```

## Project Structure

```
qa-scripts/
├── bin/           # CLI executables
├── lib/           # Core library code
├── cypress/       # Test suites for different projects
├── shared/        # Shared test utilities
├── configs/       # Configuration files
└── hooks/         # Git hooks
```

## Writing Tests

### Test File Structure

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup code
  })

  it('should do something specific', () => {
    // Test implementation
  })

  afterEach(() => {
    // Cleanup code
  })
})
```

### Best Practices

1. **Write clear test descriptions** - Test names should clearly describe what they test
2. **Keep tests independent** - Each test should be able to run independently
3. **Use data-cy attributes** - For reliable element selection
4. **Avoid hard-coded waits** - Use Cypress's built-in retry-ability
5. **Clean up after tests** - Reset state to avoid test pollution

### Custom Commands

Add custom commands in `shared/commands/`:

```javascript
Cypress.Commands.add('customCommand', (param) => {
  // Implementation
})
```

## Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Add trailing commas in multi-line objects/arrays
- Keep lines under 100 characters when possible

### Running Linting

```bash
npm run lint
```

## Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### Examples

```
Add support for Firefox browser

- Update browser configuration options
- Add Firefox-specific test adjustments
- Update documentation

Fixes #123
```

## Testing Your Changes

Before submitting a pull request:

1. Run the full test suite:
```bash
npm test
```

2. Test with different environments:
```bash
npm test -- --env staging
npm test -- --env production
```

3. Test with different browsers:
```bash
npm test -- --browser chrome
npm test -- --browser firefox
```

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments to new functions
- Update the CLI help text if you add new options
- Include examples for new features

## Release Process

Maintainers will handle releases, but for reference:

1. Update version in package.json
2. Update CHANGELOG.md
3. Commit changes
4. Create a git tag
5. Push to GitHub
6. Publish to npm

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## Recognition

Contributors will be recognized in the README.md file. Thank you for your contributions!