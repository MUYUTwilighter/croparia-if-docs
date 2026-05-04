"use client";

import { createContext, useContext, useMemo } from "react";

import { localeCodes, locales, versionSlugs } from "@/src/lib/docs/config";
import { buildDocPath } from "@/src/lib/docs/routing";
import type { LocaleCode, ResolvedDoc, ResolvedSidebar, VersionSlug } from "@/src/lib/docs/types";

interface DocContextValue {
  doc: ResolvedDoc;
  sidebar: ResolvedSidebar;
  requestedPath: string;
  resolvedPath: string;
  canonicalPath: string;
}

const DocContext = createContext<DocContextValue | null>(null);

function getFallbackMessage(doc: ResolvedDoc) {
  if (!doc.isFallback || !doc.isLocaleFallback) {
    return null;
  }

  const requestedLocaleLabel = locales[doc.requestedLocale].label;
  const resolvedLocaleLabel = locales[doc.resolvedLocale].label;

  if (doc.requestedLocale === "en") {
    if (doc.isVersionFallback) {
      return `This page is not available in ${requestedLocaleLabel} for ${doc.requestedVersion}. Showing ${resolvedLocaleLabel} content from ${doc.resolvedVersion} instead.`;
    }

    return `This page is not available in ${requestedLocaleLabel}. Showing ${resolvedLocaleLabel} content instead.`;
  }

  if (doc.isVersionFallback) {
    return `当前页面暂无 ${requestedLocaleLabel} 版本内容，正在显示 ${resolvedLocaleLabel} 的 ${doc.resolvedVersion} 文档。`;
  }

  return `当前页面暂无 ${requestedLocaleLabel} 译文，正在显示 ${resolvedLocaleLabel} 内容。`;
}

export function DocProvider({
  value,
  children,
}: {
  value: DocContextValue;
  children: React.ReactNode;
}) {
  return <DocContext.Provider value={value}>{children}</DocContext.Provider>;
}

export function useDocContext() {
  const context = useContext(DocContext);

  if (!context) {
    throw new Error("useDocContext must be used inside <DocProvider>.");
  }

  return context;
}

export function useOptionalDocContext() {
  return useContext(DocContext);
}

export function useDocNavigation() {
  const { sidebar } = useDocContext();

  return {
    headerItems: sidebar.headerItems,
    sidebarItems: sidebar.items,
    currentSectionKey: sidebar.currentSectionKey,
    currentSectionTitle: sidebar.currentSectionTitle,
  };
}

export function useFallbackNotice() {
  const { doc } = useDocContext();
  const message = getFallbackMessage(doc);

  return {
    isFallback: doc.isFallback,
    isLocaleFallback: doc.isLocaleFallback,
    isVersionFallback: doc.isVersionFallback,
    shouldDisplay: Boolean(message),
    message,
  };
}

export function useDiscoveryState() {
  const { doc } = useDocContext();

  return {
    isNavVisible: doc.isNavVisible,
    isSitemapIncluded: doc.isSitemapIncluded,
    isHidden: !doc.isNavVisible || !doc.isSitemapIncluded,
  };
}

export function useLocaleSwitcher() {
  const { doc } = useDocContext();

  return useMemo(
    () => ({
      currentLocale: doc.requestedLocale,
      locales: localeCodes.map((locale) => ({
        code: locale,
        label: locales[locale].label,
        href: buildDocPath(locale, doc.requestedVersion, doc.requestedSlug),
        isCurrent: locale === doc.requestedLocale,
      })),
      buildLocaleHref(locale: LocaleCode) {
        return buildDocPath(locale, doc.requestedVersion, doc.requestedSlug);
      },
    }),
    [doc.requestedLocale, doc.requestedSlug, doc.requestedVersion],
  );
}

export function useVersionSwitcher() {
  const { doc } = useDocContext();

  return useMemo(
    () => ({
      currentVersion: doc.requestedVersion,
      versions: versionSlugs.map((version) => ({
        slug: version,
        label: version,
        href: buildDocPath(doc.requestedLocale, version, doc.requestedSlug),
        isCurrent: version === doc.requestedVersion,
      })),
      buildVersionHref(version: VersionSlug) {
        return buildDocPath(doc.requestedLocale, version, doc.requestedSlug);
      },
    }),
    [doc.requestedLocale, doc.requestedSlug, doc.requestedVersion],
  );
}
