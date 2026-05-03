import { describe, expect, it } from "vitest";

import { listDocumentSlugs, resolveDoc } from "@/src/lib/docs/resolve-doc";

describe("resolveDoc", () => {
  it("falls back by version first and locale inside each version tier", () => {
    const doc = resolveDoc({
      locale: "en",
      version: "1.1.1a",
      slug: ["player"],
    });

    expect(doc).not.toBeNull();
    expect(doc?.resolvedLocale).toBe("zh");
    expect(doc?.resolvedVersion).toBe("1.1.0a");
    expect(doc?.isFallback).toBe(true);
    expect(doc?.isLocaleFallback).toBe(true);
    expect(doc?.isVersionFallback).toBe(true);
    expect(doc?.fallbackTrace.map(({ locale, version, matchedRelativePath }) => [locale, version, matchedRelativePath])).toEqual([
      ["en", "1.1.1a", null],
      ["zh", "1.1.1a", null],
      ["en", "1.1.0a", null],
      ["zh", "1.1.0a", "player/index.mdx"],
    ]);
  });

  it("returns exact docs without fallback and respects visibility flags", () => {
    const doc = resolveDoc({
      locale: "zh",
      version: "1.1.1a",
      slug: ["removed"],
    });

    expect(doc).not.toBeNull();
    expect(doc?.resolvedLocale).toBe("zh");
    expect(doc?.resolvedVersion).toBe("1.1.1a");
    expect(doc?.isFallback).toBe(false);
    expect(doc?.isNavVisible).toBe(false);
    expect(doc?.isSitemapIncluded).toBe(false);
  });

  it("rejects unsupported locale or version values", () => {
    expect(
      resolveDoc({
        locale: "ja",
        version: "1.1.1a",
        slug: ["player"],
      }),
    ).toBeNull();

    expect(
      resolveDoc({
        locale: "zh",
        version: "9.9.9a",
        slug: ["player"],
      }),
    ).toBeNull();
  });

  it("lists canonical slug keys from the content tree", () => {
    expect(listDocumentSlugs()).toEqual([[], ["player"], ["removed"]]);
  });
});
