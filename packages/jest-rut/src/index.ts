/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { matchers, unmockFetches } from 'rut';
import serializer from './serializer';

const jestMatchers: jest.ExpectExtendMap = {};

Object.entries(matchers).forEach(([name, matcher]) => {
  jestMatchers[name] = function jestMatcher(this: jest.MatcherUtils, ...args: unknown[]) {
    const result = (matcher as Function).call(this, ...args);
    const message = this.isNot ? result.notMessage : result.message;

    return {
      message: () => message,
      pass: result.passed,
    };
  };
});

expect.extend(jestMatchers);
expect.addSnapshotSerializer(serializer);

afterEach(unmockFetches);

export default jestMatchers;
