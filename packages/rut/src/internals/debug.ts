/* eslint-disable complexity, @typescript-eslint/no-use-before-define, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */

import React from 'react';
import { DebugOptions, ElementType, TestNode } from '../types';
import { globalOptions } from './config';
import { getTypeName } from './react';
import { isAllTextNodes, isClassInstance, toArray } from './utils';

type Props = TestNode['props'];
type Formatter<T = any> = (value: T, depth: number) => string;

interface TreeNode {
  children: (TreeNode | string)[];
  name: string;
  props: string[];
}

const { toString } = Object.prototype;
const { columns: TERM_WIDTH = 80 } = process.stdout;
const INDENT_CHARS = '  ';
const MAX_INLINE_PROPS = 6;

function getLongestItem(values: string[]): number {
  return values.reduce((longest, value) => (value.length > longest ? value.length : longest), 0);
}

function indentAllLines(value: string, indent: string): string {
  return value
    .split('\n')
    .map((line) => indent + line)
    .join('\n');
}

class Debugger {
  currentDepth: number = 0;

  node: TestNode;

  options: DebugOptions;

  root: TreeNode;

  types: { [key: string]: Formatter };

  constructor(node: TestNode, options?: DebugOptions) {
    this.node = node;

    this.options = {
      children: true,
      falsy: false,
      groupProps: true,
      hostElements: true,
      keyAndRef: true,
      log: true,
      maxLength: 5,
      reactElements: true,
      sortProps: true,
      ...globalOptions,
      ...options,
    };

    this.types = {
      '[object Array]': this.formatArray,
      '[object AsyncFunction]': this.formatAsyncFunction,
      '[object Boolean]': this.formatPrimitive,
      '[object Date]': this.formatDate,
      '[object Error]': this.formatError,
      '[object Function]': this.formatFunction,
      '[object Map]': this.formatMap,
      '[object Null]': this.formatPrimitive,
      '[object Number]': this.formatPrimitive,
      '[object Object]': this.formatObject,
      '[object RegExp]': this.formatRegExp,
      '[object Set]': this.formatSet,
      '[object String]': this.formatString,
      '[object Symbol]': this.formatSymbol,
      '[object Undefined]': this.formatPrimitive,
    };

    this.root = this.buildTree(node, {
      children: [],
      name: 'ROOT',
      props: [],
    });
  }

  buildTree(node: TestNode | string, parent: TreeNode): TreeNode {
    const {
      excludeComponents,
      hostElements,
      keyAndRef,
      children: includeChildren,
      reactElements,
    } = this.options;

    if (!includeChildren && parent.name !== 'ROOT') {
      return parent;
    }

    // Text node, immediately add to parent
    if (typeof node === 'string') {
      parent.children.push(node);

      return parent;
    }

    const children = toArray(node.children);

    // Skip elements if option is disabled
    if (
      (typeof node.type === 'string' && !hostElements) ||
      (typeof node.type === 'function' && !reactElements)
    ) {
      children.forEach((child) => {
        this.buildTree(child, parent);
      });

      return parent;
    }

    // Build new parent and tree
    const name = getTypeName(node.type);

    if (excludeComponents instanceof RegExp && name.match(excludeComponents)) {
      return parent;
    }

    const tree = {
      children: [],
      name,
      props: this.getProps(node.props, keyAndRef ? this.getKeyAndRef(node) : {}),
    };

    children.forEach((child) => {
      this.buildTree(child, tree);
    });

    parent.children.push(tree);

    return parent;
  }

  format = (value: any, depth: number = 0): string => {
    const type = toString.call(value);

    // React element
    if (React.isValidElement(value)) {
      return debugFromElement(value, { ...this.options, children: false, log: false });
    }

    // Built-in type
    if (this.types[type]) {
      return this.types[type](value, depth).trim();
    }

    // DOM element
    if (type.endsWith('Element]')) {
      return this.formatElement(value as HTMLElement);
    }

    // Custom class instance
    if (isClassInstance(value)) {
      return `new ${value.constructor.name || 'Class'}()`;
    }

    // Unknown, so cast to string
    return String(value);
  };

  formatArray = (value: any[], depth: number) =>
    this.transformList(value, this.format, '[', ']', depth);

  formatAsyncFunction = (value: Function) => `async ${this.formatFunction(value)}`;

  formatDate = (value: Date) => `new Date('${value.toISOString()}')`;

  formatElement = (value: Element) => `<${value.tagName.toLowerCase()} />`;

  formatError = (value: Error) => `new Error('${value.message}')`;

  formatFunction = (value: Function) => `${value.name || 'func'}()`;

  formatMap = (value: Map<any, any>, depth: number) =>
    this.transformList(
      Array.from(value.entries()),
      ([key, val], nextDepth) => `${key}: ${this.format(val, nextDepth)}`,
      'new Map({',
      '})',
      depth,
    );

  formatObject = (value: { [key: string]: any }, depth: number) => {
    // React refs
    if ('current' in value) {
      return this.format((value as React.RefObject<object>).current!);
    }

    // DOM elements
    if ('tagName' in value) {
      return this.formatElement(value as HTMLElement);
    }

    // Custom class instance
    if (isClassInstance(value)) {
      return `new ${value.constructor.name || 'Class'}()`;
    }

    // Plain objects
    return this.transformList(
      Object.entries(value),
      ([key, val], nextDepth) => `${key}: ${this.format(val, nextDepth)}`,
      '{',
      '}',
      depth,
    );
  };

  formatRegExp = (value: RegExp) => `/${value.source}/${value.flags}`;

  formatSet = (value: Set<any>, depth: number) =>
    this.transformList(Array.from(value), this.format, 'new Set([', '])', depth);

  formatString = (value: string) => `"${value}"`;

  formatSymbol = () => `Symbol()`;

  formatPrimitive = (value: unknown) => String(value);

  getKeyAndRef(node: TestNode): Props {
    const props: Props = {};

    if (!node.instance) {
      return props;
    }

    // @ts-expect-error Allow internal access
    const { key, ref } = node._fiber || node.instance._reactInternalFiber;

    if (key) {
      props.key = key;
    }

    if (ref) {
      props.ref = ref;
    }

    return props;
  }

  getProps(props: Props, internal: Props): string[] {
    const { excludeProps, falsy, groupProps } = this.options;
    const all: string[] = [];
    const truthies: string[] = [];
    const handlers: string[] = [];

    Object.entries(props).forEach(([key, value]) => {
      if (key === 'children') {
        return;
      }

      if (excludeProps instanceof RegExp && key.match(excludeProps)) {
        return;
      }

      if (!falsy && (value === false || value === null || value === undefined)) {
        return;
      }

      if (groupProps) {
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
      ...this.transformProps(['key', 'ref'], internal),
      ...this.transformProps(truthies, props),
      ...this.transformProps(all, props),
      ...this.transformProps(handlers, props),
    ];
  }

  transformList<T>(
    values: T[],
    format: Formatter<T>,
    openChar: string,
    closeChar: string,
    depth: number = 0,
  ): string {
    if (values.length === 0) {
      return openChar + closeChar;
    }

    const { maxLength = 0 } = this.options;
    const items = values.slice(0, maxLength).map((value) => format(value, depth + 1));

    if (values.length > maxLength) {
      items.push(`... ${values.length - maxLength} more`);
    }

    const rootIndent = INDENT_CHARS.repeat(this.currentDepth);
    const stackIndent = INDENT_CHARS.repeat(depth + 1);
    const stackedItems = items.map((item) => stackIndent + item);
    const inlineItems = items.join(', ');

    // Items are too long, stack vertically
    if (
      rootIndent.length + getLongestItem(stackedItems) > TERM_WIDTH ||
      rootIndent.length + inlineItems.length > TERM_WIDTH
    ) {
      return [
        stackIndent + openChar,
        `${stackedItems.join(',\n')},`,
        stackIndent.slice(2) + closeChar,
      ].join('\n');
    }

    return `${openChar} ${inlineItems} ${closeChar}`;
  }

  transformNode(node: TreeNode | string, depth: number = 0): string {
    this.currentDepth = depth;

    const indent = INDENT_CHARS.repeat(depth);

    if (typeof node === 'string') {
      return `${indent}${node}`;
    }

    if (node.name === 'ROOT') {
      return node.children.map((child) => this.transformNode(child)).join('\n');
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
      output += node.props.map((prop) => indentAllLines(prop, `${indent}  `)).join('\n');
      output += '\n';

      // Otherwise inline them
    } else if (inlineProps) {
      output += ` ${inlineProps}`;
    }

    // If no children, self close and return
    if (node.children.length === 0) {
      output += isStacked ? `${indent}/>` : ' />';

      return output;
    }

    // Otherwise finish opening tag
    output += isStacked ? `${indent}>` : '>';

    // Inline if only text with no props
    if (isAllTextNodes(node.children) && inlineProps.length === 0) {
      output += node.children.join('');

      // Otherwise continue nested indentation
    } else {
      output += '\n';
      output += node.children.map((child) => this.transformNode(child, depth + 1)).join('\n');
      output += `\n${indent}`;
    }

    // Add closing tag
    output += `</${node.name}>`;

    return output;
  }

  transformProps(names: string[], props: Props): string[] {
    const output: string[] = [];

    if (this.options.sortProps) {
      names.sort();
    }

    names.forEach((name) => {
      const value = props[name];

      if (value === undefined) {
        return;
      } else if (value === true) {
        output.push(name);

        return;
      }

      const propValue = this.format(value);

      if (propValue.charAt(0) === '"') {
        output.push(`${name}=${propValue}`);
      } else {
        output.push(`${name}={${propValue}}`);
      }
    });

    return output;
  }

  toString(): string {
    return this.transformNode(this.root);
  }
}

export function debug(node: TestNode, options?: DebugOptions): string {
  const inst = new Debugger(node, options);
  const output = inst.toString();

  // istanbul ignore next
  if (inst.options.log) {
    // eslint-disable-next-line no-console
    console.log(output);
  }

  return output;
}

export function debugFromElement(element: React.ReactElement, options?: DebugOptions): string {
  const { children = [], ...props } = element.props;

  return debug(
    {
      children,
      instance: null,
      parent: null,
      props,
      type: element.type as ElementType,
    },
    options,
  );
}
