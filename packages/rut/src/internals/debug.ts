/* eslint-disable complexity, no-use-before-define, @typescript-eslint/no-use-before-define */

import util from 'util';
import React from 'react';
import { isAllTextNodes, isClassInstance, toArray } from './utils';
import { getTypeName } from '../helpers';
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
  noChildren: false,
  reactElements: true,
  return: false,
  sortProps: true,
};

function indentAllLines(value: string, indent: string): string {
  return value
    .split('\n')
    .map(line => indent + line)
    .join('\n');
}

function formatObject(value: object): string {
  // DOM element
  if ('tagName' in value) {
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

function formatProps(names: string[], props: Props, options: Required<DebugOptions>): string[] {
  const output: string[] = [];

  if (options.sortProps) {
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
      propValue = React.isValidElement(value)
        ? debugFromElement(value, { ...options, noChildren: true })
        : formatObject(value);

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
    ...formatProps(['key', 'ref'], internal, options),
    ...formatProps(truthies, props, options),
    ...formatProps(all, props, options),
    ...formatProps(handlers, props, options),
  ];
}

function buildTree(node: TestNode | string, parent: TreeNode, options: Required<DebugOptions>) {
  if (options.noChildren && parent.name !== 'ROOT') {
    return;
  }

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

export function debug(node: TestNode, options?: DebugOptions): string {
  const tree = {
    children: [],
    name: 'ROOT',
    props: [],
  };

  buildTree(node, tree, { ...DEFAULT_OPTIONS, ...options });

  return formatTree(tree);
}

export function debugFromElement(element: React.ReactElement, options?: DebugOptions): string {
  const { children, ...props } = element.props;

  return debug(
    {
      children,
      instance: null,
      parent: null,
      props,
      type: element.type as React.ElementType,
    },
    options,
  );
}
