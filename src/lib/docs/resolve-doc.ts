import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

import {
  docsConfig,
  getLocaleDefinition,
  getVersionDefinition,
  isLocaleCode,
  isVersionSlug,
} from "@/src/lib/docs/config";
import type {
  DocFrontmatter,
  FallbackAttempt,
  LocaleCode,
  ResolvedDoc,
  ResolveDocInput,
  VersionSlug,
} from "@/src/lib/docs/types";
import { localeCodes, versionSlugs } from "@/src/lib/docs/config";
import { normalizeSlug } from "@/src/lib/docs/routing";

const DOCS_SOURCE_ROOT = path.join(process.cwd(), "src", "doc");

function buildLocaleChain(requestedLocale: LocaleCode) {
  const localeDefinition = getLocaleDefinition(requestedLocale);
  const chain = [requestedLocale, ...(localeDefinition.fallbackLocales ?? []), docsConfig.defaultLocale];

  return [...new Set(chain)];
}

function buildVersionChain(requestedVersion: VersionSlug) {
  const chain: VersionSlug[] = [];
  let cursor: VersionSlug | null = requestedVersion;
  const visited = new Set<VersionSlug>();

  while (cursor) {
    if (visited.has(cursor)) {
      throw new Error(`Circular version inheritance detected at ${cursor}.`);
    }

    visited.add(cursor);
    chain.push(cursor);
    cursor = getVersionDefinition(cursor).parent;
  }

  if (!chain.includes(docsConfig.defaultContentVersion)) {
    chain.push(docsConfig.defaultContentVersion);
  }

  return chain;
}

function buildRelativeCandidates(slug: string[]) {
  if (slug.length === 0) {
    return ["index.mdx", "index.md"];
  }

  const basePath = path.posix.join(...slug);
  return [`${basePath}.mdx`, `${basePath}.md`, path.posix.join(basePath, "index.mdx"), path.posix.join(basePath, "index.md")];
}

function deriveSectionKey(slug: string[]) {
  return slug[0] ?? null;
}

function parseScalarValue(value: string) {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }

  return value;
}

function stripInlineMarkdown(value: string) {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[*_~]/g, "")
    .trim();
}

function inferTitleAndDesc(body: string) {
  const lines = body.split(/\r?\n/);
  let title = "未知标题";
  let desc = "";
  let firstHeadingIndex = -1;

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index]?.match(/^#\s+(.+)$/);

    if (!match) {
      continue;
    }

    title = stripInlineMarkdown(match[1] ?? "").trim() || "未知标题";
    firstHeadingIndex = index;
    break;
  }

  if (firstHeadingIndex !== -1) {
    const paragraphLines: string[] = [];

    for (let index = firstHeadingIndex + 1; index < lines.length; index += 1) {
      const line = lines[index] ?? "";
      const trimmed = line.trim();

      if (!trimmed) {
        if (paragraphLines.length > 0) {
          break;
        }

        continue;
      }

      if (/^#{1,6}\s+/.test(trimmed) || trimmed.startsWith("```")) {
        break;
      }

      paragraphLines.push(trimmed);
    }

    desc = stripInlineMarkdown(paragraphLines.join(" ")).trim();
  }

  return { title, desc };
}

function parseFrontmatter(rawContent: string): { frontmatter: DocFrontmatter; body: string } {
  const frontmatterMatch = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  if (!frontmatterMatch) {
    const { title, desc } = inferTitleAndDesc(rawContent);
    return {
      frontmatter: {
        title,
        desc,
        metadata: {},
      },
      body: rawContent,
    };
  }

  const rawFrontmatter = frontmatterMatch[1] ?? "";
  const body = rawContent.slice(frontmatterMatch[0].length);
  const inferred = inferTitleAndDesc(body);
  const frontmatter: DocFrontmatter = {
    title: inferred.title,
    desc: inferred.desc,
    metadata: {},
  };

  for (const line of rawFrontmatter.split(/\r?\n/)) {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");
    const scalarValue = parseScalarValue(value);

    if (key === "title" && typeof scalarValue === "string") {
      frontmatter[key] = value;
      continue;
    }

    if ((key === "desc" || key === "description") && typeof scalarValue === "string") {
      frontmatter.desc = value;
      continue;
    }

    if (key === "nonav" && typeof scalarValue === "boolean") {
      frontmatter.nonav = scalarValue;
      continue;
    }

    if (key === "navOrder" && typeof scalarValue === "number") {
      frontmatter.navOrder = scalarValue;
      continue;
    }

    if (key === "sitemap" && typeof scalarValue === "boolean") {
      frontmatter.sitemap = scalarValue;
      continue;
    }

    frontmatter.metadata ??= {};
    frontmatter.metadata[key] = scalarValue;
  }

  return {
    frontmatter,
    body,
  };
}

const parseFrontmatterCached = cache((rawContent: string) => parseFrontmatter(rawContent));

function slugFromRelativePath(relativePath: string) {
  const normalized = relativePath.replace(/\\/g, "/");

  if (normalized === "index.mdx" || normalized === "index.md") {
    return [] as string[];
  }

  if (normalized.endsWith("/index.mdx")) {
    return normalized.slice(0, -"/index.mdx".length).split("/").filter(Boolean);
  }

  if (normalized.endsWith("/index.md")) {
    return normalized.slice(0, -"/index.md".length).split("/").filter(Boolean);
  }

  return normalized.replace(/\.(md|mdx)$/i, "").split("/").filter(Boolean);
}

function walkDocumentFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const entries: string[] = [];

  for (const dirent of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, dirent.name);

    if (dirent.isDirectory()) {
      entries.push(...walkDocumentFiles(absolutePath));
      continue;
    }

    if (/\.(md|mdx)$/i.test(dirent.name)) {
      entries.push(absolutePath);
    }
  }

  return entries;
}

const walkDocumentFilesCached = cache((directory: string) => {
  return walkDocumentFiles(directory);
});

const readDocumentSourceCached = cache((absolutePath: string) => {
  const rawContent = fs.readFileSync(absolutePath, "utf8");
  const { frontmatter, body } = parseFrontmatterCached(rawContent);

  return {
    rawContent,
    frontmatter,
    body,
  };
});

const listDocumentSlugsCached = cache(() => {
  const allSlugs = new Set<string>();

  for (const locale of localeCodes) {
    for (const version of versionSlugs) {
      const versionRoot = path.join(DOCS_SOURCE_ROOT, locale, version);

      for (const filePath of walkDocumentFilesCached(versionRoot)) {
        const relativePath = path.relative(versionRoot, filePath);
        const slug = slugFromRelativePath(relativePath);
        allSlugs.add(slug.join("/"));
      }
    }
  }

  return [...allSlugs]
    .sort()
    .map((slug) => (slug.length === 0 ? [] : slug.split("/")));
});

export function listDocumentSlugs() {
  return listDocumentSlugsCached();
}

const listSourceDocumentsCached = cache(() => {
  const sourceDocuments: Array<{
    locale: LocaleCode;
    version: VersionSlug;
    slug: string[];
  }> = [];

  for (const locale of localeCodes) {
    for (const version of versionSlugs) {
      const versionRoot = path.join(DOCS_SOURCE_ROOT, locale, version);

      for (const filePath of walkDocumentFilesCached(versionRoot)) {
        const relativePath = path.relative(versionRoot, filePath);
        sourceDocuments.push({
          locale,
          version,
          slug: slugFromRelativePath(relativePath),
        });
      }
    }
  }

  return sourceDocuments;
});

export function listSourceDocuments() {
  return listSourceDocumentsCached();
}

const resolveDocCached = cache((requestedLocale: LocaleCode, requestedVersion: VersionSlug, slugKey: string) => {
  const requestedSlug = slugKey.length === 0 ? [] : slugKey.split("/");
  const requestedSection = deriveSectionKey(requestedSlug);
  const localeChain = buildLocaleChain(requestedLocale);
  const versionChain = buildVersionChain(requestedVersion);
  const fallbackTrace: FallbackAttempt[] = [];

  for (const version of versionChain) {
    for (const locale of localeChain) {
      const relativeCandidates = buildRelativeCandidates(requestedSlug);
      let matchedRelativePath: string | null = null;

      for (const relativeCandidate of relativeCandidates) {
        const absolutePath = path.join(DOCS_SOURCE_ROOT, locale, version, ...relativeCandidate.split("/"));

        if (!fs.existsSync(absolutePath)) {
          continue;
        }

        matchedRelativePath = relativeCandidate;
        const { rawContent, frontmatter, body } = readDocumentSourceCached(absolutePath);

        fallbackTrace.push({
          locale,
          version,
          relativeCandidates,
          matchedRelativePath,
        });

        return {
          requestedLocale,
          requestedVersion,
          requestedSlug,
          requestedSection,
          resolvedLocale: locale,
          resolvedVersion: version,
          resolvedSlug: requestedSlug,
          resolvedSection: requestedSection,
          sourcePath: absolutePath,
          relativeSourcePath: path.relative(process.cwd(), absolutePath).replace(/\\/g, "/"),
          rawContent,
          body,
          frontmatter,
          fallbackTrace,
          isFallback: locale !== requestedLocale || version !== requestedVersion,
          isLocaleFallback: locale !== requestedLocale,
          isVersionFallback: version !== requestedVersion,
          isNavVisible: !(frontmatter.nonav ?? false),
          isSitemapIncluded: frontmatter.sitemap ?? true,
        };
      }

      fallbackTrace.push({
        locale,
        version,
        relativeCandidates,
        matchedRelativePath,
      });
    }
  }

  return null;
});

export function resolveDoc(input: ResolveDocInput): ResolvedDoc | null {
  if (!isLocaleCode(input.locale) || !isVersionSlug(input.version)) {
    return null;
  }

  const requestedLocale = input.locale;
  const requestedVersion = input.version;
  const requestedSlug = normalizeSlug(input.slug);

  return resolveDocCached(requestedLocale, requestedVersion, requestedSlug.join("/"));
}
