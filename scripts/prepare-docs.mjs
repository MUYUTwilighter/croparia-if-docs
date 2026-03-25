import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  allVersions,
  archivedVersions,
  currentVersion,
  locales
} from '../docs.config.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const generatedRoot = path.join(projectRoot, 'docs')
const contentRoot = path.join(projectRoot, 'content')
const docsSourceRoot = path.join(contentRoot, 'docs')
const knownVersions = new Set(allVersions.map((version) => version.slug))

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

function walkFiles(dir) {
  if (!existsSync(dir)) {
    return []
  }

  const entries = readdirSync(dir)
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry)
    const stats = statSync(fullPath)

    if (stats.isDirectory()) {
      files.push(...walkFiles(fullPath))
      continue
    }

    if (stats.isFile() && fullPath.endsWith('.md')) {
      files.push(fullPath)
    }
  }

  return files
}

function parseFrontmatter(source) {
  if (!source.startsWith('---\n')) {
    return { frontmatter: '', body: source }
  }

  const closingIndex = source.indexOf('\n---\n', 4)

  if (closingIndex === -1) {
    return { frontmatter: '', body: source }
  }

  return {
    frontmatter: source.slice(4, closingIndex),
    body: source.slice(closingIndex + 5)
  }
}

function parseModVersions(frontmatter) {
  const lines = frontmatter.split(/\r?\n/)
  const versions = []

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const trimmed = line.trim()

    if (!trimmed.startsWith('modVersions:')) {
      continue
    }

    const inlineValue = trimmed.slice('modVersions:'.length).trim()

    if (!inlineValue || inlineValue === '|') {
      let cursor = index + 1

      while (cursor < lines.length) {
        const itemLine = lines[cursor]
        const itemTrimmed = itemLine.trim()

        if (!itemTrimmed.startsWith('- ')) {
          break
        }

        versions.push(itemTrimmed.slice(2).trim())
        cursor += 1
      }

      return versions
    }

    if (inlineValue === 'all') {
      return allVersions.map((version) => version.slug)
    }

    if (inlineValue.startsWith('[') && inlineValue.endsWith(']')) {
      return inlineValue
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }

    return [inlineValue]
  }

  return null
}

function stripInternalFrontmatter(frontmatter) {
  const lines = frontmatter.split(/\r?\n/)
  const output = []
  let skippingModVersions = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (!skippingModVersions && trimmed.startsWith('modVersions:')) {
      skippingModVersions = true
      continue
    }

    if (skippingModVersions) {
      if (trimmed.startsWith('- ')) {
        continue
      }

      if (trimmed === '') {
        continue
      }

      skippingModVersions = false
    }

    output.push(line)
  }

  const cleaned = output.join('\n').trim()

  if (!cleaned) {
    return ''
  }

  return `---\n${cleaned}\n---\n`
}

function renderOutputSource(source) {
  const { frontmatter, body } = parseFrontmatter(source)

  if (!frontmatter) {
    return source
  }

  return `${stripInternalFrontmatter(frontmatter)}${body.replace(/^\n/, '')}`
}

function writeMarkdownFile(outputFile, source) {
  mkdirSync(path.dirname(outputFile), { recursive: true })
  writeFileSync(outputFile, renderOutputSource(source))
}

function copyDocsContent(locale) {
  const localeInputRoot = path.join(docsSourceRoot, locale.contentDir)
  const routePrefix = locale.routePrefix.replace(/^\//, '')
  const writtenTargets = new Set()

  for (const inputFile of walkFiles(localeInputRoot)) {
    const source = readFileSync(inputFile, 'utf8')
    const relativePath = path.relative(localeInputRoot, inputFile)
    const { frontmatter } = parseFrontmatter(source)
    const modVersions = frontmatter ? parseModVersions(frontmatter) : null

    if (modVersions && modVersions.some((version) => !knownVersions.has(version))) {
      const unknown = modVersions.filter((version) => !knownVersions.has(version))
      throw new Error(`Unknown modVersions in ${inputFile}: ${unknown.join(', ')}`)
    }

    if (!modVersions) {
      const outputFile = joinOutputPath(routePrefix, relativePath)
      writeMarkdownFile(outputFile, source)
      continue
    }

    for (const version of allVersions) {
      if (!modVersions.includes(version.slug)) {
        continue
      }

      const outputFile =
        version.status === 'current'
          ? joinOutputPath(routePrefix, relativePath)
          : joinOutputPath(routePrefix, 'versions', version.slug, relativePath)
      const dedupeKey = `${version.slug}:${outputFile}`

      if (writtenTargets.has(dedupeKey)) {
        throw new Error(`Duplicate generated target detected: ${outputFile}`)
      }

      writtenTargets.add(dedupeKey)
      writeMarkdownFile(outputFile, source)
    }
  }
}

function copyPublicContent() {
  copyDirIfExists(path.join(contentRoot, 'public'), path.join(generatedRoot, 'public'))
}

rmSync(generatedRoot, { recursive: true, force: true })
mkdirSync(generatedRoot, { recursive: true })

for (const locale of Object.values(locales)) {
  copyDocsContent(locale)
}

copyPublicContent()

const summary = {
  currentVersion: currentVersion.slug,
  archivedVersions: archivedVersions.map((version) => version.slug),
  locales: Object.values(locales).map((locale) => locale.key),
  authoredSourceRoot: 'content/docs'
}

mkdirSync(path.join(generatedRoot, '.meta'), { recursive: true })
writeFileSync(
  path.join(generatedRoot, '.meta', 'version-summary.json'),
  `${JSON.stringify(summary, null, 2)}\n`
)
