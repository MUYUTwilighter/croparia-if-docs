export type LocaleCode = "zh" | "en";

export type VersionSlug = "1.1.0a" | "1.1.1a";

export interface DocsRuntimeConfig {
  defaultLocale: LocaleCode;
  defaultContentVersion: VersionSlug;
  currentVersion: VersionSlug;
}

export interface LocaleDefinition {
  code: LocaleCode;
  label: string;
  fallbackLocales?: LocaleCode[];
}

export interface VersionDefinition {
  slug: VersionSlug;
  label: string;
  inheritsFrom: VersionSlug | null;
}

export interface DocFrontmatter {
  title?: string;
  desc?: string;
  nonav?: boolean;
  navOrder?: number;
  sitemap?: boolean;
  metadata?: Record<string, string | number | boolean>;
}

export interface SidebarItem {
  text: string;
  href: string;
  items?: SidebarItem[];
}

export interface SidebarSection {
  key: string;
  text: string;
  href: string;
  items: SidebarItem[];
}

export interface ResolvedSidebar {
  headerItems: Array<{
    key: string;
    text: string;
    href: string;
    isCurrent: boolean;
    kind: "home" | "page" | "section";
  }>;
  currentSectionKey: string | null;
  currentSectionTitle: string | null;
  items: SidebarItem[];
}

export interface FallbackAttempt {
  locale: LocaleCode;
  version: VersionSlug;
  relativeCandidates: string[];
  matchedRelativePath: string | null;
}

export interface ResolveDocInput {
  locale: string;
  version: string;
  slug?: string[];
}

export interface ResolvedDoc {
  requestedLocale: LocaleCode;
  requestedVersion: VersionSlug;
  requestedSlug: string[];
  requestedSection: string | null;
  resolvedLocale: LocaleCode;
  resolvedVersion: VersionSlug;
  resolvedSlug: string[];
  resolvedSection: string | null;
  sourcePath: string;
  relativeSourcePath: string;
  rawContent: string;
  body: string;
  frontmatter: DocFrontmatter;
  fallbackTrace: FallbackAttempt[];
  isFallback: boolean;
  isLocaleFallback: boolean;
  isVersionFallback: boolean;
  isNavVisible: boolean;
  isSitemapIncluded: boolean;
}

export interface SearchIndexEntry {
  title: string;
  description: string;
  locale: LocaleCode;
  version: VersionSlug;
  slug: string[];
  section: string | null;
  canonicalHref: string;
  searchableText: string;
  headings: string[];
  isNavVisible: boolean;
  isSitemapIncluded: boolean;
}

export interface SearchResult {
  title: string;
  description: string;
  locale: LocaleCode;
  version: VersionSlug;
  slug: string[];
  section: string | null;
  canonicalHref: string;
  href: string;
  score: number;
  headings: string[];
  isNavVisible: boolean;
  isSitemapIncluded: boolean;
}
