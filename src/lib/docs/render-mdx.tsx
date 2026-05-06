import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { compile, run } from "@mdx-js/mdx";
import rehypePrettyCode from "rehype-pretty-code";
import { cache } from "react";
import * as runtime from "react/jsx-runtime";

import { mdxComponents } from "@/mdx-components";
import { contentSignal } from "@/src/lib/docs/content-signal";

const MDX_CACHE_VERSION = "v3";
const MDX_CACHE_ROOT = path.join(process.cwd(), ".next", "cache", "docs-mdx");

const prettyCodeOptions = {
  theme: "github-dark-default",
  defaultLang: {
    block: "text",
    inline: "text",
  },
  keepBackground: false,
  filterMetaString(meta: string) {
    return meta.includes("showLineNumbers") ? meta : `${meta} showLineNumbers`.trim();
  },
} as const;

function escapeTemplateExpressions(source: string) {
  const lines = source.split(/\r?\n/);
  let inFence = false;

  return lines
    .map((line) => {
      if (/^\s*```/.test(line) || /^\s*~~~/.test(line)) {
        inFence = !inFence;
        return line;
      }

      if (inFence || !line.includes("${")) {
        return line;
      }

      const parts = line.split(/(`+)/);
      let inInlineCode = false;

      return parts
        .map((part) => {
          if (/^`+$/.test(part)) {
            if (part.length % 2 === 1) {
              inInlineCode = !inInlineCode;
            }
            return part;
          }

          if (inInlineCode) {
            return part;
          }

          return part.replace(/\$\{/g, "$\\{");
        })
        .join("");
    })
    .join("\n");
}

function buildMdxCacheKey(source: string) {
  return createHash("sha256")
    .update(MDX_CACHE_VERSION)
    .update("\0")
    .update(source)
    .digest("hex");
}

function getMdxCachePath(source: string) {
  return path.join(MDX_CACHE_ROOT, `${buildMdxCacheKey(source)}.mjs`);
}

async function readCompiledMdxFromDisk(source: string) {
  try {
    return await fs.readFile(getMdxCachePath(source), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

async function writeCompiledMdxToDisk(source: string, compiled: string) {
  const cachePath = getMdxCachePath(source);
  await fs.mkdir(path.dirname(cachePath), { recursive: true });
  await fs.writeFile(cachePath, compiled, "utf8");
}

const compileMdxToFunctionBody = cache(async (source: string, signal: string) => {
  void signal;
  const cachedCompiled = await readCompiledMdxFromDisk(source);

  if (cachedCompiled) {
    return cachedCompiled;
  }

  const compiled = await compile(escapeTemplateExpressions(source), {
    outputFormat: "function-body",
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  });
  const compiledString = String(compiled);

  await writeCompiledMdxToDisk(source, compiledString);
  return compiledString;
});

const compileMdxComponent = cache(async (source: string, signal: string) => {
  const compiled = await compileMdxToFunctionBody(source, signal);
  const evaluated = await run(compiled, runtime);
  return evaluated.default;
});

export async function renderMdxSource(source: string) {
  const MdxContent = await compileMdxComponent(source, contentSignal);
  return <MdxContent components={mdxComponents} />;
}
