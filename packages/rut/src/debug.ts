import { ReactTestRendererTree } from 'react-test-renderer';
import { getTypeName } from './helpers';

export function formatValue(value: unknown): string {
  const typeOf = typeof value;

  if (typeOf === 'string') {
    return `"${value}"`;
  } else if (typeOf === 'number' || typeOf === 'boolean' || value === null) {
    return String(value);
  }

  return `\`${String(value)}\``;
}

function sortAndFormatProps(names: string[], props: ReactTestRendererTree['props']): string[] {
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
      propValue = '(function)';
    } else if (typeOf === 'object') {
      console.log({ name, typeOf, value });

      if ('current' in value) {
        propValue = `(${getTypeName(value.current)})`;
      } else {
        propValue = 'TODO';
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

function formatProps(props: ReactTestRendererTree['props']): string {
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
    ...sortAndFormatProps(truthies, props),
    ...sortAndFormatProps(all, props),
    ...sortAndFormatProps(handlers, props),
  ];

  return output.length === 0 ? '' : ` ${output.join(' ')}`;
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

  const name = getTypeName(node.type);
  const props = formatProps(node.props);

  if (!node.rendered) {
    return `${indent}<${name}${props} />`;
  }

  const nodes: ReactTestRendererTree[] = Array.isArray(node.rendered)
    ? node.rendered
    : [node.rendered];
  const children = nodes.map(child => debug(child, depth + 1));

  return `${indent}<${name}${props}>\n${children.join('\n')}\n${indent}</${name}>`;
}
