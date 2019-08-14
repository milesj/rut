/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import toBeElementType from './toBeElementType';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeElementType(type: React.ReactType): R;
    }
  }
}

export default { toBeElementType };
