import { runResultTestSuite } from 'rut/lib/testing/suites/result';
import { render, renderAndWait, mockSyntheticEvent } from '../src';

runResultTestSuite({
  mockSyntheticEvent,
  render,
  renderAndWait,
});
