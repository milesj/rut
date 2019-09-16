/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { matchers, unmockFetches, MatchResult } from 'rut';
import serializer from './serializer';

const jestMatchers: jest.ExpectExtendMap = {};

Object.entries(matchers).forEach(([name, matcher]) => {
  jestMatchers[name] = function jestMatcher(this: jest.MatcherUtils, ...args: unknown[]) {
    const result: MatchResult = (matcher as Function).call(this, ...args);
    const message = (this.isNot ? result.notMessage : result.message)
      .replace('{{received}}', this.utils.printReceived(result.received))
      .replace('{{expected}}', result.expected ? this.utils.printExpected(result.expected) : '')
      .replace('{{actual}}', result.actual ? String(result.actual) : '');

    return {
      message: () => `${this.utils.matcherHint(result.name)}\n\n${message}`,
      pass: typeof result.passed === 'function' ? result.passed(this.equals) : result.passed,
    };
  };
});

expect.extend(jestMatchers);
expect.addSnapshotSerializer(serializer);

afterEach(unmockFetches);

export default jestMatchers;
