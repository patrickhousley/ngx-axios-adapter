module.exports = {
  hooks: {
    'pre-commit': 'npm run affected -- --base=master'
  }
};
