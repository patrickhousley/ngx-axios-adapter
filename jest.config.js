module.exports = {
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': 'jest-preset-angular/preprocessor.js'
  },
  resolver: '@nrwl/builders/plugins/jest/resolver',
  moduleFileExtensions: ['ts', 'js', 'html'],
  collectCoverage: true,
  coverageReporters: ['html'],
  setupTestFrameworkScriptFile: 'jest-preset-angular/setupJest.js',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'ngx-axios-adapter tests',
        outputDirectory: 'coverage/junit/'
      }
    ]
  ]
};
