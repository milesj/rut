import { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: 'Ban usage of `act()`.',
      recommended: true,
    },
    messages: {
      noActSync: 'Use `render()`, `update()`, or `dispatch()` instead of `act()`.',
      noActAsync:
        'Use `await renderAndWait()`, `await updateAndWait()`, or `await dispatchAndWait()` instead of `await act()`.',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.type === 'CallExpression' &&
          node.callee.type === 'Identifier' &&
          node.callee.name === 'act'
        ) {
          context.report({
            node,
            messageId:
              node.parent && node.parent.type === 'AwaitExpression' ? 'noActAsync' : 'noActSync',
          });
        }
      },
    };
  },
};

export default rule;
