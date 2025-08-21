import { defineConfig } from 'cypress'
import dotenv from 'dotenv'
import path from 'path'

// Load environment configuration
const env = process.env.ENV || 'local'
const envFile = path.join(__dirname, '..', '..', `.env.${env}`)
dotenv.config({ path: envFile })

export default defineConfig({
  e2e: {
    baseUrl: process.env.ASTRA_URL || process.env.BASE_URL || 'http://localhost:3000',
    specPattern: 'e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'support/e2e.js',
    fixturesFolder: 'fixtures',
    screenshotsFolder: '../../cypress/screenshots/astra',
    videosFolder: '../../cypress/videos/astra',
    viewportWidth: parseInt(process.env.VIEWPORT_WIDTH) || 1280,
    viewportHeight: parseInt(process.env.VIEWPORT_HEIGHT) || 720,
    defaultCommandTimeout: parseInt(process.env.DEFAULT_TIMEOUT) || 10000,
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT) || 10000,
    responseTimeout: parseInt(process.env.RESPONSE_TIMEOUT) || 10000,
    pageLoadTimeout: parseInt(process.env.PAGE_LOAD_TIMEOUT) || 30000,
    video: process.env.VIDEO === 'true',
    screenshotOnRunFailure: process.env.SCREENSHOTS_ON_FAILURE !== 'false',
    env: {
      apiUrl: process.env.ASTRA_API_URL || process.env.API_URL,
      testUserEmail: process.env.TEST_USER_EMAIL,
      testUserPassword: process.env.TEST_USER_PASSWORD,
      testUserPhone: process.env.TEST_USER_PHONE,
      environment: env,
    },
    setupNodeEvents(on, config) {
      // Add any project-specific plugins or event listeners here
      return config
    },
  },
})