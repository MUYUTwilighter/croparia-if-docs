import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  allVersions,
  archivedVersions,
  currentVersion,
  locales,
  resolveVersionChain
} from '../docs.config.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const generatedRoot = path.join(projectRoot, '.generated')
const contentRoot = path.join(projectRoot, 'content')

function joinOutputPath(...parts) {
  const filteredParts = parts.filter(Boolean)
  return path.join(generatedRoot, ...filteredParts)
}

function copyDirIfExists(fromDir, toDir) {
  if (!existsSync(fromDir)) {
    return
  }

  mkdirSync(toDir, { recursive: true })
  cpSync(fromDir, toDir, { recursive: true })
}

function copyVersionedContent(version, locale) {
  const outputDir =
    version.status === 'current'
      ? joinOutputPath(locale.routePrefix.replace(/^\//, ''))
      : joinOutputPath(locale.routePrefix.replace(/^\//, ''), 'versions', version.slug)

  copyDirIfExists(
    path.join(contentRoot, 'versioned', 'base', locale.contentDir),
    outputDir
  )

  for (const slug of resolveVersionChain(version)) {
    copyDirIfExists(
      path.join(contentRoot, 'versioned', 'releases', slug, locale.contentDir),
      outputDir
    )
  }
}

function copyGlobalContent(locale) {
  const outputDir = joinOutputPath(locale.routePrefix.replace(/^\//, ''))
  copyDirIfExists(path.join(contentRoot, 'global', locale.contentDir), outputDir)
}

function copyPublicContent() {
  copyDirIfExists(path.join(contentRoot, 'public'), path.join(generatedRoot, 'public'))
}

rmSync(generatedRoot, { recursive: true, force: true })
mkdirSync(generatedRoot, { recursive: true })

for (const locale of Object.values(locales)) {
  copyVersionedContent(currentVersion, locale)
  copyGlobalContent(locale)

  for (const archivedVersion of archivedVersions) {
    copyVersionedContent(archivedVersion, locale)
  }
}

copyPublicContent()

const summary = {
  currentVersion: currentVersion.slug,
  archivedVersions: archivedVersions.map((version) => version.slug),
  locales: Object.values(locales).map((locale) => locale.key),
  releaseChain: Object.fromEntries(allVersions.map((version) => [version.slug, resolveVersionChain(version)]))
}

mkdirSync(path.join(generatedRoot, '.meta'), { recursive: true })
writeFileSync(
  path.join(generatedRoot, '.meta', 'version-summary.json'),
  `${JSON.stringify(summary, null, 2)}\n`
)
