const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { createCypressConfig } = require('./config-loader');
const chalk = require('chalk');

/**
 * Runs Cypress tests for a specific project
 * @param {object} options - CLI options
 * @param {object} config - Environment configuration
 * @returns {Promise<object>} Test results
 */
async function runTests(options, config) {
  const { project, headed, browser, spec, parallel, record, debug } = options;
  
  // Validate project exists
  const projectPath = path.join(__dirname, '..', 'tests', project);
  if (!fs.existsSync(projectPath)) {
    throw new Error(`Project '${project}' not found in tests directory`);
  }
  
  // Create Cypress configuration
  const cypressConfig = createCypressConfig(project, config, options);
  
  // Build Cypress command
  const cypressCommand = headed ? 'open' : 'run';
  const args = ['cypress', cypressCommand];
  
  // Add configuration
  args.push('--config');
  args.push(JSON.stringify({
    baseUrl: cypressConfig.e2e.baseUrl,
    viewportWidth: cypressConfig.e2e.viewportWidth,
    viewportHeight: cypressConfig.e2e.viewportHeight,
    defaultCommandTimeout: cypressConfig.e2e.defaultCommandTimeout,
    requestTimeout: cypressConfig.e2e.requestTimeout,
    responseTimeout: cypressConfig.e2e.responseTimeout,
    pageLoadTimeout: cypressConfig.e2e.pageLoadTimeout,
    video: cypressConfig.e2e.video,
    screenshotOnRunFailure: cypressConfig.e2e.screenshotOnRunFailure,
  }));
  
  // Add environment variables
  args.push('--env');
  args.push(Object.entries(cypressConfig.e2e.env)
    .map(([key, value]) => `${key}=${value}`)
    .join(','));
  
  // Set spec pattern
  if (spec) {
    args.push('--spec');
    args.push(spec);
  } else {
    args.push('--spec');
    args.push(path.join(projectPath, 'e2e', '**', '*.cy.js'));
  }
  
  // Set browser
  if (browser) {
    args.push('--browser');
    args.push(browser);
  }
  
  // Add optional flags
  if (parallel) {
    args.push('--parallel');
  }
  
  if (record) {
    args.push('--record');
  }
  
  // Set working directory to tests/project
  const cwd = projectPath;
  
  return new Promise((resolve, reject) => {
    if (debug) {
      console.log(chalk.gray('Debug: Running command:'));
      console.log(chalk.gray(`npx ${args.join(' ')}`));
      console.log(chalk.gray(`Working directory: ${cwd}`));
    }
    
    const cypressProcess = spawn('npx', args, {
      cwd,
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        ...config,
        FORCE_COLOR: '1',
      },
    });
    
    cypressProcess.on('close', (code) => {
      if (code === 0) {
        resolve({
          totalTests: 0, // These would be parsed from Cypress output
          totalPassed: 0,
          totalFailed: 0,
          success: true,
        });
      } else {
        // For now, return a simple error result
        resolve({
          totalTests: 1,
          totalPassed: 0,
          totalFailed: 1,
          success: false,
        });
      }
    });
    
    cypressProcess.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Runs a simple test to verify setup
 * @param {string} project - Project name
 * @returns {Promise<boolean>} True if tests can run
 */
async function verifySetup(project) {
  const projectPath = path.join(__dirname, '..', 'tests', project);
  
  // Check if project directory exists
  if (!fs.existsSync(projectPath)) {
    console.log(chalk.yellow(`⚠️  Project '${project}' not found. Creating directory structure...`));
    
    // Create project directory structure
    const dirs = [
      projectPath,
      path.join(projectPath, 'e2e'),
      path.join(projectPath, 'fixtures'),
      path.join(projectPath, 'support'),
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    
    // Create a sample test file
    const sampleTest = `describe('${project} - Sample Test', () => {
  it('should visit the homepage', () => {
    cy.visit('/');
    cy.get('body').should('be.visible');
  });
});`;
    
    fs.writeFileSync(
      path.join(projectPath, 'e2e', 'sample.cy.js'),
      sampleTest
    );
    
    // Create support file
    const supportFile = `// Support file for ${project} tests

// Disable uncaught exception handling
Cypress.on('uncaught:exception', () => {
  return false;
});

// Import shared commands
// import '../../../shared/commands';`;
    
    fs.writeFileSync(
      path.join(projectPath, 'support', 'e2e.js'),
      supportFile
    );
    
    console.log(chalk.green(`✅ Created project structure for '${project}'`));
  }
  
  return true;
}

module.exports = {
  runTests,
  verifySetup
};