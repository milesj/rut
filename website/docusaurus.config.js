/* eslint-disable sort-keys */

const pkgs = [
  'rut',
  'rut-dom',
  'eslint-plugin-rut',
  'jest-rut',
  // eslint-disable-next-line
].map((name) => require(`../packages/${name}/package.json`));

module.exports = {
  title: 'Rut',
  tagline:
    'Rut is a DOM-less React testing library that aims to be lightweight, encourage great testing practices, and reduce flakiness and code smells.',
  url: 'https://ruttest.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onDuplicateRoutes: 'throw',
  favicon: 'img/favicon.svg',
  organizationName: 'milesj',
  projectName: 'rut',
  themeConfig: {
    navbar: {
      title: 'Rut',
      logo: {
        alt: 'Rut',
        src: 'img/logo.svg',
      },
      items: [
        {
          label: 'v2',
          position: 'left',
          items: pkgs.map((pkg) => ({
            label: `v${pkg.version} · ${pkg.name}`,
            href: `https://www.npmjs.com/package/${pkg.name}`,
          })),
        },
        {
          to: 'docs',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/milesj/rut',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Miles Johnson. Built with <a href="https://docusaurus.io/">Docusaurus</a>. Icon by <a href="https://thenounproject.com/term/molecule/2931188/">Adrien Coquet</a>.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/milesj/rut/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/milesj/rut/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
