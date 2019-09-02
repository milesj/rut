/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import rules from './rules';

export = {
  rules,
  configs: {
    recommended: {
      plugins: ['rut'],
      rules: {
        'rut/no-act': 'error',
      },
    },
  },
};
