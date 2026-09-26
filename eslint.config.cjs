const { buildESLintConfig } = require('@handy-common-utils/dev-dependencies-mocha');
const { defineConfig } = require('eslint/config');

const config = buildESLintConfig({ defaultSourceType: 'commonjs' });

module.exports = defineConfig([
  {
    ignores: ['**/dist/**', 'dist/**', 'coverage/**', 'test/simple-cli-prj*/**'],
  },
  ...config,
]);
