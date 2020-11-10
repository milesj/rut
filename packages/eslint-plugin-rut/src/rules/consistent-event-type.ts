import { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: 'Enforce the correct event types when mocking.',
      recommended: true,
    },
    messages: {
      hostEventType: 'Event type must *not* start with "on" and must be all lowercase.',
      mismatchEventType:
        'Mocked event type must match the type being dispatched, which is `{{type}}`.',
      noEventType: 'Event type is required. None found.',
      syntheticEventType: 'Event type must start with "on" and be in camelcase.',
    },
  },
  create(context) {
    return {
      // eslint-disable-next-line complexity
      CallExpression(node) {
        if (
          node.type !== 'CallExpression' ||
          node.callee.type !== 'Identifier' ||
          node.arguments.length === 0 ||
          node.arguments[0].type !== 'Literal'
        ) {
          return;
        }

        const { name } = node.callee;
        const arg = node.arguments[0];
        const type = String(arg.value);

        // mockEvent()
        if (name === 'mockEvent' && (type.startsWith('on') || type.toLowerCase() !== type)) {
          context.report({
            node: arg,
            messageId: 'hostEventType',
          });
        }

        // mockSyntheticEvent(), dispatch()
        if (
          (name === 'mockSyntheticEvent' || name === 'dispatch' || name === 'dispatchAndWait') &&
          (!type.startsWith('on') || type.toLowerCase() === type)
        ) {
          context.report({
            node: arg,
            messageId: 'syntheticEventType',
          });
        }

        // dispatch() with event mock
        if (
          (name === 'dispatch' || name === 'dispatchAndWait') &&
          node.arguments.length >= 2 &&
          node.arguments[1].type === 'CallExpression'
        ) {
          const mock = node.arguments[1];

          if (
            mock.callee.type === 'Identifier' &&
            mock.callee.name === 'mockSyntheticEvent' &&
            mock.arguments.length > 0 &&
            mock.arguments[0].type === 'Literal' &&
            String(mock.arguments[0].value) !== type
          ) {
            context.report({
              node: mock.arguments[0],
              messageId: 'mismatchEventType',
              data: { type },
            });
          }
        }
      },
    };
  },
};

export default rule;
