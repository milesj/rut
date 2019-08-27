/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { act } from 'react-test-renderer';
import { configure } from './configure';
import matchers from './matchers';
import { render, renderAndWait } from './render';

export * from './helpers';
export * from './mocks';
export * from './types';

export { act, configure, matchers, render, renderAndWait };
