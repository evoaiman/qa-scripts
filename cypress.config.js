import { defineConfig } from 'cypress'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment configuration
const env = process.env.ENV || 'local'
const envFile = path.join(__dirname, `.env.${env}`)
dotenv.config({ path: envFile })

// Get project from environment or command line
const project = process.env.PROJECT || process.env.npm_config_project || 'all'

export default defineConfig({
  e2e: {
    experimentalStudio: true,
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    specPattern: project === 'all' 
      ? 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
      : `cypress/e2e/${project}/**/*.cy.{js,jsx,ts,tsx}`,
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    viewportWidth: parseInt(process.env.VIEWPORT_WIDTH) || 1280,
    viewportHeight: parseInt(process.env.VIEWPORT_HEIGHT) || 720,
    defaultCommandTimeout: parseInt(process.env.DEFAULT_TIMEOUT) || 10000,
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT) || 10000,
    responseTimeout: parseInt(process.env.RESPONSE_TIMEOUT) || 10000,
    pageLoadTimeout: parseInt(process.env.PAGE_LOAD_TIMEOUT) || 30000,
    video: process.env.VIDEO === 'true',
    screenshotOnRunFailure: process.env.SCREENSHOTS_ON_FAILURE !== 'false',
    env: {
      // Project-specific URLs
      ASTRA_URL: process.env.ASTRA_URL,
      AMARON_URL: process.env.AMARON_URL,
      AKADEMI_URL: process.env.AKADEMI_URL,
      B2B_URL: process.env.B2B_URL,
      B2C_URL: process.env.B2C_URL,
      MOTOR_MANIAC_URL: process.env.MOTOR_MANIAC_URL,
      
      // Common environment variables
      apiUrl: process.env.API_URL,
      testUserEmail: process.env.TEST_USER_EMAIL,
      testUserPassword: process.env.TEST_USER_PASSWORD,
      testUserPhone: process.env.TEST_USER_PHONE,
      environment: env,
      project: project,
    },
    setupNodeEvents(on, config) {
      // Dynamic base URL based on project
      if (project !== 'all') {
        const projectUrl = process.env[`${project.toUpperCase().replace('-', '_')}_URL`]
        if (projectUrl) {
          config.baseUrl = projectUrl
        }
      }
      
      // Add any project-specific plugins or event listeners here
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' && browser.isHeadless) {
          launchOptions.args.push('--disable-gpu')
          launchOptions.args.push('--no-sandbox')
          launchOptions.args.push('--disable-dev-shm-usage')
        }
        return launchOptions
      })
      
      return config
    },
  },
})