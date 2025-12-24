import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'Mastering Embodied Intelligence and Humanoid Systems',

  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://munibaweb123.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  
  baseUrl: '/',

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'munibaweb123', // Usually your GitHub org/user name.
  projectName: 'physical-ai-and-robotics-hackathon', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur', 'fr'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
      },
      ur: {
        label: 'اردو',
        direction: 'rtl',
        htmlLang: 'ur-PK',
      },
      fr: {
        label: 'Français',
        direction: 'ltr',
        htmlLang: 'fr-FR',
      },
    },
  },

  customFields: {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_URL,
    authBaseUrl: process.env.DOCUSAURUS_BETTER_AUTH_URL || 'http://localhost:10000',
  },

  plugins: [
    // Add webpack configuration plugin to handle Node.js polyfills
    async function myPlugin(context, options) {
      return {
        name: 'webpack-config-plugin',
        configureWebpack(config, isServer, utils) {
          return {
            resolve: {
              fallback: {
                "buffer": require.resolve('buffer'),
                "stream": require.resolve('stream-browserify'),
                "util": require.resolve('util/'),
                "http": require.resolve('stream-http'),
                "https": require.resolve('https-browserify'),
                "url": require.resolve('url/'),
                "querystring": require.resolve('querystring-es3'),
                "path": require.resolve('path-browserify'),
                "os": require.resolve('os-browserify/browser'),
                "crypto": require.resolve('crypto-browserify'),
                "zlib": require.resolve('browserify-zlib'),
                "tls": false,
                "net": false,
                "fs": false,
                "child_process": false,
                "dns": false,
                "http2": false,
                "worker_threads": false,
                "process": require.resolve('process/browser'),
                "assert": require.resolve('assert/'),
                "vm": require.resolve('vm-browserify'),
                // Properly handle node: prefixed imports
                "node:buffer": require.resolve('buffer'),
                "node:stream": require.resolve('stream-browserify'),
                "node:util": require.resolve('util/'),
                "node:http": require.resolve('stream-http'),
                "node:https": require.resolve('https-browserify'),
                "node:url": require.resolve('url/'),
                "node:path": require.resolve('path-browserify'),
                "node:process": require.resolve('process/browser'),
                "node:zlib": require.resolve('browserify-zlib'),
                "node:fs": false,
                "node:net": false,
                "node:dns": false,
                "node:vm": require.resolve('vm-browserify'),
              },
            },
            plugins: [
              // Provide global variables that some packages expect
              new (require('webpack')).ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
                process: require.resolve('process/browser'),
              }),
            ],
            experiments: {
              asyncWebAssembly: true,
            }
          };
        },
      };
    },
  ],

  markdown: {
    format: 'mdx',
    mermaid: true,
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
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
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Physical AI & Humanoid Robotics',
      logo: {
        alt: 'My Site Logo',
        src: 'img/book_logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {
          to: '/chatbot',
          label: 'AI Assistant',
          position: 'left',
        },
        {
          to: '/profile',
          label: 'Profile',
          position: 'right',
        },
        {
          to: '/login',
          label: 'Login',
          position: 'right',
        },
        {
          to: '/register',
          label: 'Register',
          position: 'right',
        },
        {
          type: 'custom-logout-button', // Custom component for logout
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/facebook/docusaurus',
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
              label: 'X',
              href: 'https://x.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [

            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
