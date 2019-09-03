import { Node } from 'estree';

declare module 'estree' {
  interface BaseNode {
    parent?: Node;
  }
}
