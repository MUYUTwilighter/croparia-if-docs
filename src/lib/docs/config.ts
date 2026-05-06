import type {
  DocsRuntimeConfig,
  LocaleCode,
  LocaleDefinition,
  VersionDefinition,
  VersionSlug,
} from "@/src/lib/docs/types";

export const docsConfig: DocsRuntimeConfig = {
  defaultLocale: "zh",
  defaultContentVersion: "1.1.0a",
  currentVersion: "1.1.1a",
};

export const siteConfig = {
  siteName: "Croparia IF Docs",
  siteOrigin: "https://croparia.muyucloud.cool",
  docsHomeTitles: {
    zh: "矿石魔种文档",
    en: "Croparia IF Docs",
  } as Record<LocaleCode, string>,
  docsHomeDescriptions: {
    zh: "矿石魔种（Croparia IF）官方文档站点。",
    en: "Documentation and developer references for Croparia IF.",
  } as Record<LocaleCode, string>,
};

export const locales: Record<LocaleCode, LocaleDefinition> = {
  zh: {
    code: "zh",
    label: "简体中文",
  },
  en: {
    code: "en",
    label: "English",
    fallbackLocales: ["zh"],
  },
};

export const versions: Record<VersionSlug, VersionDefinition> = {
  "1.1.0a": {
    parent: null,
  },
  "1.1.1a": {
    parent: "1.1.0a",
  },
};

export const localeCodes = Object.keys(locales) as LocaleCode[];
export const versionSlugs = Object.keys(versions) as VersionSlug[];

export function isLocaleCode(value: string): value is LocaleCode {
  return value in locales;
}

export function isVersionSlug(value: string): value is VersionSlug {
  return value in versions;
}

export function getLocaleDefinition(locale: LocaleCode) {
  return locales[locale];
}

export function getVersionDefinition(version: VersionSlug) {
  return versions[version];
}

export function getDocsHomeTitle(locale: LocaleCode) {
  return siteConfig.docsHomeTitles[locale] ?? siteConfig.siteName;
}

export function getDocsHomeDescription(locale: LocaleCode) {
  return siteConfig.docsHomeDescriptions[locale] ?? siteConfig.siteName;
}
