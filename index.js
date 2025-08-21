/**
 * @am-bateriku/qa-scripts
 * Centralized QA testing package for Bateriku projects
 */

const { runTests, verifySetup } = require('./lib/runner');
const { detectProject, projectExists, getAvailableProjects } = require('./lib/project-detector');
const { loadConfig } = require('./lib/config-loader');
const { installHooks } = require('./hooks/install');

module.exports = {
  // Core functions
  runTests,
  verifySetup,
  
  // Project detection
  detectProject,
  projectExists,
  getAvailableProjects,
  
  // Configuration
  loadConfig,
  
  // Installation
  installHooks,
  
  // Package info
  version: require('./package.json').version,
  name: require('./package.json').name,
};