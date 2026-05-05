import path from "node:path";

import { docsConfig, isLocaleCode, isVersionSlug, siteConfig } from "@/src/lib/docs/config";
import type { LocaleCode, ResolvedDoc, VersionSlug } from "@/src/lib/docs/types";

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

function splitHrefParts(href: string) {
  const hashIndex = href.indexOf("#");
  const searchIndex = href.indexOf("?");
  const cutoffCandidates = [hashIndex, searchIndex].filter((value) => value >= 0);
  const cutoffIndex = cutoffCandidates.length > 0 ? Math.min(...cutoffCandidates) : -1;

  if (cutoffIndex === -1) {
    return {
      pathname: href,
      suffix: "",
    };
  }

  return {
    pathname: href.slice(0, cutoffIndex),
    suffix: href.slice(cutoffIndex),
  };
}

function isRelativeDocHref(pathname: string) {
  if (pathname === "." || pathname === ".." || pathname.startsWith("./") || pathname.startsWith("../")) {
    return true;
  }

  return pathname.length > 0 && !pathname.startsWith("/");
}

function buildDocBaseSlug(doc: Pick<ResolvedDoc, "requestedSlug" | "relativeSourcePath">) {
  const normalizedSourcePath = doc.relativeSourcePath.replace(/\\/g, "/");
  const isIndexSource =
    normalizedSourcePath.endsWith("/index.mdx") ||
    normalizedSourcePath.endsWith("/index.md") ||
    normalizedSourcePath === "index.mdx" ||
    normalizedSourcePath === "index.md";

  return isIndexSource ? doc.requestedSlug : doc.requestedSlug.slice(0, -1);
}

export function resolveRelativeDocHref(doc: Pick<ResolvedDoc, "requestedLocale" | "requestedVersion" | "requestedSlug" | "relativeSourcePath">, href: string) {
  const trimmedHref = href.trim();

  if (!trimmedHref || trimmedHref.startsWith("#") || trimmedHref.startsWith("/") || /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(trimmedHref)) {
    return null;
  }

  const { pathname, suffix } = splitHrefParts(trimmedHref);

  if (!isRelativeDocHref(pathname)) {
    return null;
  }

  const baseSlug = buildDocBaseSlug(doc);
  const normalizedPath = path.posix.normalize(path.posix.join("/", ...baseSlug, pathname));
  const resolvedSlug = normalizedPath === "/" ? [] : normalizedPath.split("/").filter(Boolean);

  return `${buildDocPath(doc.requestedLocale, doc.requestedVersion, resolvedSlug)}${suffix}`;
}
