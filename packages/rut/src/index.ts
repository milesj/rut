/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { act } from 'react-test-renderer';
import matchers from './matchers';
import { render, renderAndWait } from './render';
import mockSyntheticEvent from './mocks/event';

export * from './helpers';
export * from './types';

export { act, matchers, mockSyntheticEvent, render, renderAndWait };
