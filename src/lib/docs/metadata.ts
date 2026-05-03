import type { Metadata } from "next";

import { docsConfig, getDocsHomeDescription, getDocsHomeTitle, localeCodes, siteConfig } from "@/src/lib/docs/config";
import { buildDocPath, toAbsoluteUrl } from "@/src/lib/docs/routing";
import { resolveDoc } from "@/src/lib/docs/resolve-doc";
import type { LocaleCode, ResolvedDoc, VersionSlug } from "@/src/lib/docs/types";

export function resolveCanonicalPath(doc: ResolvedDoc) {
  return buildDocPath(doc.resolvedLocale, doc.resolvedVersion, doc.resolvedSlug);
}

function buildLocaleAlternates(doc: ResolvedDoc) {
  const languages: Record<string, string> = {};

  for (const locale of localeCodes) {
    const alternateDoc = resolveDoc({
      locale,
      version: doc.requestedVersion,
      slug: doc.requestedSlug,
    });

    if (!alternateDoc) {
      continue;
    }

    if (alternateDoc.resolvedLocale !== locale) {
      continue;
    }

    languages[locale] = toAbsoluteUrl(buildDocPath(locale, doc.requestedVersion, doc.requestedSlug));
  }

  if (!languages[docsConfig.defaultLocale]) {
    languages[docsConfig.defaultLocale] = toAbsoluteUrl(
      buildDocPath(doc.resolvedLocale, doc.resolvedVersion, doc.resolvedSlug),
    );
  }

  return languages;
}

export function buildDocMetadata(doc: ResolvedDoc): Metadata {
  const canonicalPath = resolveCanonicalPath(doc);
  const canonicalUrl = toAbsoluteUrl(canonicalPath);
  const homeTitle = getDocsHomeTitle(doc.requestedLocale);
  const pageTitle =
    doc.frontmatter.title ??
    (doc.requestedSlug.length === 0 ? homeTitle : doc.requestedSlug[doc.requestedSlug.length - 1] ?? "未知标题");
  const title = doc.requestedSlug.length === 0 ? pageTitle : `${pageTitle} | ${homeTitle}`;
  const description =
    doc.frontmatter.desc ??
    `请求 ${doc.requestedLocale}/${doc.requestedVersion}，实际命中 ${doc.resolvedLocale}/${doc.resolvedVersion}。`;
  const isExactSource =
    doc.requestedLocale === doc.resolvedLocale && doc.requestedVersion === doc.resolvedVersion;
  const requestedPath = buildDocPath(doc.requestedLocale, doc.requestedVersion, doc.requestedSlug);
  const shouldIndex = isExactSource && doc.isSitemapIncluded;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: doc.isSitemapIncluded ? buildLocaleAlternates(doc) : undefined,
    },
    robots: {
      index: shouldIndex,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.siteName,
      locale: doc.resolvedLocale === "zh" ? "zh_CN" : "en_US",
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    other: shouldIndex
      ? undefined
      : {
          "x-doc-requested-path": requestedPath,
          "x-doc-resolved-path": canonicalPath,
        },
  };
}

export function buildDocsHomeMetadata(locale: LocaleCode, version: VersionSlug): Metadata {
  const title = getDocsHomeTitle(locale);
  const description = getDocsHomeDescription(locale);
  const canonicalPath = buildDocPath(locale, version);
  const canonicalUrl = toAbsoluteUrl(canonicalPath);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.siteName,
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
