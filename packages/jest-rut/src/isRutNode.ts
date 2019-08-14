import { Node } from 'rut';

export default function isRutNode(value: unknown): value is Node {
  return (
    value instanceof Node ||
    (typeof value === 'object' && value !== null && value.constructor.name === 'RutNode')
  );
}
