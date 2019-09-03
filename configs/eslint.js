/* eslint-disable sort-keys */

module.exports = {
  rules: {
    'no-magic-numbers': 'off',
    'no-underscore-dangle': 'off',
  },
  overrides: [
    {
      files: ['*.test.ts'],
      extends: ['plugin:rut/recommended'],
    },
  ],
};
