import { defineConfig } from 'vitepress'
import type { HeadConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'
import {
  absoluteUrlForPath,
  allVersions,
  archivedVersions,
  currentVersion,
  localizedText,
  routePathFromRelativePath,
  siteBase,
  siteUrl
} from '../docs.config.mjs'

type LocaleKey = 'root'
type VersionMeta = (typeof allVersions)[number]

function versionRoot(version: VersionMeta): string {
  return version.status === 'current' ? '/' : `/versions/${version.slug}/`
}

function versionGuideRoot(version: VersionMeta): string {
  const root = versionRoot(version)
  return root === '/' ? '/guide/' : `${root}guide/`
}

function versionLabel(locale: LocaleKey, version: VersionMeta): string {
  const statusSuffix =
    version.status === 'current'
      ? localizedText(locale, '（当前）', ' (current)')
      : version.status === 'sts'
        ? localizedText(locale, '（STS）', ' (STS)')
        : version.status === 'lts'
          ? localizedText(locale, '（LTS）', ' (LTS)')
          : ''

  return `${version.slug}${statusSuffix}`
}

function buildVersionNav(locale: LocaleKey): DefaultTheme.NavItemWithChildren {
  return {
    text: `版本 ${currentVersion.slug}`,
    items: [
      {
        text: '版本策略',
        link: '/versions/'
      },
      ...allVersions.map((version) => ({
        text: versionLabel(locale, version),
        link: versionRoot(version)
      }))
    ]
  }
}

function buildNav(locale: LocaleKey): DefaultTheme.NavItem[] {
  return [
    {
      text: '通用',
      link: '/general/'
    },
    {
      text: '玩家',
      link: '/player/'
    },
    {
      text: '整合包作者',
      link: '/modpack/'
    },
    {
      text: '开发者',
      link: '/developer/'
    },
    {
      text: '社区',
      items: [
        {
          text: 'MCMOD',
          link: 'https://www.mcmod.cn/class/13639.html'
        },
        {
          text: '问题反馈 Discord',
          link: 'https://discord.gg/JunKeKCJAY'
        },
        {
          text: '问题反馈 QQ',
          link: 'https://qm.qq.com/q/OedneeO0Uw'
        }
      ]
    },
    buildVersionNav(locale)
  ]
}

function buildGeneralSidebar(prefix: string): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '通用',
      items: [
        { text: '概览', link: `${prefix}general/` },
        {
          text: '核心概念',
          collapsed: false,
          items: [
            { text: '作物', link: `${prefix}general/concepts/crop` },
            { text: '元素', link: `${prefix}general/concepts/element` }
          ]
        },
        {
          text: '方块与物品',
          collapsed: false,
          items: [
            { text: '魔种', link: `${prefix}general/blocks-and-items/croparia` },
            { text: '遗物', link: `${prefix}general/blocks-and-items/relic` },
            { text: '工作方块', link: `${prefix}general/blocks-and-items/workstations` },
            { text: '其他', link: `${prefix}general/blocks-and-items/others` }
          ]
        }
      ]
    }
  ]
}

function buildGuideSection(prefix: string): DefaultTheme.SidebarItem {
  return {
    text: '指南',
    collapsed: false,
    items: [
      {
        text: '开始阅读',
        link: `${prefix}guide/`
      },
      {
        text: '文档架构',
        link: `${prefix}guide/architecture`
      },
      {
        text: '多语言与多版本',
        link: `${prefix}guide/i18n-and-versioning`
      },
      {
        text: '版本标签生成',
        link: `${prefix}guide/content-version-tags`
      }
    ]
  }
}

function buildPlayerSidebar(prefix: string): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '玩家',
      link: `${prefix}player/`,
      items: [
        { text: '快速入门', link: `${prefix}player/` },
        { text: '自动化示例', link: `${prefix}player/automation` },
        { text: '常见问题与解答', link: `${prefix}player/faq` }
      ]
    }
  ]
}

function buildModpackSidebar(prefix: string): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '整合包作者',
      items: [
        { text: '概览', link: `${prefix}modpack/` },
        {
          text: '基础配置',
          collapsed: false,
          items: [
            { text: '设置与指令', link: `${prefix}modpack/configuration-command` },
            { text: '自定义作物', link: `${prefix}modpack/custom-crops` },
            { text: '配方与结构', link: `${prefix}modpack/recipe-structure` }
          ]
        },
        {
          text: '运行时数据生成系统',
          collapsed: false,
          items: [
            { text: '概览', link: `${prefix}modpack/generator/` },
            { text: '创建数据生成器', link: `${prefix}modpack/generator/create-generator` },
            { text: '占位符解析器', link: `${prefix}modpack/generator/placeholder` }
          ]
        },
        {
          text: '配方生成器',
          collapsed: false,
          items: [
            { text: '概览', link: `${prefix}modpack/recipe-wizard/` },
            { text: '自定义用法', link: `${prefix}modpack/recipe-wizard/custom-usage` }
          ]
        }
      ]
    }
  ]
}

function buildDeveloperSidebar(prefix: string): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '开发者',
      items: [
        { text: '概览', link: `${prefix}developer/` },
        {
          text: '核心模块',
          collapsed: false,
          items: [
            { text: '概览', link: `${prefix}developer/core/` },
            { text: 'Crop Transmuter', link: `${prefix}developer/core/crop-transmuter` },
            { text: 'Greenhouse', link: `${prefix}developer/core/greenhouse` },
            { text: 'Infusor', link: `${prefix}developer/core/infusor` },
            { text: 'Ritual Stand', link: `${prefix}developer/core/ritual_stand` },
            { text: 'FakePlayer', link: `${prefix}developer/core/fake-player` }
          ]
        },
        {
          text: '核心 API',
          collapsed: false,
          items: [
            { text: '网络 API', link: `${prefix}developer/network` },
            { text: 'Repo API', link: `${prefix}developer/repo/` },
            { text: '数据生成系统', link: `${prefix}developer/generator/` },
            { text: 'Codec API', link: `${prefix}developer/codec/` },
            { text: 'Recipe API', link: `${prefix}developer/recipe/` },
            { text: '其他常用 API', link: `${prefix}developer/other/` },
            { text: '自定义物品组件', link: `${prefix}developer/other/item-components` }
          ]
        },
        {
          text: '内容维护参考',
          collapsed: false,
          items: [
            { text: '添加内置作物', link: `${prefix}developer/crop` }
          ]
        }
      ]
    }
  ]
}

function buildSidebar(): DefaultTheme.Sidebar {
  const archivedVersionItems = archivedVersions.map((version) => ({
    text: versionLabel('root', version),
    link: versionGuideRoot(version)
  }))

  const sidebar: DefaultTheme.Sidebar = {
    '/general/': buildGeneralSidebar('/'),
    '/player/': buildPlayerSidebar('/'),
    '/modpack/': buildModpackSidebar('/'),
    '/developer/': buildDeveloperSidebar('/'),
    '/guide/': [buildGuideSection('/')],
    '/versions/': [
      {
        text: '版本',
        collapsed: false,
        items: [
          {
            text: '版本策略',
            link: '/versions/'
          },
          ...archivedVersionItems
        ]
      }
    ]
  }

  for (const version of archivedVersions) {
    const prefix = `/versions/${version.slug}/`
    sidebar[`${prefix}general/`] = buildGeneralSidebar(prefix)
    sidebar[`${prefix}player/`] = buildPlayerSidebar(prefix)
    sidebar[`${prefix}modpack/`] = buildModpackSidebar(prefix)
    sidebar[`${prefix}developer/`] = buildDeveloperSidebar(prefix)
    sidebar[`${prefix}guide/`] = [buildGuideSection(prefix)]
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
  return /^\/versions\/[^/]+(?:\/|$)/.test(routePath)
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
    ['link', { rel: 'icon', type: 'image/webp', href: `${siteBase}/assets/logo.webp` }],
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
    const title =
      pageData.frontmatter.title ??
      (pageData.frontmatter.layout === 'home' ? 'Croparia IF Docs' : pageData.title || 'Croparia IF Docs')
    const description =
      pageData.description ||
      pageData.frontmatter.description ||
      'Croparia IF 的多版本中文文档站。'
    const keywords = normalizeKeywords(pageData.frontmatter.keywords ?? pageData.frontmatter.tags)
    const robots = pageData.frontmatter.robots
      ? String(pageData.frontmatter.robots)
      : isArchivedVersionPath(routePath)
        ? 'noindex,follow'
        : 'index,follow'
    const head = (pageData.frontmatter.head ??= [])

    pushHeadTag(head, ['link', { rel: 'canonical', href: absoluteUrl }])
    pushHeadTag(head, ['link', { rel: 'alternate', hreflang: 'zh-CN', href: absoluteUrl }])
    pushHeadTag(head, ['link', { rel: 'alternate', hreflang: 'x-default', href: absoluteUrl }])
    pushHeadTag(head, ['meta', { name: 'description', content: description }])
    pushHeadTag(head, ['meta', { name: 'robots', content: robots }])
    pushHeadTag(head, ['meta', { property: 'og:type', content: 'website' }])
    pushHeadTag(head, ['meta', { property: 'og:title', content: title }])
    pushHeadTag(head, ['meta', { property: 'og:description', content: description }])
    pushHeadTag(head, ['meta', { property: 'og:url', content: absoluteUrl }])
    pushHeadTag(head, ['meta', { property: 'og:locale', content: 'zh_CN' }])
    pushHeadTag(head, ['meta', { name: 'twitter:title', content: title }])
    pushHeadTag(head, ['meta', { name: 'twitter:description', content: description }])

    if (keywords.length > 0) {
      pushHeadTag(head, ['meta', { name: 'keywords', content: keywords.join(', ') }])
    }
  },
  themeConfig: {
    ...sharedThemeConfig,
    nav: buildNav('root'),
    sidebar: buildSidebar(),
    outline: {
      label: '页面导航'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    lastUpdatedText: '最后更新'
  }
})
