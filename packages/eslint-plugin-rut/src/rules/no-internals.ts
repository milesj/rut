import { Rule } from 'eslint';
import { VariableDeclarator } from 'estree';

const RESULT_INTERNALS = [
  'isRutResult',
  'element',
  'renderer',
  'options',
  'updateElement',
  'wrapElement',
];

// const ELEMENT_INTERNALS = ['isRutElement', 'element', 'props'];

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: 'Ban usage of Rut internal APIs.',
      recommended: true,
    },
    messages: {
      noLibImport: 'Do not import internal Rut APIs.',
      noInternalApis: 'Do not use internal Rut APIs.',
    },
  },
  create(context) {
    const resultNames = new Set<string>();

    function isRender(node: VariableDeclarator): boolean {
      return Boolean(
        (node.init &&
          node.init.type === 'CallExpression' &&
          node.init.callee &&
          node.init.callee.type === 'Identifier' &&
          node.init.callee.name === 'render') ||
          (node.init &&
            node.init.type === 'AwaitExpression' &&
            node.init.argument.type === 'CallExpression' &&
            node.init.argument.callee &&
            node.init.argument.callee.type === 'Identifier' &&
            node.init.argument.callee.name === 'renderAndWait'),
      );
    }

    return {
      ImportDeclaration(node) {
        if (
          node.type === 'ImportDeclaration' &&
          node.source.type === 'Literal' &&
          String(node.source.value).startsWith('rut') &&
          String(node.source.value) !== 'rut'
        ) {
          context.report({
            node,
            messageId: 'noLibImport',
          });
        }
      },

      VariableDeclaration(node) {
        if (node.type !== 'VariableDeclaration' || node.declarations.length !== 1) {
          return;
        }

        // render(), renderAndWait()
        const render = node.declarations[0];

        if (isRender(render)) {
          // Destructure
          if (render.id.type === 'ObjectPattern') {
            render.id.properties.forEach(property => {
              if (
                property.key.type === 'Identifier' &&
                RESULT_INTERNALS.includes(property.key.name)
              ) {
                context.report({
                  node: property,
                  messageId: 'noInternalApis',
                });
              }
            });
            // Variable
          } else if (render.id.type === 'Identifier') {
            resultNames.add(render.id.name);
          }
        }
      },

      MemberExpression(node) {
        if (
          resultNames.size === 0 ||
          node.type !== 'MemberExpression' ||
          (node.object.type === 'Identifier' && !resultNames.has(node.object.name))
        ) {
          return;
        }

        if (node.property.type === 'Identifier' && RESULT_INTERNALS.includes(node.property.name)) {
          context.report({
            node,
            messageId: 'noInternalApis',
          });
        }
      },
    };
  },
};

export default rule;
