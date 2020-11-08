/* eslint-disable sort-keys */

module.exports = {
  docs: [
    'index',
    'setup',
    'faq',
    {
      type: 'category',
      label: 'API',
      collapsed: false,
      items: ['api/render', 'api/result', 'api/element'],
    },
    {
      type: 'category',
      label: 'Tooling',
      collapsed: true,
      items: ['tooling/eslint', 'tooling/jest'],
    },
    'matchers',
    'mocks',
    'predicates',
    'caveats',
    {
      type: 'category',
      label: 'Examples',
      collapsed: true,
      items: [
        {
          type: 'link',
          label: 'Async',
          href:
            'https://github.com/milesj/rut/blob/master/packages/rut-dom/tests/examples/async.test.tsx',
        },
        {
          type: 'link',
          label: 'Forms',
          href:
            'https://github.com/milesj/rut/blob/master/packages/rut-dom/tests/examples/forms.test.tsx',
        },
      ],
    },
    {
      type: 'link',
      label: 'Changelog',
      href: 'https://github.com/milesj/rut/blob/master/CHANGELOG.md',
    },
  ],
};
