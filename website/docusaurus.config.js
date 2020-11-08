/* eslint-disable sort-keys */

const pkgs = [
  'eslint-plugin-rut',
  'jest-rut',
  'rut',
  'rut-dom',
  // eslint-disable-next-line
].map((name) => require(`${name}/package.json`));

module.exports = {
  title: 'Rut',
  tagline: 'React testing made easy. Supports DOM and custom renderers. ',
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
      copyright: `Copyright © ${new Date().getFullYear()} Miles Johnson. Built with <a href="https://docusaurus.io/">Docusaurus</a>. Icon by <a href="https://thenounproject.com/search/?q=boost&i=1420345">Chameleon Design</a>.`,
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
