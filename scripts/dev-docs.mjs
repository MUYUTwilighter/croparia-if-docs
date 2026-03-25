import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const children = []
let shuttingDown = false

function startChild(command, args) {
  const child = spawn(command, args, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: false
  })

  children.push(child)

  child.on('exit', (code) => {
    if (shuttingDown) {
      return
    }

    shuttingDown = true

    for (const other of children) {
      if (other !== child && !other.killed) {
        other.kill()
      }
    }

    process.exit(code ?? 0)
  })

  return child
}

startChild(process.execPath, ['scripts/watch-docs.mjs'])
startChild(process.execPath, ['node_modules/vitepress/bin/vitepress.js', 'dev'])

function shutdown() {
  if (shuttingDown) {
    return
  }

  shuttingDown = true

  for (const child of children) {
    if (!child.killed) {
      child.kill()
    }
  }
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
