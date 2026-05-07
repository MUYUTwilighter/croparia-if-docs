import { cache } from "react";

import { contentSignal } from "@/src/.generated/docs/content-signal";
import { listDocumentSlugs, resolveDoc } from "@/src/lib/docs/resolve-doc";
import type { LocaleCode, ResolvedDoc, VersionSlug } from "@/src/lib/docs/types";

function normalizePathSeparators(value: string) {
  return value.replace(/\\/g, "/");
}

function isSectionRootDoc(doc: ResolvedDoc) {
  if (doc.requestedSlug.length !== 1) {
    return false;
  }

  const segment = doc.requestedSlug[0];

  if (!segment) {
    return false;
  }

  const normalizedSourcePath = normalizePathSeparators(doc.relativeSourcePath);
  return normalizedSourcePath.endsWith(`/${segment}/index.mdx`) || normalizedSourcePath.endsWith(`/${segment}/index.md`);
}

const listResolvedDocsCached = cache((locale: LocaleCode, version: VersionSlug, signal: string) => {
  void signal;

  return listDocumentSlugs()
    .map((slug) => resolveDoc({ locale, version, slug }))
    .filter((doc): doc is ResolvedDoc => Boolean(doc));
});

export function listResolvedDocs(locale: LocaleCode, version: VersionSlug) {
  return listResolvedDocsCached(locale, version, contentSignal);
}

function listSectionKeys(locale: LocaleCode, version: VersionSlug) {
  return new Set(
    listResolvedDocs(locale, version)
      .filter((doc) => doc.requestedSlug.length > 1 || isSectionRootDoc(doc))
      .map((doc) => doc.requestedSlug[0] ?? null)
      .filter((value): value is string => Boolean(value)),
  );
}

export function resolveStandaloneRootDoc(locale: LocaleCode, version: VersionSlug, slug: string[]): ResolvedDoc | null {
  if (slug.length !== 1) {
    return null;
  }

  const sectionKeys = listSectionKeys(locale, version);

  if (sectionKeys.has(slug[0])) {
    return null;
  }

  return resolveDoc({ locale, version, slug });
}
