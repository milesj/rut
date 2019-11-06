import { runElementTestSuite } from '../src/testing/suites/element';
import { mockSyntheticEvent, render, renderAndWait } from '../src/testing/helpers';

runElementTestSuite('Element', {
  mockSyntheticEvent,
  render,
  renderAndWait,
});
