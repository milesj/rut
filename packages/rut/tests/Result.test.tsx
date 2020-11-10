import { mockSyntheticEvent, render, renderAndWait } from '../src/testing/helpers';
import { runResultTestSuite } from '../src/testing/suites/result';

runResultTestSuite({
  mockSyntheticEvent,
  render,
  renderAndWait,
});
