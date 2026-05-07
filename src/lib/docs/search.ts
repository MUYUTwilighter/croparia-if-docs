import { cache } from "react";

import { contentSignal } from "@/src/.generated/docs/content-signal";
import { buildDocPath } from "@/src/lib/docs/routing";
import { listSourceDocuments, resolveDoc } from "@/src/lib/docs/resolve-doc";
import type { LocaleCode, SearchIndexEntry, SearchResult, VersionSlug } from "@/src/lib/docs/types";

function stripMarkdown(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/[#*_~>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractHeadings(markdown: string) {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.match(/^#{1,6}\s+(.+)$/)?.[1]?.trim() ?? null)
    .filter((value): value is string => Boolean(value));
}

function buildSearchableText(parts: string[]) {
  return stripMarkdown(parts.join("\n")).toLowerCase();
}

const buildSearchIndexCached = cache((signal: string): SearchIndexEntry[] => {
  void signal;
  const uniqueEntries = new Map<string, SearchIndexEntry>();

  for (const sourceDocument of listSourceDocuments()) {
    const doc = resolveDoc(sourceDocument);

    if (!doc) {
      continue;
    }

    const canonicalHref = buildDocPath(doc.resolvedLocale, doc.resolvedVersion, doc.resolvedSlug);

    if (uniqueEntries.has(canonicalHref)) {
      continue;
    }

    const headings = extractHeadings(doc.body);
    const title = doc.frontmatter.title ?? (doc.resolvedSlug.at(-1) ?? "首页");
    const description = doc.frontmatter.desc ?? stripMarkdown(doc.body).slice(0, 160);

    uniqueEntries.set(canonicalHref, {
      title,
      description,
      locale: doc.resolvedLocale,
      version: doc.resolvedVersion,
      slug: doc.resolvedSlug,
      section: doc.resolvedSection,
      canonicalHref,
      searchableText: buildSearchableText([title, description, ...headings, doc.body, doc.resolvedSlug.join(" ")]),
      headings,
      isNavVisible: doc.isNavVisible,
      isSitemapIncluded: doc.isSitemapIncluded,
    });
  }

  return [...uniqueEntries.values()];
});

export function buildSearchIndex() {
  return buildSearchIndexCached(contentSignal);
}

function scoreEntry(entry: SearchIndexEntry, queryTokens: string[]) {
  let score = 0;
  const title = entry.title.toLowerCase();
  const headings = entry.headings.join(" ").toLowerCase();
  const slug = entry.slug.join(" ").toLowerCase();

  for (const token of queryTokens) {
    if (title.includes(token)) {
      score += 10;
    }

    if (headings.includes(token)) {
      score += 6;
    }

    if (slug.includes(token)) {
      score += 5;
    }

    if (entry.searchableText.includes(token)) {
      score += 2;
    }
  }

  return score;
}

export function searchDocs(input: {
  query: string;
  locale?: LocaleCode;
  version?: VersionSlug;
  limit?: number;
}): SearchResult[] {
  const query = input.query.trim().toLowerCase();

  if (!query) {
    return [];
  }

  const queryTokens = query.split(/\s+/).filter(Boolean);
  const limit = Math.max(1, Math.min(input.limit ?? 10, 50));

  return buildSearchIndex()
    .map((entry) => {
      const score = scoreEntry(entry, queryTokens);

      return {
        ...entry,
        href:
          input.locale && input.version
            ? buildDocPath(input.locale, input.version, entry.slug)
            : buildDocPath(entry.locale, entry.version, entry.slug),
        score,
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.slug.join("/").localeCompare(right.slug.join("/")))
    .slice(0, limit);
}
