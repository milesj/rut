import React from 'react';
import { getTypeName, Element } from 'rut';
import checkIsRutElement from './checkIsRutElement';

export default function toBeElementType(
  this: jest.MatcherUtils,
  received: Element,
  type: React.ElementType,
) {
  checkIsRutElement('toBeElementType', received);

  const receivedName = getTypeName(received.type());
  const expectedName = getTypeName(type);

  if (received.type() === type) {
    return {
      message: () => `expected \`${receivedName}\` not to be a \`${expectedName}\``,
      pass: true,
    };
  }

  return {
    message: () => `expected \`${receivedName}\` to be a \`${expectedName}\``,
    pass: false,
  };
}
