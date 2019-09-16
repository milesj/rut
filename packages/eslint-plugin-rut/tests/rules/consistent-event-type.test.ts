import rule from '../../src/rules/consistent-event-type';
import { createRule } from '../helpers';

createRule().run('consistent-event-type', rule, {
  valid: [
    `mockEvent('click')`,
    `mockEvent('keydown')`,
    `mockSyntheticEvent('onClick')`,
    `mockSyntheticEvent('onKeyDown')`,
    `dispatch('onClick')`,
    `dispatchAndWait('onKeyDown')`,
  ],

  invalid: [
    {
      code: 'mockEvent()',
      errors: [
        {
          type: 'CallExpression',
          message: 'Event type is required. None found.',
        },
      ],
    },
    {
      code: `mockEvent('onClick')`,
      errors: [
        {
          type: 'Literal',
          message: 'Event type must *not* start with "on" and must be all lowercase.',
        },
      ],
    },
    {
      code: `mockEvent('keyDown')`,
      errors: [
        {
          type: 'Literal',
          message: 'Event type must *not* start with "on" and must be all lowercase.',
        },
      ],
    },
    {
      code: 'mockSyntheticEvent()',
      errors: [
        {
          type: 'CallExpression',
          message: 'Event type is required. None found.',
        },
      ],
    },
    {
      code: `mockSyntheticEvent('click')`,
      errors: [
        {
          type: 'Literal',
          message: 'Event type must start with "on" and be in camelcase.',
        },
      ],
    },
    {
      code: `mockSyntheticEvent('onkeydown')`,
      errors: [
        {
          type: 'Literal',
          message: 'Event type must start with "on" and be in camelcase.',
        },
      ],
    },
    {
      code: `dispatch('onKeyDown', mockSyntheticEvent('onClick'))`,
      errors: [
        {
          type: 'Literal',
          message: 'Mocked event type must match the type being dispatched, which is `onKeyDown`.',
        },
      ],
    },
    {
      code: `dispatchAndWait('onClick', mockSyntheticEvent('click'))`,
      errors: [
        {
          type: 'Literal',
          message: 'Mocked event type must match the type being dispatched, which is `onClick`.',
        },
        {
          type: 'Literal',
          message: 'Event type must start with "on" and be in camelcase.',
        },
      ],
    },
  ],
});
