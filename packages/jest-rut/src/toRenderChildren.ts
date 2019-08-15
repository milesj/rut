import React from 'react';
import { getTypeName, Element } from 'rut';
import checkIsRutElement from './checkIsRutElement';

export default function toRenderChildren(
  this: jest.MatcherUtils,
  received: Element,
  node: React.ReactNode,
) {
  checkIsRutElement('toRenderChildren', received);

  const receivedName = getTypeName(received.type());

  if (received.children().length > 0) {
    return {
      message: () => `expected \`${receivedName}\` not to render children`,
      pass: true,
    };
  }

  return {
    message: () => `expected \`${receivedName}\` to render children`,
    pass: false,
  };
}
