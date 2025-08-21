const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

/**
 * Loads environment configuration
 * @param {string} environment - Environment name (local/staging/production)
 * @returns {object} Configuration object
 */
function loadConfig(environment = 'local') {
  const configs = {};
  
  // Load base .env.example as defaults
  const examplePath = path.join(__dirname, '..', '.env.example');
  if (fs.existsSync(examplePath)) {
    const exampleConfig = dotenv.parse(fs.readFileSync(examplePath));
    Object.assign(configs, exampleConfig);
  }
  
  // Load environment-specific config
  const envFile = `.env.${environment}`;
  const envPath = path.join(__dirname, '..', envFile);
  
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    Object.assign(configs, envConfig);
  } else {
    // Try to load from project root
    const projectEnvPath = path.join(process.cwd(), envFile);
    if (fs.existsSync(projectEnvPath)) {
      const envConfig = dotenv.parse(fs.readFileSync(projectEnvPath));
      Object.assign(configs, envConfig);
    }
  }
  
  // Override with environment variables
  Object.keys(configs).forEach(key => {
    if (process.env[key]) {
      configs[key] = process.env[key];
    }
  });
  
  // Set defaults if not provided
  configs.ENV = configs.ENV || environment;
  configs.BROWSER = configs.BROWSER || 'chrome';
  configs.VIEWPORT_WIDTH = configs.VIEWPORT_WIDTH || '1280';
  configs.VIEWPORT_HEIGHT = configs.VIEWPORT_HEIGHT || '720';
  configs.DEFAULT_TIMEOUT = configs.DEFAULT_TIMEOUT || '10000';
  configs.HEADLESS = configs.HEADLESS !== 'false';
  
  return configs;
}

/**
 * Gets the base URL for a specific project
 * @param {string} project - Project name
 * @param {object} config - Configuration object
 * @returns {string} Base URL for the project
 */
function getProjectBaseUrl(project, config) {
  const projectUrlMap = {
    'astra': config.ASTRA_URL || config.BASE_URL,
    'amaron': config.AMARON_URL || config.BASE_URL,
    'akademi': config.AKADEMI_URL || config.BASE_URL,
    'b2b-web': config.B2B_URL || config.BASE_URL,
    'b2c-web': config.B2C_URL || config.BASE_URL,
    'motor-maniac': config.MOTOR_MANIAC_URL || config.BASE_URL,
  };
  
  return projectUrlMap[project] || config.BASE_URL || 'http://localhost:3000';
}

/**
 * Gets the API URL for a specific project
 * @param {string} project - Project name
 * @param {object} config - Configuration object
 * @returns {string} API URL for the project
 */
function getProjectApiUrl(project, config) {
  const projectApiMap = {
    'astra': config.ASTRA_API_URL || config.API_URL,
    'amaron': config.AMARON_API_URL || config.API_URL,
    'akademi': config.AKADEMI_API_URL || config.API_URL,
    'b2b-web': config.B2B_API_URL || config.API_URL,
    'b2c-web': config.B2C_API_URL || config.API_URL,
    'motor-maniac': config.MOTOR_MANIAC_API_URL || config.API_URL,
  };
  
  return projectApiMap[project] || config.API_URL || 'http://localhost:3000/api';
}

/**
 * Creates Cypress configuration based on environment config
 * @param {string} project - Project name
 * @param {object} config - Configuration object
 * @param {object} options - CLI options
 * @returns {object} Cypress configuration
 */
function createCypressConfig(project, config, options) {
  const baseUrl = getProjectBaseUrl(project, config);
  const apiUrl = getProjectApiUrl(project, config);
  
  return {
    e2e: {
      baseUrl,
      specPattern: options.spec || `tests/${project}/e2e/**/*.cy.{js,jsx,ts,tsx}`,
      supportFile: `tests/${project}/support/e2e.js`,
      fixturesFolder: `tests/${project}/fixtures`,
      screenshotsFolder: `cypress/screenshots/${project}`,
      videosFolder: `cypress/videos/${project}`,
      viewportWidth: parseInt(config.VIEWPORT_WIDTH),
      viewportHeight: parseInt(config.VIEWPORT_HEIGHT),
      defaultCommandTimeout: parseInt(config.DEFAULT_TIMEOUT),
      requestTimeout: parseInt(config.REQUEST_TIMEOUT || config.DEFAULT_TIMEOUT),
      responseTimeout: parseInt(config.RESPONSE_TIMEOUT || config.DEFAULT_TIMEOUT),
      pageLoadTimeout: parseInt(config.PAGE_LOAD_TIMEOUT || '30000'),
      video: config.VIDEO === 'true',
      screenshotOnRunFailure: config.SCREENSHOTS_ON_FAILURE !== 'false',
      env: {
        apiUrl,
        testUserEmail: config.TEST_USER_EMAIL,
        testUserPassword: config.TEST_USER_PASSWORD,
        testUserPhone: config.TEST_USER_PHONE,
        environment: config.ENV,
      },
    },
    browser: options.browser || config.BROWSER,
    headed: options.headed || !config.HEADLESS,
  };
}

module.exports = {
  loadConfig,
  getProjectBaseUrl,
  getProjectApiUrl,
  createCypressConfig
};