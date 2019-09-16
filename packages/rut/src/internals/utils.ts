import assert from 'assert';
import Element from '../Element';

export function deepEqual(a: unknown, b: unknown): boolean {
  try {
    assert.deepStrictEqual(a, b);

    return true;
  } catch {
    return false;
  }
}

export function isAllTextNodes(nodes: unknown[]): boolean {
  return nodes.every(node => typeof node === 'string');
}

export function isClassInstance(value: unknown): value is Function {
  if (typeof value !== 'object' || !value) {
    return false;
  }

  let ctor = value.constructor;

  while (ctor) {
    if (ctor === Function) {
      return true;
    } else if (ctor === Object) {
      return false;
    }

    ctor = ctor.constructor;
  }

  return false;
}

export function isRutElement(value: unknown) {
  if (value instanceof Element) {
    return;
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    // @ts-ignore Allow access
    (value.constructor.name === 'Element' || (value as Element).isRutElement === true)
  ) {
    return;
  }

  throw new Error('Expected a Rut `Element`.');
}

export function toArray<T>(value?: null | T | T[]): T[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}
