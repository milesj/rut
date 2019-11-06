import { Rule } from 'eslint';
import { VariableDeclarator } from 'estree';

const RESULT_INTERNALS = new Set([
  'isRutResult',
  'element',
  'renderer',
  'options',
  'updateElement',
  'wrapElement',
]);

const ELEMENT_INTERNALS = new Set(['isRutElement']);

const ELEMENT_NODE_INTERNALS = new Set([
  '_fiber',
  'instance',
  'type',
  'props',
  'parent',
  'children',
  'find',
  'findByType',
  'findByProps',
  'findAll',
  'findAllByType',
  'findAllByProps',
]);

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
          String(node.source.value) !== 'rut' &&
          !String(node.source.value).includes('testing')
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
              if (property.key.type === 'Identifier' && RESULT_INTERNALS.has(property.key.name)) {
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

      // eslint-disable-next-line complexity
      MemberExpression(node) {
        if (node.type !== 'MemberExpression') {
          return;
        }

        // result.<name>
        if (
          resultNames.size > 0 &&
          node.object.type === 'Identifier' &&
          resultNames.has(node.object.name) &&
          node.property.type === 'Identifier' &&
          RESULT_INTERNALS.has(node.property.name)
        ) {
          context.report({
            node,
            messageId: 'noInternalApis',
          });
        }

        // element.element.<name>
        // findOne().element.<name>
        if (
          node.property.type === 'Identifier' &&
          ELEMENT_NODE_INTERNALS.has(node.property.name) &&
          node.object.type === 'MemberExpression' &&
          node.object.property.type === 'Identifier' &&
          node.object.property.name === 'element'
        ) {
          context.report({
            node: node.object.property,
            messageId: 'noInternalApis',
          });
        }
      },

      Identifier(node) {
        if (node.type === 'Identifier' && ELEMENT_INTERNALS.has(node.name)) {
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
