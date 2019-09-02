import React from 'react';
import Element from '../Element';
import { checkIsRutElement, getTestInstanceFromElement } from '../internals/helpers';
import { formatValue } from '../helpers';
import { MatchResult } from '../types';

/**
 * Check that an element has a React `key` that matches the provided value.
 */
export default function toHaveKey(element: Element, value: React.Key): MatchResult {
  checkIsRutElement(element);

  const { key } = getTestInstanceFromElement(element)._fiber;
  const formattedValue = formatValue(value);

  return {
    message: `expected \`${element}\` to have a ${formattedValue} key`,
    notMessage: `expected \`${element}\` not to have a ${formattedValue} key`,
    passed: key !== null && key === value,
  };
}
