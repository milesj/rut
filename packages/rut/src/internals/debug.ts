/* eslint-disable complexity */

import util from 'util';
import React from 'react';
import { getTypeName, getNodeName } from '../helpers';
import { DebugOptions, TestNode } from '../types';

type Props = TestNode['props'];

interface TreeNode {
  children: (string | TreeNode)[];
  name: string;
  props: string[];
}

const { columns: TERM_WIDTH = 80 } = process.stdout;
const MAX_INLINE_PROPS = 6;
const DEFAULT_OPTIONS: Required<DebugOptions> = {
  groupProps: true,
  hostElements: true,
  keyAndRef: true,
  reactElements: true,
  return: false,
  sortProps: true,
};

function isAllTextNodes(nodes: unknown[]): boolean {
  return nodes.every(node => typeof node === 'string');
}

function isClassInstance(value: unknown): value is Function {
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

function indentAllLines(value: string, indent: string): string {
  return value
    .split('\n')
    .map(line => indent + line)
    .join('\n');
}

function toArray<T>(value?: null | T | T[]): T[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function formatObject(value: object): string {
  // Element
  if (React.isValidElement(value)) {
    return getNodeName(value);

    // DOM element
  } else if ('tagName' in value) {
    return `<${(value as HTMLElement).tagName.toLowerCase()} />`;

    // Ref
  } else if ('current' in value) {
    return formatObject((value as React.RefObject<object>).current!);

    // Arrays, objects, maps, sets, etc
  } else if (
    Array.isArray(value) ||
    value instanceof Map ||
    value instanceof Set ||
    value instanceof RegExp ||
    !isClassInstance(value)
  ) {
    return util.inspect(value, {
      depth: 1,
      maxArrayLength: 5,
    });
  }

  // Class instance
  return `new ${value.constructor.name || 'Class'}()`;
}

function formatProps(names: string[], props: Props, sort: boolean): string[] {
  const output: string[] = [];

  if (sort) {
    names.sort();
  }

  names.forEach(name => {
    const value = props[name];

    if (value === undefined) {
      return;
    } else if (value === true) {
      output.push(name);

      return;
    }

    let propValue;

    // String
    if (typeof value === 'string') {
      propValue = `"${value}"`;

      // Function
    } else if (typeof value === 'function') {
      propValue = `${value.name || 'func'}()`;

      // Objects
    } else if (typeof value === 'object' && !!value) {
      propValue = formatObject(value);

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

function formatTree(node: TreeNode | string, depth: number = 0): string {
  const indent = '  '.repeat(depth);

  if (typeof node === 'string') {
    return `${indent}${node}`;
  }

  if (node.name === 'ROOT') {
    return node.children.map(child => formatTree(child)).join('\n');
  }

  const inlineProps = node.props.join(' ');
  let output = `${indent}<${node.name}`;

  // Determine when to stack props vertically
  const isStacked =
    // Too many props inlined
    node.props.length >= MAX_INLINE_PROPS ||
    // A prop contains new lines (arrays, objects) which are hard to inline correctly
    inlineProps.includes('\n') ||
    // The inline props would wrap to the next line
    inlineProps.length + output.length >= TERM_WIDTH;

  // Stack props vertically
  if (isStacked) {
    output += '\n';
    output += node.props.map(prop => indentAllLines(prop, `${indent}  `)).join('\n');
    output += '\n';

    // Otherwise inline them
  } else if (inlineProps) {
    output += ` ${inlineProps}`;
  }

  // If no children, self close and return
  if (node.children.length === 0) {
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
  if (isAllTextNodes(node.children) && inlineProps.length === 0) {
    output += node.children.join('');

    // Otherwise continue nested indentation
  } else {
    output += '\n';
    output += node.children.map(child => formatTree(child, depth + 1)).join('\n');
    output += `\n${indent}`;
  }

  // Add closing tag
  output += `</${node.name}>`;

  return output;
}

function getKeyAndRef(node: TestNode): Props {
  const props: Props = {};

  if (!node.instance) {
    return props;
  }

  // @ts-ignore Allow internal access
  const { key, ref } = node._fiber || node.instance._reactInternalFiber;

  if (key) {
    props.key = key;
  }

  if (ref) {
    props.ref = ref;
  }

  return props;
}

function getProps(props: Props, internal: Props, options: Required<DebugOptions>): string[] {
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

    if (options.groupProps) {
      if (value === true) {
        truthies.push(key);
      } else if (key.startsWith('on') && typeof value === 'function') {
        handlers.push(key);
      } else {
        all.push(key);
      }
    } else {
      all.push(key);
    }
  });

  return [
    ...formatProps(['key', 'ref'], internal, options.sortProps),
    ...formatProps(truthies, props, options.sortProps),
    ...formatProps(all, props, options.sortProps),
    ...formatProps(handlers, props, options.sortProps),
  ];
}

function buildTree(node: TestNode | string, parent: TreeNode, options: Required<DebugOptions>) {
  // Text node, immediately add to parent
  if (typeof node === 'string') {
    parent.children.push(node);

    return;
  }

  const children = toArray(node.children);

  // Skip elements if option is disabled
  if (
    (typeof node.type === 'string' && !options.hostElements) ||
    (typeof node.type === 'function' && !options.reactElements)
  ) {
    children.forEach(child => {
      buildTree(child, parent, options);
    });

    return;
  }

  // Build new parent and tree
  const tree = {
    children: [],
    name: getTypeName(node.type),
    props: getProps(node.props, options.keyAndRef ? getKeyAndRef(node) : {}, options),
  };

  children.forEach(child => {
    buildTree(child, tree, options);
  });

  parent.children.push(tree);
}

export default function debug(node: TestNode, baseOptions?: DebugOptions): string {
  const options = { ...DEFAULT_OPTIONS, ...baseOptions };
  const tree = {
    children: [],
    name: 'ROOT',
    props: [],
  };

  buildTree(node, tree, options);

  return formatTree(tree);
}
