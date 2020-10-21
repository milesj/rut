import RutElement from '../src/Element';
import { runElementTestSuite } from '../src/testing/suites/element';
import { mockSyntheticEvent, render, renderAndWait } from '../src/testing/helpers';

runElementTestSuite('Element', {
  Element: RutElement,
  mockSyntheticEvent,
  render,
  renderAndWait,
});
