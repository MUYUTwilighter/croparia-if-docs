import { docsConfig, isLocaleCode, isVersionSlug, siteConfig } from "@/src/lib/docs/config";
import type { LocaleCode, VersionSlug } from "@/src/lib/docs/types";

export function normalizeLocale(locale: string): LocaleCode {
  return isLocaleCode(locale) ? locale : docsConfig.defaultLocale;
}

export function normalizeVersion(version: string): VersionSlug {
  return isVersionSlug(version) ? version : docsConfig.defaultContentVersion;
}

export function normalizeSlug(slug?: string[]) {
  return (slug ?? []).filter(Boolean);
}

export function buildDocPath(locale: LocaleCode, version: VersionSlug, slug: string[] = []) {
  const pathname = `/doc/${locale}/${version}${slug.length > 0 ? `/${slug.join("/")}` : ""}`;
  return pathname.replace(/\/+$/, "") || "/";
}

export function toAbsoluteUrl(pathname: string) {
  const origin = siteConfig.siteOrigin.replace(/\/+$/, "");
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${origin}${normalizedPathname}`;
}

export function resolvePreferredLocale(acceptLanguageHeader: string | null) {
  if (!acceptLanguageHeader) {
    return docsConfig.defaultLocale;
  }

  const candidates = acceptLanguageHeader
    .split(",")
    .map((item) => item.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean);

  for (const candidate of candidates) {
    if (isLocaleCode(candidate)) {
      return candidate;
    }

    const baseLanguage = candidate.split("-")[0];

    if (baseLanguage && isLocaleCode(baseLanguage)) {
      return baseLanguage;
    }
  }

  return docsConfig.defaultLocale;
}

export function buildNormalizedDocPath(input: {
  locale?: string | null;
  version?: string | null;
  slug?: string[];
}) {
  const locale = input.locale && isLocaleCode(input.locale) ? input.locale : docsConfig.defaultLocale;
  const version = input.version && isVersionSlug(input.version) ? input.version : docsConfig.currentVersion;

  return buildDocPath(locale, version, normalizeSlug(input.slug));
}

export function buildShortRouteRedirect(slug: string[]) {
  const normalized = normalizeSlug(slug);

  if (normalized.length === 0) {
    return buildDocPath(docsConfig.defaultLocale, docsConfig.currentVersion);
  }

  const [first, ...rest] = normalized;

  if (isVersionSlug(first)) {
    return buildDocPath(docsConfig.defaultLocale, first, rest);
  }

  return buildDocPath(docsConfig.defaultLocale, docsConfig.currentVersion, normalized);
}
