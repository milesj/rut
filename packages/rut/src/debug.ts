import util from 'util';
import React from 'react';
import { ReactTestRendererTree as Node } from 'react-test-renderer';
import { getTypeName, getNodeName } from './helpers';

type Props = Node['props'];

const MAX_INLINE_PROPS = 10;

function toArray<T>(value?: null | T | T[]): T[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function sortAndFormatProps(names: string[], props: Props): string[] {
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

    // String
    if (typeOf === 'string') {
      propValue = `"${value}"`;

      // Function
    } else if (typeOf === 'function') {
      propValue = `${value.name || 'func'}()`;

      // Objects
    } else if (typeOf === 'object' && !!value) {
      // Element
      if (React.isValidElement(value)) {
        propValue = getNodeName(value);

        // Ref
      } else if ('current' in value) {
        propValue = getTypeName(value.current);

        // Arrays, objects, maps, sets, etc
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

      // Everything else
    } else {
      propValue = String(value);
    }

    if (propValue.startsWith('"')) {
      output.push(`${name}=${propValue}`);
    } else {
      output.push(`${name}={${propValue}}`);
    }
  });

  return output;
}

function getKeyAndRef(node: Node): Props {
  const props: Props = {};

  if (!node.instance) {
    return props;
  }

  // @ts-ignore Allow internal access
  const { key, ref } = node.instance._reactInternalFiber;

  if (key) {
    props.key = key;
  }

  if (ref) {
    props.ref = ref;
  }

  return props;
}

function getProps(props: Props, internal: Props): string[] {
  if (!props || typeof props !== 'object') {
    return [];
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

  return [
    ...sortAndFormatProps(['key', 'ref'], internal),
    ...sortAndFormatProps(truthies, props),
    ...sortAndFormatProps(all, props),
    ...sortAndFormatProps(handlers, props),
  ];
}

function isAllTextNodes(nodes: unknown[]): boolean {
  return nodes.every(node => typeof node === 'string');
}

export default function debug(node: Node | string | null, depth: number = 0): string {
  if (!node) {
    return '';
  }

  const indent = '  '.repeat(depth);

  // Text node, return immediately
  if (typeof node === 'string') {
    return `${indent}${node}`;
  }

  const nodes = toArray(node.rendered);
  const name = getTypeName(node.type);
  const props = getProps(node.props, getKeyAndRef(node));
  const inlineProps = props.join(' ');
  const isStacked =
    props.length >= MAX_INLINE_PROPS || inlineProps.length >= process.stdout.columns!;
  let output = `${indent}<${name}`;

  // Stack vertically when props exceed the limit or terminal width
  if (isStacked) {
    output += '\n';
    output += props.map(prop => indent + indent + prop).join('\n');
    output += '\n';

    // Otherwise inline them
  } else if (inlineProps) {
    output += ` ${inlineProps}`;
  }

  // If no children, self close and return
  if (nodes.length === 0) {
    if (isStacked) {
      output += `${indent}/>`;
    } else {
      output += ' />';
    }

    return output;
  }

  // Otherwise finish opening tag
  if (isStacked) {
    output += `${indent}>`;
  } else {
    output += '>';
  }

  // Inline if only text with no props
  if (isAllTextNodes(nodes) && props.length === 0) {
    output += nodes.join('');

    // Otherwise continue nested indentation
  } else {
    output += '\n';
    output += nodes.map(child => debug(child, depth + 1)).join('\n');
    output += `\n${indent}`;
  }

  output += `</${name}>`;

  return output;
}
