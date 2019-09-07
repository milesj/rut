/* eslint-disable sort-keys */

module.exports = {
  rules: {
    'no-magic-numbers': 'off',
    'no-underscore-dangle': 'off',
  },
  overrides: [
    {
      files: ['*.test.ts', '*.test.tsx'],
      plugins: ['rut'],
      rules: {
        'rut/no-act': 'error',
        'rut/no-internals': 'error',

        // Lots of test cases dont use props
        'rut/require-render-generics': 'off',
      },
    },
  ],
};
