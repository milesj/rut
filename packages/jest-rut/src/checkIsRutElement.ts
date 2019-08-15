import { Element } from 'rut';

export default function checkIsRutElement(matcher: string, value: unknown) {
  if (
    value instanceof Element ||
    (typeof value === 'object' && value !== null && value.constructor.name === 'RutElement')
  ) {
    return;
  }

  throw new Error(`${matcher}: Expected a \`RutElement\`.`);
}
