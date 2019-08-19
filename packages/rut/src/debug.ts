import util from 'util';
import React from 'react';
import { ReactTestRendererTree } from 'react-test-renderer';
import { getTypeName, shallowEqual } from './helpers';

export function formatValue(value: unknown): string {
  const typeOf = typeof value;

  if (typeOf === 'string') {
    return `"${value}"`;
  } else if (
    typeOf === 'number' ||
    typeOf === 'boolean' ||
    value === null ||
    value instanceof RegExp
  ) {
    return String(value);
  }

  return `\`${String(value)}\``;
}

function toArray<T>(value?: null | T | T[]): T[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function findMatchingNodeProp(
  nodes: ReactTestRendererTree[],
  element: React.ReactElement,
): ReactTestRendererTree | null {
  return (
    nodes.find(node => {
      if (node.type === element.type && shallowEqual(node.props, element.props)) {
        return node;
      }

      if (node.rendered) {
        return findMatchingNodeProp(toArray(node.rendered), element);
      }

      return undefined;
    }) || null
  );
}

function sortAndFormatProps(
  names: string[],
  props: ReactTestRendererTree['props'],
  nodes: ReactTestRendererTree[],
): string[] {
  const output: string[] = [];

  names.sort().forEach(name => {
    const value = props[name];
    const typeOf = typeof value;

    if (value === undefined) {
      return;
    } else if (value === true) {
      output.push(name);

      return;
    }

    let propValue;

    if (typeOf === 'string') {
      propValue = `"${value}"`;
    } else if (typeOf === 'function') {
      propValue = `${value.name || 'func'}()`;
    } else if (typeOf === 'object') {
      console.log({ name, typeOf, value });

      // Element
      if (React.isValidElement(value)) {
        // eslint-disable-next-line
        propValue = debug(findMatchingNodeProp(nodes, value));
        // Ref
      } else if ('current' in value) {
        propValue = getTypeName(value.current);
        // Arrays, objects, maps, sets
      } else {
        propValue = util
          .inspect(value, {
            depth: 1,
            maxArrayLength: 5,
          })
          .replace(/\{ /gu, '{')
          .replace(/\[ /gu, '[')
          .replace(/ \}/gu, '}')
          .replace(/ \]/gu, ']');
      }
    } else {
      propValue = formatValue(value);
    }

    if (propValue.startsWith('"')) {
      output.push(`${name}=${propValue}`);
    } else {
      output.push(`${name}={${propValue}}`);
    }
  });

  return output;
}

function formatProps(
  props: ReactTestRendererTree['props'],
  nodes: ReactTestRendererTree[],
): string {
  if (!props || typeof props !== 'object') {
    return '';
  }

  const all: string[] = [];
  const truthies: string[] = [];
  const handlers: string[] = [];

  Object.entries(props).forEach(([key, value]) => {
    if (key === 'children') {
      return;
    }

    if (value === true) {
      truthies.push(key);
    } else if (key.startsWith('on') && typeof value === 'function') {
      handlers.push(key);
    } else {
      all.push(key);
    }
  });

  const output = [
    ...sortAndFormatProps(truthies, props, nodes),
    ...sortAndFormatProps(all, props, nodes),
    ...sortAndFormatProps(handlers, props, nodes),
  ];

  return output.length === 0 ? '' : ` ${output.join(' ')}`;
}

function isAllTextNodes(nodes: unknown[]): boolean {
  return nodes.every(node => typeof node === 'string');
}

export default function debug(
  node: ReactTestRendererTree | string | null,
  depth: number = 0,
): string {
  if (!node) {
    return '';
  }

  const indent = '  '.repeat(depth);

  if (typeof node === 'string') {
    return `${indent}${node}`;
  }

  const nodes: ReactTestRendererTree[] = toArray(node.rendered);
  const name = getTypeName(node.type);
  const props = formatProps(node.props, nodes);

  if (nodes.length === 0) {
    return `${indent}<${name}${props} />`;
  }

  let children = '';

  // Inline if only text with no props
  if (isAllTextNodes(nodes) && props === '') {
    children = nodes.join('');
    // Otherwise continue nested indentation
  } else {
    children = `\n${nodes.map(child => debug(child, depth + 1)).join('\n')}\n${indent}`;
  }

  return `${indent}<${name}${props}>${children}</${name}>`;
}
