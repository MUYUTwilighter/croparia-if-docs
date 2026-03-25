export const locales = {
  root: {
    key: 'root',
    label: '简体中文',
    lang: 'zh-CN',
    contentDir: 'zh',
    routePrefix: ''
  },
  en: {
    key: 'en',
    label: 'English',
    lang: 'en-US',
    contentDir: 'en',
    routePrefix: '/en'
  }
}

export const currentVersion = {
  slug: '1.1.0a',
  minecraft: '1.21.1',
  status: 'current',
  inheritsFrom: null
}

export const archivedVersions = []

export const allVersions = [currentVersion, ...archivedVersions]

export function localePrefix(localeKey) {
  return locales[localeKey].routePrefix
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

export function localizedText(localeKey, zh, en) {
  return localeKey === 'root' ? zh : en
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
