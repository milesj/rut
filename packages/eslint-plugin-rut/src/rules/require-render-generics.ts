import { Rule } from 'eslint';
import { JSXElement } from 'estree';

const RENDER_NAMES = ['render', 'renderAndWait'];

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: 'Require generics for `render()` and `renderAndWait()` functions.',
      recommended: true,
    },
    messages: {
      missingGeneric: 'Render is missing the `{{name}}` props type generic.',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.type === 'CallExpression' &&
          node.callee.type === 'Identifier' &&
          RENDER_NAMES.includes(node.callee.name)
        ) {
          if (node.arguments.length === 0) {
            return;
          }

          // @ts-ignore
          const element = node.arguments[0] as JSXElement;

          // Not JSX
          if (
            element.type !== 'JSXElement' ||
            element.openingElement.type !== 'JSXOpeningElement' ||
            element.openingElement.name.type !== 'JSXIdentifier'
          ) {
            return;
          }

          const { name } = element.openingElement.name;

          // Don't need generics for host elements
          if (name.match(/^[a-z]/u)) {
            return;
          }

          if (!node.typeParameters) {
            context.report({
              node,
              messageId: 'missingGeneric',
              data: { name },
            });
          }
        }
      },
    };
  },
};

export default rule;
