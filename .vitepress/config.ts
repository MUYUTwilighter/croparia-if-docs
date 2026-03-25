import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'
import {
  allVersions,
  archivedVersions,
  currentVersion,
  guideRoot,
  localePrefix,
  localizedText
} from '../docs.config.mjs'

type LocaleKey = 'root' | 'en'

type VersionMeta = (typeof allVersions)[number]

function versionRoot(locale: LocaleKey, version: VersionMeta): string {
  const prefix = localePrefix(locale)
  return version.status === 'current'
    ? `${prefix}/`
    : `${prefix}/versions/${version.slug}/`
}

function guideRoot(locale: LocaleKey, version: VersionMeta): string {
  const root = versionRoot(locale, version)
  return root === '/' ? '/guide/' : `${root}guide/`
}

function buildVersionNav(locale: LocaleKey): DefaultTheme.NavItemWithChildren {
  return {
    text:
      currentVersion.status === 'current'
        ? localizedText(locale, `版本 ${currentVersion.slug}`, `Version ${currentVersion.slug}`)
        : currentVersion.slug,
    items: [
      {
        text: localizedText(locale, '版本策略', 'Versioning Policy'),
        link: `${localePrefix(locale)}/versions/`
      },
      ...allVersions.map((version) => ({
        text: localizedText(
          locale,
          `${version.slug} · MC ${version.minecraft}${version.status === 'current' ? '（当前）' : ''}`,
          `${version.slug} · MC ${version.minecraft}${version.status === 'current' ? ' (current)' : ''}`
        ),
        link: versionRoot(locale, version)
      }))
    ]
  }
}

function buildNav(locale: LocaleKey): DefaultTheme.NavItem[] {
  return [
    {
      text: localizedText(locale, '首页', 'Home'),
      link: `${localePrefix(locale)}/`
    },
    {
      text: localizedText(locale, '指南', 'Guide'),
      link: `${localePrefix(locale)}/guide/`
    },
    buildVersionNav(locale)
  ]
}

function buildGuideSection(locale: LocaleKey, prefix: string): DefaultTheme.SidebarItem {
  return {
    text: localizedText(locale, '指南', 'Guide'),
    items: [
      {
        text: localizedText(locale, '开始阅读', 'Start Here'),
        link: `${prefix}guide/`
      },
      {
        text: localizedText(locale, '文档架构', 'Docs Architecture'),
        link: `${prefix}guide/architecture`
      },
      {
        text: localizedText(locale, '多语言与多版本', 'I18n and Versioning'),
        link: `${prefix}guide/i18n-and-versioning`
      },
      {
        text: localizedText(locale, '内容继承模型', 'Content Inheritance Model'),
        link: `${prefix}guide/content-inheritance`
      }
    ]
  }
}

function buildSidebar(locale: LocaleKey): DefaultTheme.Sidebar {
  const archivedVersionItems = archivedVersions.map((version) => ({
    text: `${version.slug} · MC ${version.minecraft}`,
    link: guideRoot(locale, version)
  }))

  const sidebar: DefaultTheme.Sidebar = {
    [`${localePrefix(locale)}/guide/`]: [
      buildGuideSection(locale, `${localePrefix(locale)}/`)
    ],
    [`${localePrefix(locale)}/versions/`]: [
      {
        text: localizedText(locale, '版本', 'Versions'),
        items: [
          {
            text: localizedText(locale, '版本策略', 'Versioning Policy'),
            link: `${localePrefix(locale)}/versions/`
          },
          ...archivedVersionItems
        ]
      }
    ]
  }

  for (const version of archivedVersions) {
    const prefix = `${localePrefix(locale)}/versions/${version.slug}/`
    sidebar[`${prefix}guide/`] = [buildGuideSection(locale, prefix)]
  }

  return sidebar
}

const sharedThemeConfig = {
  search: {
    provider: 'local' as const
  },
  socialLinks: [
    { icon: 'github', link: 'https://github.com/MUYU-Twilighter/croparia-if' }
  ]
}

export default defineConfig({
  srcDir: '.generated',
  lang: 'zh-CN',
  title: 'Croparia IF Docs',
  description: 'Croparia IF 文档站',
  cleanUrls: true,
  lastUpdated: true,
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'Croparia IF Docs',
      description: 'Croparia IF 文档站',
      themeConfig: {
        ...sharedThemeConfig,
        nav: buildNav('root'),
        sidebar: buildSidebar('root'),
        outline: {
          label: '页面导航'
        },
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },
        lastUpdatedText: '最后更新',
        langMenuLabel: '语言'
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'Croparia IF Docs',
      description: 'Documentation site for Croparia IF',
      themeConfig: {
        ...sharedThemeConfig,
        nav: buildNav('en'),
        sidebar: buildSidebar('en'),
        outline: {
          label: 'On this page'
        },
        docFooter: {
          prev: 'Previous page',
          next: 'Next page'
        },
        lastUpdatedText: 'Last updated',
        langMenuLabel: 'Languages'
      }
    }
  }
})
