// eslint-disable-next-line import/no-unresolved
import { Node } from 'estree';

declare module 'estree' {
  interface BaseNode {
    parent?: Node;
  }
}
