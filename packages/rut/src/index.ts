/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { configure } from './configure';
import matchers from './matchers';
import { render, renderAndWait } from './render';
import BaseElement from './Element';
import BaseResult from './Result';
import { StructureOf } from './types';

export * from './helpers';
export * from './mocks';
export * from './predicates';
export * from './types';

export { configure, matchers, render, renderAndWait };

// We don't want to export the classes, only the types
export type Element<T> = StructureOf<BaseElement<T>>;
export type Result<T> = StructureOf<BaseResult<T>>;
