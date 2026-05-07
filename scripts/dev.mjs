import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const rootDir = process.cwd();
const contentDir = path.join(rootDir, "src", "doc");
const signalPath = path.join(rootDir, "src", ".generated", "docs", "content-signal.ts");
const nextBinPath = path.join(rootDir, "node_modules", "next", "dist", "bin", "next");

const baselineContent = fs.existsSync(signalPath)
  ? fs.readFileSync(signalPath, "utf8")
  : `export const contentSignal = "static" as const;\n`;

fs.mkdirSync(path.dirname(signalPath), { recursive: true });

function writeSignal(reason) {
  const timestamp = new Date().toISOString();
  const nextContent =
    `// Development helper for content-driven hot reload.\n` +
    `// Last content change: ${reason}\n` +
    `export const contentSignal = ${JSON.stringify(timestamp)} as const;\n`;

  fs.writeFileSync(signalPath, nextContent, "utf8");
}

function restoreSignal() {
  fs.writeFileSync(signalPath, baselineContent, "utf8");
}

let debounceTimer = null;

function scheduleSignalUpdate(eventType, fileName) {
  const reason = `${eventType}:${fileName ?? "unknown"}`.replace(/\\/g, "/");

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    writeSignal(reason);
  }, 80);
}

const watcher = fs.existsSync(contentDir)
  ? fs.watch(contentDir, { recursive: true }, (eventType, fileName) => {
      scheduleSignalUpdate(eventType, fileName);
    })
  : null;

const nextProcess = spawn(process.execPath, [nextBinPath, "dev"], {
  cwd: rootDir,
  stdio: "inherit",
  env: process.env,
});

let shuttingDown = false;

function cleanupAndExit(code = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }

  watcher?.close();
  restoreSignal();

  if (!nextProcess.killed) {
    nextProcess.kill("SIGINT");
  }

  process.exit(code);
}

process.on("SIGINT", () => cleanupAndExit(0));
process.on("SIGTERM", () => cleanupAndExit(0));

nextProcess.on("exit", (code, signal) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }

  watcher?.close();
  restoreSignal();

  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
