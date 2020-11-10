import { mockSyntheticEvent, render, renderAndWait } from '../src/testing/helpers';
import { runElementTestSuite } from '../src/testing/suites/element';

runElementTestSuite('Element', {
  mockSyntheticEvent,
  render,
  renderAndWait,
});
