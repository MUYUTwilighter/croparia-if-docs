"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useOptionalDocContext } from "@/src/components/docs/doc-context";
import { docsConfig, localeCodes, versionSlugs } from "@/src/lib/docs/config";
import type { LocaleCode, SearchResult, VersionSlug } from "@/src/lib/docs/types";

interface UseDocSearchOptions {
  initialQuery?: string;
  locale?: LocaleCode;
  version?: VersionSlug;
  limit?: number;
  enabled?: boolean;
  debounceMs?: number;
}

interface SearchResponse {
  query: string;
  total: number;
  results: SearchResult[];
}

function isLocaleCode(value: string): value is LocaleCode {
  return localeCodes.includes(value as LocaleCode);
}

function isVersionSlug(value: string): value is VersionSlug {
  return versionSlugs.includes(value as VersionSlug);
}

export function buildSearchRequestUrl(input: {
  query: string;
  locale?: LocaleCode;
  version?: VersionSlug;
  limit?: number;
}) {
  const params = new URLSearchParams();
  params.set("q", input.query);

  if (input.locale) {
    params.set("locale", input.locale);
  }

  if (input.version) {
    params.set("version", input.version);
  }

  if (typeof input.limit === "number") {
    params.set("limit", String(input.limit));
  }

  return `/api/search?${params.toString()}`;
}

export function useDocSearch(options: UseDocSearchOptions = {}) {
  const docContext = useOptionalDocContext();
  const [query, setQuery] = useState(options.initialQuery ?? "");
  const deferredQuery = useDeferredValue(query);
  const [debouncedQuery, setDebouncedQuery] = useState(deferredQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastCompletedRequestKey, setLastCompletedRequestKey] = useState<string | null>(null);
  const locale = options.locale ?? docContext?.doc.requestedLocale ?? docsConfig.defaultLocale;
  const version = options.version ?? docContext?.doc.requestedVersion ?? docsConfig.currentVersion;
  const limit = options.limit ?? 10;
  const enabled = options.enabled ?? true;
  const debounceMs = options.debounceMs ?? 150;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(deferredQuery);
    }, debounceMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [debounceMs, deferredQuery]);

  useEffect(() => {
    const normalizedQuery = debouncedQuery.trim();

    if (!enabled || !normalizedQuery) {
      return;
    }

    const requestKey = `${locale}:${version}:${limit}:${normalizedQuery}`;
    const controller = new AbortController();
    const url = buildSearchRequestUrl({
      query: normalizedQuery,
      locale,
      version,
      limit,
    });

    fetch(url, {
      method: "GET",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Search request failed with status ${response.status}.`);
        }

        const payload = (await response.json()) as SearchResponse;
        setResults(payload.results);
        setTotal(payload.total);
        setError(null);
        setLastCompletedRequestKey(requestKey);
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setResults([]);
        setTotal(0);
        setError(reason instanceof Error ? reason.message : "Search request failed.");
        setLastCompletedRequestKey(requestKey);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, enabled, limit, locale, version]);

  const normalizedQuery = debouncedQuery.trim();
  const hasActiveQuery = enabled && normalizedQuery.length > 0;
  const requestKey = hasActiveQuery ? `${locale}:${version}:${limit}:${normalizedQuery}` : null;

  return useMemo(
    () => ({
      query,
      setQuery,
      results: hasActiveQuery ? results : [],
      total: hasActiveQuery ? total : 0,
      isLoading: hasActiveQuery ? requestKey !== lastCompletedRequestKey : false,
      error: hasActiveQuery && requestKey === lastCompletedRequestKey ? error : null,
      locale,
      version,
      requestUrl:
        normalizedQuery.length > 0
          ? buildSearchRequestUrl({
              query: normalizedQuery,
              locale,
              version,
              limit,
            })
          : null,
    }),
    [error, hasActiveQuery, lastCompletedRequestKey, limit, locale, normalizedQuery, query, requestKey, results, total, version],
  );
}

export function parseSearchParams(input: URLSearchParams) {
  const query = input.get("q")?.trim() ?? "";
  const locale = input.get("locale");
  const version = input.get("version");
  const limit = Number(input.get("limit") ?? "10");

  return {
    query,
    locale: locale && isLocaleCode(locale) ? locale : undefined,
    version: version && isVersionSlug(version) ? version : undefined,
    limit: Number.isFinite(limit) ? limit : 10,
  };
}
