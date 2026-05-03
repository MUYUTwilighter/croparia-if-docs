"use client";

import { createContext, useContext, useMemo } from "react";

import { localeCodes, locales, versionSlugs, versions } from "@/src/lib/docs/config";
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
  if (!doc.isFallback) {
    return null;
  }

  if (doc.isLocaleFallback && doc.isVersionFallback) {
    return `当前页面在 ${doc.requestedLocale}/${doc.requestedVersion} 下没有可用文档，已回退到 ${doc.resolvedLocale}/${doc.resolvedVersion} 的真实来源。`;
  }

  if (doc.isLocaleFallback) {
    return `当前页面在所选语言 ${doc.requestedLocale} 下没有合适译文，当前正在显示 ${doc.resolvedLocale} 内容。`;
  }

  if (doc.isVersionFallback) {
    return `当前页面在所选版本 ${doc.requestedVersion} 下没有独立文档，当前正在显示 ${doc.resolvedVersion} 的内容。`;
  }

  return "当前页面已回退到可用来源页。";
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
        label: versions[version].label,
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
