import 'dotenv/config'
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const distRoot = path.join(projectRoot, '.vitepress', 'dist')

function printUsage() {
  console.log('Usage: npm run docs:publish -- <deploy-dir>')
  console.log('   or: set DOCS_DEPLOY_DIR and run npm run docs:publish')
}

function countFiles(dir) {
  if (!existsSync(dir)) {
    return 0
  }

  let total = 0

  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry)
    const stats = statSync(fullPath)

    if (stats.isDirectory()) {
      total += countFiles(fullPath)
      continue
    }

    if (stats.isFile()) {
      total += 1
    }
  }

  return total
}

function isSameOrNestedPath(parentPath, childPath) {
  const relative = path.relative(parentPath, childPath)
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

function emptyDirectory(dir) {
  mkdirSync(dir, { recursive: true })

  for (const entry of readdirSync(dir)) {
    rmSync(path.join(dir, entry), { recursive: true, force: true })
  }
}

const args = process.argv.slice(2)
if (args.includes('--help') || args.includes('-h')) {
  printUsage()
  process.exit(0)
}

const targetInput = args[0] || process.env.DOCS_DEPLOY_DIR

if (!targetInput) {
  console.error('Missing deploy directory.')
  printUsage()
  process.exit(1)
}

if (!existsSync(distRoot)) {
  console.error(`Build output does not exist: ${distRoot}`)
  console.error('Run the VitePress build before publishing.')
  process.exit(1)
}

const targetRoot = path.resolve(projectRoot, targetInput)

if (targetRoot === distRoot) {
  console.error('Deploy directory cannot be the same as .vitepress/dist.')
  process.exit(1)
}

if (
  !process.env.DOCS_DEPLOY_ALLOW_IN_PROJECT &&
  isSameOrNestedPath(projectRoot, targetRoot)
) {
  console.error(`Refusing to deploy into the project workspace: ${targetRoot}`)
  console.error('Set DOCS_DEPLOY_ALLOW_IN_PROJECT=1 only if you really want that.')
  process.exit(1)
}

console.log(`Publishing docs from ${distRoot}`)
console.log(`Target directory: ${targetRoot}`)

emptyDirectory(targetRoot)
cpSync(distRoot, targetRoot, { recursive: true })

console.log(`Publish complete. ${countFiles(distRoot)} files mirrored.`)
