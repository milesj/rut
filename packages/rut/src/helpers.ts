import React from 'react';

export function getTypeName(type: React.ElementType): string {
  if (typeof type === 'function') {
    return type.displayName || type.name;
  }

  return type || 'UNKNOWN';
}
