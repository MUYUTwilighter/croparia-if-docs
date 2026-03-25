import { defineConfig } from 'vitepress'
import type { HeadConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'
import {
  absoluteUrlForPath,
  alternateLocalePath,
  allVersions,
  archivedVersions,
  currentVersion,
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

function versionGuideRoot(locale: LocaleKey, version: VersionMeta): string {
  const root = versionRoot(locale, version)
  return root === '/' ? '/guide/' : `${root}guide/`
}

function versionLabel(locale: LocaleKey, version: VersionMeta): string {
  return localizedText(
    locale,
    `${version.slug}${version.status === 'current' ? '（当前）' : ''}`,
    `${version.slug}${version.status === 'current' ? ' (current)' : ''}`
  )
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
        text: versionLabel(locale, version),
        link: versionRoot(locale, version)
      }))
    ]
  }
}

function sectionLink(locale: LocaleKey, path: string): string {
  return `${localePrefix(locale)}${path}`
}

function buildNav(locale: LocaleKey): DefaultTheme.NavItem[] {
  return [
    {
      text: localizedText(locale, '首页', 'Home'),
      link: `${localePrefix(locale)}/`
    },
    {
      text: localizedText(locale, '通用', 'General'),
      link: sectionLink(locale, '/general/')
    },
    {
      text: localizedText(locale, '玩家', 'Player'),
      link: sectionLink(locale, '/player/')
    },
    {
      text: localizedText(locale, '整合包作者', 'Modpack'),
      link: sectionLink(locale, '/modpack/')
    },
    {
      text: localizedText(locale, '开发者', 'Developer'),
      link: sectionLink(locale, '/developer/')
    },
    buildVersionNav(locale)
  ]
}

function buildDocSections(locale: LocaleKey, prefix: string): DefaultTheme.SidebarItem[] {
  return [
    {
      text: localizedText(locale, '通用', 'General'),
      items: [
        { text: localizedText(locale, '概览', 'Overview'), link: `${prefix}general/` },
        { text: localizedText(locale, '术语与核心概念', 'Terms and Core Concepts'), link: `${prefix}general/concepts` },
        { text: localizedText(locale, '内容总览', 'Content Overview'), link: `${prefix}general/content-overview` },
        { text: localizedText(locale, '物品与方块清单', 'Blocks and Items'), link: `${prefix}general/blocks-and-items` },
        { text: localizedText(locale, '元素与介质', 'Elements and Media'), link: `${prefix}general/elements` }
      ]
    },
    {
      text: localizedText(locale, '玩家', 'Player'),
      items: [
        { text: localizedText(locale, '入门', 'Getting Started'), link: `${prefix}player/` },
        { text: localizedText(locale, '种植与甜瓜', 'Farming and Melons'), link: `${prefix}player/farming-and-melons` },
        { text: localizedText(locale, 'Croparia 进阶', 'Croparia Progression'), link: `${prefix}player/croparia-progression` },
        { text: localizedText(locale, '机器与仪式', 'Machines and Rituals'), link: `${prefix}player/machines-and-rituals` },
        { text: localizedText(locale, '自动化思路', 'Automation'), link: `${prefix}player/automation` },
        { text: localizedText(locale, '实用道具', 'Utility Items'), link: `${prefix}player/utility-items` },
        { text: localizedText(locale, '常见问题', 'FAQ'), link: `${prefix}player/faq` }
      ]
    },
    {
      text: localizedText(locale, '整合包作者', 'Modpack Authors'),
      items: [
        { text: localizedText(locale, '概览', 'Overview'), link: `${prefix}modpack/` },
        { text: localizedText(locale, '自定义能力概览', 'Customization Overview'), link: `${prefix}modpack/overview` },
        { text: localizedText(locale, '数据包与资源包', 'Datapacks and Resource Packs'), link: `${prefix}modpack/datapacks-and-resourcepacks` },
        { text: localizedText(locale, '自定义作物', 'Custom Crops'), link: `${prefix}modpack/custom-crops` },
        { text: localizedText(locale, '配方与结构', 'Recipes and Structures'), link: `${prefix}modpack/recipes-and-structures` },
        { text: localizedText(locale, '生成器与工具', 'Generators and Tools'), link: `${prefix}modpack/generators-and-tools` },
        { text: localizedText(locale, '配置与整合建议', 'Configuration'), link: `${prefix}modpack/configuration` },
        { text: localizedText(locale, '调试与排错', 'Debugging'), link: `${prefix}modpack/debugging` }
      ]
    },
    {
      text: localizedText(locale, '开发者', 'Developer'),
      items: [
        { text: localizedText(locale, '概览', 'Overview'), link: `${prefix}developer/` },
        { text: localizedText(locale, '架构概览', 'Architecture'), link: `${prefix}developer/architecture` },
        { text: localizedText(locale, '包结构', 'Package Layout'), link: `${prefix}developer/package-layout` },
        { text: localizedText(locale, '注册体系', 'Registrations'), link: `${prefix}developer/registrations` },
        { text: localizedText(locale, '核心数据模型', 'Data Models'), link: `${prefix}developer/data-models` },
        { text: localizedText(locale, '内容加载', 'Content Loading'), link: `${prefix}developer/content-loading` },
        { text: localizedText(locale, '网络与界面', 'Networking and UI'), link: `${prefix}developer/networking-and-ui` },
        { text: localizedText(locale, '兼容层', 'Compatibility'), link: `${prefix}developer/compatibility` },
        { text: localizedText(locale, 'API 总览', 'API Overview'), link: `${prefix}developer/api-overview` }
      ]
    }
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
    text: versionLabel(locale, version),
    link: versionGuideRoot(locale, version)
  }))

  const sidebar: DefaultTheme.Sidebar = {
    [`${localePrefix(locale)}/general/`]: buildDocSections(locale, `${localePrefix(locale)}/`),
    [`${localePrefix(locale)}/player/`]: buildDocSections(locale, `${localePrefix(locale)}/`),
    [`${localePrefix(locale)}/modpack/`]: buildDocSections(locale, `${localePrefix(locale)}/`),
    [`${localePrefix(locale)}/developer/`]: buildDocSections(locale, `${localePrefix(locale)}/`),
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
    sidebar[`${prefix}general/`] = buildDocSections(locale, prefix)
    sidebar[`${prefix}player/`] = buildDocSections(locale, prefix)
    sidebar[`${prefix}modpack/`] = buildDocSections(locale, prefix)
    sidebar[`${prefix}developer/`] = buildDocSections(locale, prefix)
    sidebar[`${prefix}guide/`] = [buildGuideSection(locale, prefix)]
  }

  return sidebar
}

const sharedThemeConfig = {
  search: {
    provider: 'local' as const
  },
  socialLinks: [
    { icon: 'github', link: 'https://github.com/MUYUTwilighter/croparia-if-docs' }
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
