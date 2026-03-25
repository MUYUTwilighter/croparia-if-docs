import { defineConfig } from 'vitepress'
import type { HeadConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'
import {
  absoluteUrlForPath,
  alternateLocalePath,
  allVersions,
  archivedVersions,
  currentVersion,
  guideRoot,
  localePrefix,
  localizedText,
  routePathFromRelativePath,
  siteBase,
  siteUrl
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
        text: localizedText(locale, '版本标签生成', 'Content Version Tags'),
        link: `${prefix}guide/content-version-tags`
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

function isArchivedVersionPath(routePath: string): boolean {
  return /^\/(?:en\/)?versions\/[^/]+(?:\/|$)/.test(routePath)
}

function localeOfRoute(routePath: string): LocaleKey {
  return routePath.startsWith('/en/') || routePath === '/en/' || routePath === '/en'
    ? 'en'
    : 'root'
}

function pushHeadTag(head: HeadConfig[], tag: HeadConfig) {
  head.push(tag)
}

function normalizeKeywords(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
  }

  if (typeof input === 'string' && input.trim().length > 0) {
    return input.split(',').map((item) => item.trim()).filter(Boolean)
  }

  return []
}

export default defineConfig({
  srcDir: 'docs',
  base: siteBase,
  lang: 'zh-CN',
  title: 'Croparia IF Docs',
  description: 'Croparia IF 文档站',
  head: [
    ['meta', { property: 'og:site_name', content: 'Croparia IF Docs' }],
    ['meta', { name: 'twitter:card', content: 'summary' }]
  ],
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: siteUrl
  },
  transformPageData(pageData) {
    const routePath = routePathFromRelativePath(pageData.relativePath)
    const absoluteUrl = absoluteUrlForPath(routePath)
    const locale = localeOfRoute(routePath)
    const alternateRoot = absoluteUrlForPath(alternateLocalePath(routePath, 'root'))
    const alternateEn = absoluteUrlForPath(alternateLocalePath(routePath, 'en'))
    const title =
      pageData.frontmatter.title ??
      (pageData.frontmatter.layout === 'home' ? 'Croparia IF Docs' : pageData.title || 'Croparia IF Docs')
    const description =
      pageData.description ||
      pageData.frontmatter.description ||
      (locale === 'root'
        ? 'Croparia IF 的多语言、多版本文档站。'
        : 'Multilingual, multi-version documentation for Croparia IF.')
    const keywords = normalizeKeywords(pageData.frontmatter.keywords ?? pageData.frontmatter.tags)
    const robots = pageData.frontmatter.robots
      ? String(pageData.frontmatter.robots)
      : isArchivedVersionPath(routePath)
        ? 'noindex,follow'
        : 'index,follow'
    const head = (pageData.frontmatter.head ??= [])

    pushHeadTag(head, ['link', { rel: 'canonical', href: absoluteUrl }])
    pushHeadTag(head, ['link', { rel: 'alternate', hreflang: 'zh-CN', href: alternateRoot }])
    pushHeadTag(head, ['link', { rel: 'alternate', hreflang: 'en-US', href: alternateEn }])
    pushHeadTag(head, ['link', { rel: 'alternate', hreflang: 'x-default', href: alternateRoot }])
    pushHeadTag(head, ['meta', { name: 'description', content: description }])
    pushHeadTag(head, ['meta', { name: 'robots', content: robots }])
    pushHeadTag(head, ['meta', { property: 'og:type', content: 'website' }])
    pushHeadTag(head, ['meta', { property: 'og:title', content: title }])
    pushHeadTag(head, ['meta', { property: 'og:description', content: description }])
    pushHeadTag(head, ['meta', { property: 'og:url', content: absoluteUrl }])
    pushHeadTag(head, ['meta', { property: 'og:locale', content: locale === 'root' ? 'zh_CN' : 'en_US' }])
    pushHeadTag(head, ['meta', { name: 'twitter:title', content: title }])
    pushHeadTag(head, ['meta', { name: 'twitter:description', content: description }])

    if (keywords.length > 0) {
      pushHeadTag(head, ['meta', { name: 'keywords', content: keywords.join(', ') }])
    }
  },
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
