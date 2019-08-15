import { Element } from 'rut';

export default function isRutElement(value: unknown): value is Element {
  return (
    value instanceof Element ||
    (typeof value === 'object' && value !== null && value.constructor.name === 'RutElement')
  );
}
