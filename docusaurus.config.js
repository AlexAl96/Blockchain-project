/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'PEER-Project',
  tagline: 'Documentation of the PEER-Project',
  url: 'https://blockchain-project-kit.netlify.app',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'AlexAl96', // Usually your GitHub org/user name.
  projectName: 'Blockchain-project', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'PEER-Project',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: 'docs/aim',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        //{to: 'blog', label: 'Blog', position: 'left'},
       // {to: 'help', label: 'Help', position: 'left'},
        {
          href: 'https://git.scc.kit.edu/undys/angular-peer',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [

            {
              label: 'Overview',
              to: 'docs/aim',
            },
            {
              label: 'Getting Started',
              to: 'docs/getting-started',
            },
            {
              label: 'Frontend',
              to: 'docs/frontend',
            },
            {
              label: 'Blockchain',
              to: 'docs/smart-contracts',
            },
            {
              label: 'Further Information',
              to: 'docs/information',
            },
          ],
        },

        {
          title: 'More',
          items: [

            {
              label: 'GitHub',
              href: 'https://git.scc.kit.edu/undys/angular-peer',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} PEER-Project, Inc. KIT. All rights belong to Alexander Albert, Maximilian Bonkosch and Marco Spraul.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
              'https://git.scc.kit.edu/undys/angular-peer',
        },

        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
