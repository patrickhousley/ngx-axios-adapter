module.exports = {
  name: 'core',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/core',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'ngx-axios-adapter tests',
        outputDirectory: 'coverage/libs/core'
      }
    ]
  ]
};
