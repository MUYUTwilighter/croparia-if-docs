import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const signalPath = path.join(rootDir, "src", ".generated", "docs", "content-signal.ts");
const baselineContent = `// Development helper for content-driven hot reload.\nexport const contentSignal = "static" as const;\n`;

fs.mkdirSync(path.dirname(signalPath), { recursive: true });

if (!fs.existsSync(signalPath)) {
  fs.writeFileSync(signalPath, baselineContent, "utf8");
}
