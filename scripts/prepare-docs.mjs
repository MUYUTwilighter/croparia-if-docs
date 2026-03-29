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

    if (stats.isFile() && (fullPath.endsWith('.md') || fullPath.endsWith('.mdx'))) {
      files.push(fullPath)
    }
  }

  return files
}

function parseFrontmatter(source) {
  const normalizedSource = source.replace(/\r\n/g, '\n')
  const lines = normalizedSource.split('\n')
  let cursor = 0

  while (cursor < lines.length) {
    const line = lines[cursor].trim()

    if (!line) {
      cursor += 1
      continue
    }

    if (line.startsWith('import ') || line.startsWith('export ')) {
      cursor += 1
      continue
    }

    break
  }

  if (lines[cursor] !== '---') {
    return { preamble: '', frontmatter: '', body: source }
  }

  let closingLine = cursor + 1

  while (closingLine < lines.length && lines[closingLine] !== '---') {
    closingLine += 1
  }

  if (closingLine >= lines.length) {
    return { preamble: '', frontmatter: '', body: source }
  }

  return {
    preamble: lines.slice(0, cursor).join('\n'),
    frontmatter: lines.slice(cursor + 1, closingLine).join('\n'),
    body: lines.slice(closingLine + 1).join('\n')
  }
}

function isMdxFile(filePath) {
  return filePath.endsWith('.mdx')
}

function toOutputRelativePath(relativePath) {
  return relativePath.replace(/\.mdx$/i, '.md')
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

function convertMdxBodyToMarkdown(body) {
  return body
    .replace(/(\s+)([A-Za-z_][\w:-]*)=\{true\}/g, '$1$2')
    .replace(/(\s+)([A-Za-z_][\w:-]*)=\{false\}/g, '$1:$2="false"')
    .replace(/(\s+)([A-Za-z_][\w:-]*)=\{(-?\d+(?:\.\d+)?)\}/g, '$1:$2="$3"')
    .replace(/(\s+)([A-Za-z_][\w:-]*)=\{"([^"]*)"\}/g, '$1$2="$3"')
    .replace(/(\s+)([A-Za-z_][\w:-]*)=\{'([^']*)'\}/g, '$1$2="$3"')
}

function stripMdxPreamble(source) {
  const normalizedSource = source.replace(/\r\n/g, '\n')
  const lines = normalizedSource.split('\n')
  let cursor = 0

  while (cursor < lines.length) {
    const line = lines[cursor].trim()

    if (!line) {
      cursor += 1
      continue
    }

    if (line.startsWith('import ') || line.startsWith('export ')) {
      cursor += 1
      continue
    }

    break
  }

  return lines.slice(cursor).join('\n')
}

function renderOutputSource(source, options = {}) {
  const { dropPreamble = false, convertMdxSyntax = false } = options
  const { preamble, frontmatter, body } = parseFrontmatter(source)

  if (!frontmatter) {
    if (!convertMdxSyntax) {
      return source
    }

    return `${convertMdxBodyToMarkdown(stripMdxPreamble(source)).replace(/^\n/, '')}\n`
  }

  const outputParts = []

  if (!dropPreamble && preamble.trim()) {
    outputParts.push(preamble.trimEnd())
  }

  const strippedFrontmatter = stripInternalFrontmatter(frontmatter)
  if (strippedFrontmatter) {
    outputParts.push(strippedFrontmatter.trimEnd())
  }

  const renderedBody = convertMdxSyntax ? convertMdxBodyToMarkdown(body) : body
  outputParts.push(renderedBody.replace(/^\n/, ''))

  return `${outputParts.filter(Boolean).join('\n\n')}\n`
}

function writeMarkdownFile(outputFile, source, options) {
  mkdirSync(path.dirname(outputFile), { recursive: true })
  writeFileSync(outputFile, renderOutputSource(source, options))
}

function copyDocsContent(locale) {
  const localeInputRoot = path.join(docsSourceRoot, locale.contentDir)
  const routePrefix = locale.routePrefix.replace(/^\//, '')
  const writtenTargets = new Set()

  for (const inputFile of walkFiles(localeInputRoot)) {
    const source = readFileSync(inputFile, 'utf8')
    const relativePath = path.relative(localeInputRoot, inputFile)
    const outputRelativePath = toOutputRelativePath(relativePath)
    const mdxFile = isMdxFile(inputFile)
    const { frontmatter } = parseFrontmatter(source)
    const modVersions = frontmatter ? parseModVersions(frontmatter) : null

    if (modVersions && modVersions.some((version) => !knownVersions.has(version))) {
      const unknown = modVersions.filter((version) => !knownVersions.has(version))
      throw new Error(`Unknown modVersions in ${inputFile}: ${unknown.join(', ')}`)
    }

    if (!modVersions) {
      const outputFile = joinOutputPath(routePrefix, outputRelativePath)
      writeMarkdownFile(outputFile, source, {
        dropPreamble: mdxFile,
        convertMdxSyntax: mdxFile
      })
      continue
    }

    for (const version of allVersions) {
      if (!modVersions.includes(version.slug)) {
        continue
      }

      const outputFile =
        version.status === 'current'
          ? joinOutputPath(routePrefix, outputRelativePath)
          : joinOutputPath(routePrefix, 'versions', version.slug, outputRelativePath)
      const dedupeKey = `${version.slug}:${outputFile}`

      if (writtenTargets.has(dedupeKey)) {
        throw new Error(`Duplicate generated target detected: ${outputFile}`)
      }

      writtenTargets.add(dedupeKey)
      writeMarkdownFile(outputFile, source, {
        dropPreamble: mdxFile,
        convertMdxSyntax: mdxFile
      })
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
