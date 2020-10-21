import assert from 'assert';

export function deepEqual(a: unknown, b: unknown): boolean {
  try {
    assert.deepStrictEqual(a, b);

    return true;
  } catch {
    return false;
  }
}

export function isAllTextNodes(nodes: unknown[]): boolean {
  return nodes.every((node) => typeof node === 'string');
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
  if (
    typeof value === 'object' &&
    value !== null &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (value.constructor.name.endsWith('Element') || (value as any).isRutElement === true)
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
