/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import rules from './rules';

export = {
  rules,
  configs: {
    recommended: {
      overrides: [
        {
          files: ['*.test.js', '*.test.jsx', '*.test.ts', '*.test.tsx'],
          plugins: ['rut'],
          rules: {
            'rut/consistent-event-type': 'error',
            'rut/no-act': 'error',
            'rut/no-internals': 'error',
            'rut/require-render-generics': 'error',
          },
        },
      ],
    },
  },
};
