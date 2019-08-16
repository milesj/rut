import React from 'react';
import ReactIs from 'react-is';

export function isReactComponent(value: unknown): value is React.ComponentType {
  return typeof value === 'function';
}

export function isReactNodeLike(
  value: unknown,
): value is { $$typeof: symbol | number; type?: Function; render?: Function } {
  return typeof value === 'object' && !!value && '$$typeof' in value;
}

export function getElementTypeName(type: unknown): string {
  if (!type) {
    return 'UNKNOWN';
  }

  if (isReactComponent(type)) {
    return type.displayName || type.name;
  }

  if (isReactNodeLike(type)) {
    if (ReactIs.isForwardRef(type)) {
      return 'ForwardRef';
    }

    if (ReactIs.isFragment(type)) {
      return 'Fragment';
    }

    if (ReactIs.isMemo(type)) {
      return `Memo(${getElementTypeName(type.type)}`;
    }
  }

  return String(type);
}
