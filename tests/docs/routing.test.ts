import { describe, expect, it } from "vitest";

import {
  buildDocPath,
  buildNormalizedDocPath,
  buildShortRouteRedirect,
  normalizeLocale,
  normalizeSlug,
  normalizeVersion,
  resolveRelativeDocHref,
  resolvePreferredLocale,
  toAbsoluteUrl,
} from "@/src/lib/docs/routing";

describe("routing helpers", () => {
  it("normalizes locale, version, and slug values", () => {
    expect(normalizeLocale("en")).toBe("en");
    expect(normalizeLocale("es")).toBe("es");
    expect(normalizeLocale("fr")).toBe("zh");
    expect(normalizeVersion("1.1.0a")).toBe("1.1.0a");
    expect(normalizeVersion("2.0.0")).toBe("1.1.0a");
    expect(normalizeSlug(["player", "", "index"])).toEqual(["player", "index"]);
  });

  it("builds full and short normalized doc paths", () => {
    expect(buildDocPath("zh", "1.1.1a", ["player"])).toBe("/doc/zh/1.1.1a/player");
    expect(buildNormalizedDocPath({ locale: "en", version: "1.1.0a", slug: ["removed"] })).toBe("/doc/en/1.1.0a/removed");
    expect(buildNormalizedDocPath({ locale: "fr", version: "invalid", slug: ["player"] })).toBe("/doc/zh/1.1.1a/player");
    expect(buildShortRouteRedirect([])).toBe("/doc/zh/1.1.1a");
    expect(buildShortRouteRedirect(["1.1.0a", "player"])).toBe("/doc/zh/1.1.0a/player");
    expect(buildShortRouteRedirect(["player"])).toBe("/doc/zh/1.1.1a/player");
  });

  it("picks the preferred locale from request headers", () => {
    expect(resolvePreferredLocale("en-US,en;q=0.9,zh;q=0.8")).toBe("en");
    expect(resolvePreferredLocale("es-ES,es;q=0.9,en;q=0.8")).toBe("es");
    expect(resolvePreferredLocale("fr-CA,zh;q=0.9")).toBe("zh");
    expect(resolvePreferredLocale(null)).toBe("zh");
  });

  it("converts internal paths to absolute urls", () => {
    expect(toAbsoluteUrl("/doc/zh/1.1.1a/player")).toBe("https://croparia.muyucloud.cool/doc/zh/1.1.1a/player");
  });

  it("rewrites relative doc links against authored document locations", () => {
    expect(
      resolveRelativeDocHref(
        {
          requestedLocale: "zh",
          requestedVersion: "1.1.1a",
          requestedSlug: [],
          relativeSourcePath: "src/doc/zh/1.1.0a/index.mdx",
        },
        "./player",
      ),
    ).toBe("/doc/zh/1.1.1a/player");

    expect(
      resolveRelativeDocHref(
        {
          requestedLocale: "zh",
          requestedVersion: "1.1.1a",
          requestedSlug: [],
          relativeSourcePath: "src/doc/zh/1.1.0a/index.mdx",
        },
        "general",
      ),
    ).toBe("/doc/zh/1.1.1a/general");

    expect(
      resolveRelativeDocHref(
        {
          requestedLocale: "zh",
          requestedVersion: "1.1.1a",
          requestedSlug: ["player"],
          relativeSourcePath: "src/doc/zh/1.1.0a/player/index.mdx",
        },
        "./faq#top",
      ),
    ).toBe("/doc/zh/1.1.1a/player/faq#top");

    expect(
      resolveRelativeDocHref(
        {
          requestedLocale: "zh",
          requestedVersion: "1.1.1a",
          requestedSlug: [],
          relativeSourcePath: "src/doc/zh/1.1.0a/index.mdx",
        },
        "./example.md#anchor",
      ),
    ).toBe("/doc/zh/1.1.1a/example#anchor");

    expect(
      resolveRelativeDocHref(
        {
          requestedLocale: "zh",
          requestedVersion: "1.1.1a",
          requestedSlug: [],
          relativeSourcePath: "src/doc/zh/1.1.0a/index.mdx",
        },
        "./player/index.md#overview",
      ),
    ).toBe("/doc/zh/1.1.1a/player#overview");

    expect(
      resolveRelativeDocHref(
        {
          requestedLocale: "en",
          requestedVersion: "1.1.1a",
          requestedSlug: ["removed"],
          relativeSourcePath: "src/doc/zh/1.1.1a/removed.mdx",
        },
        "./player?mode=full",
      ),
    ).toBe("/doc/en/1.1.1a/player?mode=full");
  });
});
