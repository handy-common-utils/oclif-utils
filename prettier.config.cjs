const { buildPrettierConfig } = require('eslint-config-sensible-prettier-typescript');

module.exports = {
  ...buildPrettierConfig(),
  // Override or extend the default config
};
