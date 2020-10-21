/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { configure, integrate } from './internals/config';
import BaseEvent from './BaseEvent';
import SyntheticEvent from './SyntheticEvent';
import AsyncResult from './AsyncResult';
import SyncResult from './SyncResult';
import Element from './Element';
import Result from './Result';
import matchers from './matchers';

export * from './adapters';
export * from './predicates';
export * from './mocks';
export * from './types';

export {
  configure,
  integrate,
  matchers,
  BaseEvent,
  SyntheticEvent,
  Element,
  Result,
  SyncResult,
  AsyncResult,
};
