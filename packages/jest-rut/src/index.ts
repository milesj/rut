/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import toBeElementType from './toBeElementType';
import toContainNode from './toContainNode';
import toRenderChildren from './toRenderChildren';

const matchers = { toBeElementType, toContainNode, toRenderChildren };

expect.extend(matchers);

export default matchers;
