import 'dotenv/config'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const distRoot = path.join(projectRoot, '.vitepress', 'dist')

function printUsage() {
  console.log('Usage: npm run docs:publish:ssh')
  console.log('Required env vars:')
  console.log('  DOCS_SSH_HOST')
  console.log('  DOCS_SSH_USER')
  console.log('  DOCS_SSH_TARGET_DIR')
  console.log('Optional env vars:')
  console.log('  DOCS_SSH_PORT')
  console.log('  DOCS_SSH_KEY')
  console.log('  DOCS_SSH_KEEP_BACKUP=1')
}

function fail(message) {
  console.error(message)
  process.exit(1)
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`
}

function runCommand(command, args, label) {
  console.log(`> ${label}`)
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: false
  })

  if (result.status !== 0) {
    fail(`${label} failed with exit code ${result.status ?? 'unknown'}.`)
  }
}

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  printUsage()
  process.exit(0)
}

if (!existsSync(distRoot)) {
  fail(`Build output does not exist: ${distRoot}`)
}

const host = process.env.DOCS_SSH_HOST
const user = process.env.DOCS_SSH_USER
const targetDir = process.env.DOCS_SSH_TARGET_DIR
const port = process.env.DOCS_SSH_PORT
const keyFile = process.env.DOCS_SSH_KEY
const keepBackup = process.env.DOCS_SSH_KEEP_BACKUP === '1'

if (!host || !user || !targetDir) {
  printUsage()
  fail('Missing SSH deployment configuration.')
}

const sshTarget = `${user}@${host}`
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const normalizedTargetDir = targetDir.replace(/\/+$/, '')
const remoteStageDir = `${normalizedTargetDir}.codex-stage-${timestamp}`
const remoteBackupDir = `${normalizedTargetDir}.codex-backup`

const sshArgs = []
const scpArgs = []

if (port) {
  sshArgs.push('-p', port)
  scpArgs.push('-P', port)
}

if (keyFile) {
  sshArgs.push('-i', keyFile)
  scpArgs.push('-i', keyFile)
}

const prepareRemoteStage = [
  'sh',
  '-lc',
  [
    'set -eu',
    `rm -rf ${shellQuote(remoteStageDir)}`,
    `mkdir -p ${shellQuote(remoteStageDir)}`
  ].join('; ')
]

runCommand(
  'ssh',
  [...sshArgs, sshTarget, ...prepareRemoteStage],
  'Prepare remote staging directory'
)

runCommand(
  'scp',
  [...scpArgs, '-r', `${distRoot}${path.sep}.`, `${sshTarget}:${remoteStageDir}/`],
  'Upload built docs to remote staging directory'
)

const finalizeRemoteDeploy = [
  'sh',
  '-lc',
  [
    'set -eu',
    `rm -rf ${shellQuote(remoteBackupDir)}`,
    `if [ -e ${shellQuote(normalizedTargetDir)} ]; then mv ${shellQuote(normalizedTargetDir)} ${shellQuote(remoteBackupDir)}; fi`,
    `mv ${shellQuote(remoteStageDir)} ${shellQuote(normalizedTargetDir)}`,
    keepBackup ? 'true' : `rm -rf ${shellQuote(remoteBackupDir)}`
  ].join('; ')
]

runCommand(
  'ssh',
  [...sshArgs, sshTarget, ...finalizeRemoteDeploy],
  'Replace remote site with uploaded build'
)

console.log(`SSH publish complete: ${sshTarget}:${normalizedTargetDir}`)
