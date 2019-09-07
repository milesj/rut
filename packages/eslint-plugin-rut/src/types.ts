import { Node as OriginalNode } from 'estree';

declare module 'estree' {
  interface BaseNode {
    parent?: OriginalNode;
    typeParameters?: unknown;
  }

  export interface JSXAttribute extends BaseNode {
    type: 'JSXAttribute';
    name: JSXIdentifier;
    value: Literal | JSXExpression | null;
  }

  export interface JSXClosingElement extends BaseNode {
    type: 'JSXClosingElement';
    name: JSXTagNameExpression;
  }

  export interface JSXClosingFragment extends BaseNode {
    type: 'JSXClosingFragment';
  }

  export interface JSXElement extends BaseNode {
    type: 'JSXElement';
    openingElement: JSXOpeningElement;
    closingElement: JSXClosingElement | null;
    children: JSXChild[];
  }

  export interface JSXEmptyExpression extends BaseNode {
    type: 'JSXEmptyExpression';
  }

  export interface JSXExpressionContainer extends BaseNode {
    type: 'JSXExpressionContainer';
    expression: Expression | JSXEmptyExpression;
  }

  export interface JSXFragment extends BaseNode {
    type: 'JSXFragment';
    openingFragment: JSXOpeningFragment;
    closingFragment: JSXClosingFragment;
    children: JSXChild[];
  }

  export interface JSXIdentifier extends BaseNode {
    type: 'JSXIdentifier';
    name: string;
  }

  export interface JSXMemberExpression extends BaseNode {
    type: 'JSXMemberExpression';
    object: JSXTagNameExpression;
    property: JSXIdentifier;
  }

  export interface JSXOpeningElement extends BaseNode {
    type: 'JSXOpeningElement';
    selfClosing: boolean;
    name: JSXTagNameExpression;
    attributes: JSXAttribute[];
  }

  export interface JSXOpeningFragment extends BaseNode {
    type: 'JSXOpeningFragment';
  }

  export interface JSXSpreadAttribute extends BaseNode {
    type: 'JSXSpreadAttribute';
    argument: Expression;
  }

  export interface JSXSpreadChild extends BaseNode {
    type: 'JSXSpreadChild';
    expression: Expression | JSXEmptyExpression;
  }

  export interface JSXText extends BaseNode {
    type: 'JSXText';
    value: string;
    raw: string;
  }

  export type JSXChild = JSXElement | JSXExpression | JSXFragment | JSXText;
  export type JSXExpression = JSXEmptyExpression | JSXSpreadChild | JSXExpressionContainer;
  export type JSXTagNameExpression = JSXIdentifier | JSXMemberExpression;
}
