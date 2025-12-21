---
id: 27
title: Create docusaurus.config.ts in physical-ai-coursework
stage: misc
date_iso: 2025-11-29
surface: agent
model: gemini-1.5-pro
feature: physical-ai-coursework-docusaurus-config
branch: 001-rag-chatbot-backend
user: Yusuf Traders
command: |
  (user provided docusaurus.config.ts content)
labels:
  - docusaurus
  - config
  - fix
links: {}
files_yaml:
  - physical-ai-coursework/docusaurus.config.ts
tests_yaml: []
prompt_text: |
  import {themes as prismThemes} from 'prism-react-renderer';
  import type {Config} from '@docusaurus/types';
  import type * as Preset from '@docusaurus/preset-classic';

  const config: Config = {
    // TODO: Update these fields with your project details
    title: 'My Project Docs',
    tagline: 'Documentation and Knowledge Base',
    favicon: 'img/favicon.ico',

    // Set the production url of your site here
    url: 'https://your-docusaurus-site.example.com',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'your-org', // Usually your GitHub org/user name.
    projectName: 'your-project-name', // Usually your repo name.

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
      defaultLocale: 'en',
      locales: ['en'],
    },

    presets: [
      [
        'classic',
        {
          docs: {
            sidebarPath: './sidebars.ts',
            // Please change this to your repo.
            // Remove this to remove the "edit this page" links.
            editUrl:
              'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          },
          blog: {
            showReadingTime: true,
            // Please change this to your repo.
            editUrl:
              'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          },
          theme: {
            customCss: './src/css/custom.css',
          },
        } satisfies Preset.Options,
      ],
    ],

    themeConfig: {
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'My Project',
        logo: {
          alt: 'My Project Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/your-org/your-project',
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
                label: 'Introduction',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/your-org/your-project',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        // Added 'python' and 'bash' to the additionalLanguages for your RAG project needs
        additionalLanguages: ['python', 'bash', 'json'],
      },
    } satisfies Preset.ThemeConfig,
  };

  export default config;
response_text: |
  A `docusaurus.config.ts` file has been created in the `physical-ai-coursework` directory with the content you provided. This should resolve the Docusaurus config file error.
outcome: `docusaurus.config.ts` created.
evaluation: Docusaurus config file created successfully.
---
