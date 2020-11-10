import { runResultTestSuite } from 'rut/lib/testing/suites/result';
import { mockSyntheticEvent, render, renderAndWait } from '../src';

runResultTestSuite({
  mockSyntheticEvent,
  render,
  renderAndWait,
});
