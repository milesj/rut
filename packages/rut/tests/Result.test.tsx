import RutElement from '../src/Element';
import { runResultTestSuite } from '../src/testing/suites/result';
import { mockSyntheticEvent, render, renderAndWait } from '../src/testing/helpers';

runResultTestSuite({
  Element: RutElement,
  mockSyntheticEvent,
  render,
  renderAndWait,
});
