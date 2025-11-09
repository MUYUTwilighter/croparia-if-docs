import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Croparia IF',
  tagline: 'A Minecraft mod that farms the minerals, loots and more!',
  favicon: 'img/favicon.webp',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://croparia.muyucloud.cool/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  organizationName: 'MUYU_Twilighter',
  projectName: 'croparia-if-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-Hans'],
    localeConfigs: {
      en: {
        label: 'English'
      },
      'zh-Hans': {
        label: '简体中文'
      },
    },
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
            'https://github.com/MUYUTwilighter/croparia-if-docs/edit/master/',
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
            'https://github.com/MUYUTwilighter/croparia-if-docs/edit/master/',
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
    navbar: {
      title: 'Croparia IF Docs',
      logo: {
        alt: 'Croparia IF',
        src: '/img/logo.webp',
      },
      items: [
        {
          type: 'docsVersionDropdown',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/MUYUTwilighter/croparia-if',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Contact',
          items: [
            {
              label: 'QQ Group',
              href: 'https://qm.qq.com/q/q09RuwhIJM',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/HDzTs8X8VF',
            },
          ],
        },
        {
          title: 'Download',
          items: [
            {
              label: 'CurseForge',
              href: 'https://www.curseforge.com/minecraft/mc-mods/croparia-if',
            },
            {
              label: 'Modrinth',
              href: 'https://modrinth.com/mod/croparia-if',
            },
          ]
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
              href: 'https://github.com/MUYUTwilighter/croparia-if',
            },
            {
              label: 'MCMOD',
              href: 'https://www.mcmod.cn/class/13639.html',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} MUYU_Twilighter. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['toml', 'json5', 'groovy', 'java']
    },
  } satisfies Preset.ThemeConfig,
  customFields: {
    "API_URL": process.env.API_URL || 'http://localhost:4000',
  }
};

export default config;
