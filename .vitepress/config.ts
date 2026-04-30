import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vitepress'
import type { HeadConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'
import {
  absoluteUrlForPath,
  allVersions,
  archivedVersions,
  currentVersion,
  localizedText,
  resolveVersionChain,
  resolveSidebarKey,
  routePathFromRelativePath,
  siteBase,
  siteUrl
} from '../docs.config.mjs'

type LocaleKey = 'root'
type VersionMeta = (typeof allVersions)[number]
type ArchivedRouteManifest = Record<string, string[]>
type VersionFallbackChains = Record<string, string[]>

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
    }
  ]
}

function collectMarkdownFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return []
  }

  const markdownFiles: string[] = []

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      markdownFiles.push(...collectMarkdownFiles(absolutePath))
      continue
    }

    if (/\.mdx?$/i.test(entry.name)) {
      markdownFiles.push(absolutePath)
    }
  }

  return markdownFiles
}

function buildArchivedRouteManifest(): ArchivedRouteManifest {
  const docsRoot = path.resolve(process.cwd(), 'docs')
  const manifest: ArchivedRouteManifest = {}

  for (const version of archivedVersions) {
    const versionDocsRoot = path.join(docsRoot, 'versions', version.slug)
    const routes = collectMarkdownFiles(versionDocsRoot)
      .map((filePath) => routePathFromRelativePath(path.relative(versionDocsRoot, filePath)))
      .sort()

    manifest[version.slug] = routes
  }

  return manifest
}

function buildVersionFallbackChains(): VersionFallbackChains {
  const chains: VersionFallbackChains = {}

  for (const version of allVersions) {
    chains[version.slug] = [...resolveVersionChain(version)].reverse()
  }

  return chains
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
            { text: '作物嬗变仪', link: `${prefix}developer/core/crop-transmuter` },
            { text: '温室', link: `${prefix}developer/core/greenhouse` },
            { text: '注魔台', link: `${prefix}developer/core/infusor` },
            { text: '仪式台', link: `${prefix}developer/core/ritual_stand` },
            { text: 'FakePlayer', link: `${prefix}developer/core/fake-player` }
          ]
        },
        {
          text: '核心 API',
          collapsed: false,
          items: [
            { text: '网络 API', link: `${prefix}developer/network` },
            {
              text: 'Repo API',
              collapsed: false,
              items: [
                { text: '概览', link: `${prefix}developer/repo/` },
                { text: '快速开始', link: `${prefix}developer/repo/start` },
                { text: '资源访问', link: `${prefix}developer/repo/resource` },
                { text: '扩展', link: `${prefix}developer/repo/extend` }
              ]
            },
            {
              text: '数据生成系统',
              collapsed: false,
              items: [
                { text: '概览', link: `${prefix}developer/generator/` },
                { text: 'Entry', link: `${prefix}developer/generator/entry` },
                { text: 'Generator', link: `${prefix}developer/generator/generator` },
                { text: '占位符', link: `${prefix}developer/generator/placeholder` }
              ]
            },
            {
              text: 'Codec API',
              collapsed: false,
              items: [
                { text: '概览', link: `${prefix}developer/codec/` },
                { text: 'Multi Codec', link: `${prefix}developer/codec/multi-codec` },
                { text: 'Multi Field Codec', link: `${prefix}developer/codec/multi-field-codec` },
                { text: 'Other', link: `${prefix}developer/codec/other` },
                { text: 'Tested Codec', link: `${prefix}developer/codec/tested-codec` }
              ]
            },
            {
              text: 'Recipe API',
              collapsed: false,
              items: [
                { text: '概览', link: `${prefix}developer/recipe/` },
                { text: 'Entries', link: `${prefix}developer/recipe/entries` },
                { text: 'JEI', link: `${prefix}developer/recipe/jei` },
                { text: 'REI', link: `${prefix}developer/recipe/rei` }
              ]
            }
          ]
        },
        {
          text: '其他常用 API',
          collapsed: false,
          items: [
            { text: '概览', link: `${prefix}developer/other/` },
            { text: 'JSON 转换', link: `${prefix}developer/other/json` },
            { text: '配置系统', link: `${prefix}developer/other/config` },
            { text: '自定义物品组件', link: `${prefix}developer/other/item-components` },
            { text: '访问与修改方块属性', link: `${prefix}developer/other/block-property` },
            { text: '可放置物品接口', link: `${prefix}developer/other/item-placeable` },
            { text: 'Supplier 工具', link: `${prefix}developer/other/supplier` }
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

type SidebarProfileBuilder = {
  general: (prefix: string) => DefaultTheme.SidebarItem[]
  player: (prefix: string) => DefaultTheme.SidebarItem[]
  modpack: (prefix: string) => DefaultTheme.SidebarItem[]
  developer: (prefix: string) => DefaultTheme.SidebarItem[]
  guide: (prefix: string) => DefaultTheme.SidebarItem[]
}

const sidebarProfileBuilders: Record<string, SidebarProfileBuilder> = {
  default: {
    general: buildGeneralSidebar,
    player: buildPlayerSidebar,
    modpack: buildModpackSidebar,
    developer: buildDeveloperSidebar,
    guide: (prefix) => [buildGuideSection(prefix)]
  },
  legacy110a: {
    general: () => [],
    player: () => [],
    modpack: () => [],
    developer: (prefix) => [
      {
        text: '开发者',
        items: [
          { text: '概览', link: `${prefix}developer/` },
          {
            text: '核心模块',
            collapsed: false,
            items: [
              { text: '概览', link: `${prefix}developer/core/` },
              { text: '作物嬗变仪', link: `${prefix}developer/core/crop-transmuter` }
            ]
          },
          {
            text: '核心 API',
            collapsed: false,
            items: [
              { text: '网络', link: `/developer/network` },
              {
                text: 'Repo API',
                collapsed: false,
                items: [
                  { text: '概览', link: `${prefix}developer/repo/` },
                  { text: '快速开始', link: `${prefix}developer/repo/start` },
                  { text: '资源访问', link: `/developer/repo/resource` },
                  { text: '扩展', link: `${prefix}developer/repo/extend` }
                ]
              }
            ]
          }
        ]
      }
    ],
    guide: (prefix) => [
      {
        text: '归档说明',
        collapsed: false,
        items: [
          { text: '1.1.0a', link: `${prefix}guide/` }
        ]
      }
    ]
  }
}

function resolveSidebarProfile(version: VersionMeta): SidebarProfileBuilder {
  const sidebarKey = resolveSidebarKey(version)
  const sidebarProfile = sidebarProfileBuilders[sidebarKey]

  if (!sidebarProfile) {
    throw new Error(`Unknown sidebar profile: ${sidebarKey} (version ${version.slug})`)
  }

  return sidebarProfile
}

function applySidebarProfile(
  sidebar: DefaultTheme.Sidebar,
  prefix: string,
  sidebarProfile: SidebarProfileBuilder
) {
  sidebar[`${prefix}general/`] = sidebarProfile.general(prefix)
  sidebar[`${prefix}player/`] = sidebarProfile.player(prefix)
  sidebar[`${prefix}modpack/`] = sidebarProfile.modpack(prefix)
  sidebar[`${prefix}developer/`] = sidebarProfile.developer(prefix)
  sidebar[`${prefix}guide/`] = sidebarProfile.guide(prefix)
}

function buildSidebar(): DefaultTheme.Sidebar {
  const archivedVersionItems = archivedVersions.map((version) => ({
    text: versionLabel('root', version),
    link: versionGuideRoot(version)
  }))

  const sidebar: DefaultTheme.Sidebar = {
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

  applySidebarProfile(sidebar, '/', resolveSidebarProfile(currentVersion))

  for (const version of archivedVersions) {
    const prefix = `/versions/${version.slug}/`
    applySidebarProfile(sidebar, prefix, resolveSidebarProfile(version))
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

const archivedRouteManifest = buildArchivedRouteManifest()
const versionFallbackChains = buildVersionFallbackChains()

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
    versioning: {
      currentVersionSlug: currentVersion.slug,
      versions: allVersions.map((version) => ({
        slug: version.slug,
        label: versionLabel('root', version),
        status: version.status,
        sidebarKey: resolveSidebarKey(version)
      })),
      archivedRouteManifest,
      versionFallbackChains
    },
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
