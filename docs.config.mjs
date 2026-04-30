export const locales = {
  root: {
    key: 'root',
    label: '简体中文',
    lang: 'zh-CN',
    contentDir: 'zh',
    routePrefix: ''
  }
}

export const siteOrigin = 'https://croparia.muyucloud.cool'
export const siteBase = '/'
export const siteUrl = `${siteOrigin}${siteBase}`

export const currentVersion = {
  slug: '1.1.1a',
  status: 'current',
  inheritsFrom: null,
  sidebarKey: 'default'
}

export const archivedVersions = []

export const allVersions = [currentVersion, ...archivedVersions]

export function resolveSidebarKey(version) {
  return version.sidebarKey ?? 'default'
}

export function localePrefix(_localeKey) {
  return ''
}

export function versionRoot(localeKey, version) {
  const prefix = localePrefix(localeKey)
  return version.status === 'current'
    ? `${prefix}/`
    : `${prefix}/versions/${version.slug}/`
}

export function guideRoot(localeKey, version) {
  const root = versionRoot(localeKey, version)
  return root === '/' ? '/guide/' : `${root}guide/`
}

export function localizedText(_localeKey, zh, _en) {
  return zh
}

export function normalizeSiteUrl(url) {
  return url.replace(/\/+$/, '')
}

export function routePathFromRelativePath(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/')

  if (normalized === 'index.md' || normalized === '/index.mdx') {
    return '/'
  }

  if (normalized.endsWith('/index.md')) {
    return `/${normalized.slice(0, -'index.md'.length)}`
  }

  if (normalized.endsWith('/index.mdx')) {
    return `/${normalized.slice(0, -'index.mdx'.length)}`
  }

  return `/${normalized.replace(/\.mdx?$/, '')}`
}

export function absoluteUrlForPath(routePath) {
  const normalizedRoute = routePath.startsWith('/') ? routePath : `/${routePath}`
  const baseUrl = normalizeSiteUrl(siteUrl)

  if (normalizedRoute === '/') {
    return `${baseUrl}/`
  }

  return `${baseUrl}${normalizedRoute}`
}

export function resolveVersionChain(version) {
  const chain = []
  const visited = new Set()
  const versionsBySlug = new Map(allVersions.map((item) => [item.slug, item]))

  let cursor = version

  while (cursor) {
    if (visited.has(cursor.slug)) {
      throw new Error(`Circular version inheritance detected for ${cursor.slug}`)
    }

    visited.add(cursor.slug)
    chain.unshift(cursor.slug)

    if (!cursor.inheritsFrom) {
      break
    }

    const parent = versionsBySlug.get(cursor.inheritsFrom)

    if (!parent) {
      throw new Error(`Unknown inherited version: ${cursor.inheritsFrom}`)
    }

    cursor = parent
  }

  return chain
}
