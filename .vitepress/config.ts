import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'

type LocaleKey = 'root' | 'en'

type VersionMeta = {
  slug: string
  minecraft: string
  status: 'current' | 'archived'
}

const currentVersion: VersionMeta = {
  slug: '1.1.0a',
  minecraft: '1.21.1',
  status: 'current'
}

const archivedVersions: VersionMeta[] = []

const allVersions = [currentVersion, ...archivedVersions]

function localePrefix(locale: LocaleKey): string {
  return locale === 'root' ? '' : '/en'
}

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

function localeText(locale: LocaleKey, zh: string, en: string): string {
  return locale === 'root' ? zh : en
}

function buildVersionNav(locale: LocaleKey): DefaultTheme.NavItemWithChildren {
  return {
    text:
      currentVersion.status === 'current'
        ? localeText(locale, `版本 ${currentVersion.slug}`, `Version ${currentVersion.slug}`)
        : currentVersion.slug,
    items: [
      {
        text: localeText(locale, '版本策略', 'Versioning Policy'),
        link: `${localePrefix(locale)}/versions/`
      },
      ...allVersions.map((version) => ({
        text: localeText(
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
      text: localeText(locale, '首页', 'Home'),
      link: `${localePrefix(locale)}/`
    },
    {
      text: localeText(locale, '指南', 'Guide'),
      link: `${localePrefix(locale)}/guide/`
    },
    buildVersionNav(locale)
  ]
}

function buildSidebar(locale: LocaleKey): DefaultTheme.Sidebar {
  const guideItems: DefaultTheme.SidebarItem[] = [
    {
      text: localeText(locale, '开始阅读', 'Start Here'),
      link: `${localePrefix(locale)}/guide/`
    },
    {
      text: localeText(locale, '文档架构', 'Docs Architecture'),
      link: `${localePrefix(locale)}/guide/architecture`
    },
    {
      text: localeText(locale, '多语言与多版本', 'I18n and Versioning'),
      link: `${localePrefix(locale)}/guide/i18n-and-versioning`
    }
  ]

  const archivedVersionItems = archivedVersions.map((version) => ({
    text: `${version.slug} · MC ${version.minecraft}`,
    link: guideRoot(locale, version)
  }))

  return {
    [`${localePrefix(locale)}/guide/`]: [
      {
        text: localeText(locale, '指南', 'Guide'),
        items: guideItems
      }
    ],
    [`${localePrefix(locale)}/versions/`]: [
      {
        text: localeText(locale, '版本', 'Versions'),
        items: [
          {
            text: localeText(locale, '版本策略', 'Versioning Policy'),
            link: `${localePrefix(locale)}/versions/`
          },
          ...archivedVersionItems
        ]
      }
    ]
  }
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
