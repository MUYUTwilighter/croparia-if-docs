import { spawn } from 'node:child_process'
import { watch } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const watchTargets = [
  path.join(projectRoot, 'content'),
  path.join(projectRoot, 'docs.config.mjs')
]

let running = false
let pending = false
let timer = null

function runPrepare() {
  if (running) {
    pending = true
    return
  }

  running = true

  const child = spawn(process.execPath, ['scripts/prepare-docs.mjs'], {
    cwd: projectRoot,
    stdio: 'inherit'
  })

  child.on('exit', () => {
    running = false

    if (pending) {
      pending = false
      runPrepare()
    }
  })
}

function schedulePrepare() {
  if (timer) {
    clearTimeout(timer)
  }

  timer = setTimeout(() => {
    timer = null
    runPrepare()
  }, 120)
}

runPrepare()

for (const target of watchTargets) {
  watch(target, { recursive: true }, (_eventType, filename) => {
    if (!filename) {
      schedulePrepare()
      return
    }

    if (String(filename).startsWith('..')) {
      return
    }

    schedulePrepare()
  })
}

process.stdin.resume()
