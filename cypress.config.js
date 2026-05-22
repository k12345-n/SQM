const { defineConfig } = require('cypress')

module.exports = defineConfig({
  // Emit JUnit XML so Jenkins can record each E2E test as a result.
  // [hash] gives every spec file its own XML (otherwise they overwrite each other).
  reporter: 'mocha-junit-reporter',
  reporterOptions: {
    mochaFile: 'cypress/results/results-[hash].xml',
    toConsole: false,
  },
  e2e: {
    baseUrl: 'http://localhost:8081',
  },
})