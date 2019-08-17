import Element from '../Element';
import { checkIsRutElement } from '../helpers';
import { MatchResult } from '../types';

/**
 * Check that an element has a prop by name defined, with optional value matching support.
 */
export default function toHaveProp(element: Element, name: string, value?: unknown): MatchResult {
  checkIsRutElement(element);

  const prop = element.prop(name);

  if (value !== undefined) {
    return {
      message: `expected \`${element}\` to have a "${name}" prop with a value of ${value}`,
      notMessage: `expected \`${element}\` not to have a "${name}" prop with a value of ${value}`,
      passed: prop === value,
    };
  }

  return {
    message: `expected \`${element}\` to have a "${name}" prop`,
    notMessage: `expected \`${element}\` not to have a "${name}" prop`,
    passed: prop !== undefined,
  };
}
