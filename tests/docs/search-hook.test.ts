import { describe, expect, it } from "vitest";

import { buildSearchRequestUrl, parseSearchParams } from "@/src/components/docs/use-doc-search";

describe("doc search helpers", () => {
  it("builds search request urls with document context", () => {
    expect(
      buildSearchRequestUrl({
        query: "player guide",
        locale: "en",
        version: "1.1.1a",
        limit: 5,
      }),
    ).toBe("/api/search?q=player+guide&locale=en&version=1.1.1a&limit=5");
  });

  it("parses and normalizes search params", () => {
    const parsed = parseSearchParams(new URLSearchParams("q=test&locale=fr&version=1.1.0a&limit=12"));

    expect(parsed).toEqual({
      query: "test",
      locale: undefined,
      version: "1.1.0a",
      limit: 12,
    });
  });
});
