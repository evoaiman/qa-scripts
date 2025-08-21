const fs = require('fs');
const path = require('path');

/**
 * Detects the current project based on package.json or directory structure
 * @returns {string|null} Project name or null if not detected
 */
function detectProject() {
  // Try to detect from package.json
  const packagePath = path.join(process.cwd(), 'package.json');
  
  if (fs.existsSync(packagePath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const projectName = pkg.name;
      
      // Map package names to test project folders
      const projectMap = {
        'astra-web': 'astra',
        'astra': 'astra',
        'amaron-web': 'amaron',
        'amaron': 'amaron',
        'akademi-web': 'akademi',
        'akademi': 'akademi',
        'b2b-web': 'b2b-web',
        'b2c-web': 'b2c-web',
        'motor-maniac': 'motor-maniac',
        'bateriku-web-v2': 'bateriku-web-v2',
        'ticketing': 'ticketing'
      };
      
      if (projectMap[projectName]) {
        return projectMap[projectName];
      }
      
      // Check if project name contains known keywords
      const knownProjects = ['astra', 'amaron', 'akademi', 'b2b', 'b2c', 'motor-maniac', 'ticketing'];
      for (const project of knownProjects) {
        if (projectName.includes(project)) {
          return project;
        }
      }
    } catch (error) {
      // Continue to fallback detection
    }
  }
  
  // Try to detect from directory name
  const currentDir = path.basename(process.cwd());
  const knownProjects = ['astra', 'amaron', 'akademi', 'b2b-web', 'b2c-web', 'motor-maniac', 'ticketing'];
  
  if (knownProjects.includes(currentDir)) {
    return currentDir;
  }
  
  // Check if we're in a subdirectory of a known project
  const parentDir = path.basename(path.dirname(process.cwd()));
  if (knownProjects.includes(parentDir)) {
    return parentDir;
  }
  
  // Check for specific project files or directories
  const projectIndicators = {
    'astra': ['app/pages/sponsorship.vue', 'app/components/BuyBattery.vue'],
    'amaron': ['app/layouts/amaron.vue', 'app/components/BoxCube.vue'],
    'akademi': ['app/components/CourseCard.vue', 'app/components/TrainerCard.vue'],
    'b2b-web': ['app/components/AffiliateSection.vue', 'app/layouts/business.vue'],
    'b2c-web': ['app/pages/complaint.vue', 'app/pages/e-invoice.vue'],
    'motor-maniac': ['app/layouts/maniac.vue', 'app/stores/useEventStore.js'],
    'ticketing': ['artisan', 'composer.json', 'app/Models/Event.php']
  };
  
  for (const [project, indicators] of Object.entries(projectIndicators)) {
    for (const indicator of indicators) {
      if (fs.existsSync(path.join(process.cwd(), indicator))) {
        return project;
      }
    }
  }
  
  return null;
}

/**
 * Validates if a project exists in the test suite
 * @param {string} projectName - Name of the project
 * @returns {boolean} True if project exists
 */
function projectExists(projectName) {
  const testsPath = path.join(__dirname, '..', 'cypress', 'e2e', projectName);
  return fs.existsSync(testsPath);
}

/**
 * Gets list of all available projects
 * @returns {string[]} Array of project names
 */
function getAvailableProjects() {
  const testsPath = path.join(__dirname, '..', 'cypress', 'e2e');
  
  if (!fs.existsSync(testsPath)) {
    return [];
  }
  
  return fs.readdirSync(testsPath)
    .filter(file => {
      const filePath = path.join(testsPath, file);
      return fs.statSync(filePath).isDirectory();
    });
}

module.exports = {
  detectProject,
  projectExists,
  getAvailableProjects
};