import { runResultTestSuite } from 'rut/test';
import { render, renderAndWait, mockSyntheticEvent, DomElement } from '../src';

runResultTestSuite({
  Element: DomElement,
  mockSyntheticEvent,
  render,
  renderAndWait,
});
