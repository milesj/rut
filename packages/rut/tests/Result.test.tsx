import { runResultTestSuite } from '../src/testing/suites/result';
import { mockSyntheticEvent, render, renderAndWait } from '../src/testing/helpers';

runResultTestSuite({
  mockSyntheticEvent,
  render,
  renderAndWait,
});
