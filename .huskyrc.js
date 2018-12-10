module.exports = {
  hooks: {
    'pre-commit': [
      'npm run affected:test -- --base=master',
      'npm run affected:lint -- --base=master'
    ].join(' && ')
  }
};
