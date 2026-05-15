import { describe, expect, it } from "vitest";

import { buildDocMetadata, resolveCanonicalPath } from "@/src/lib/docs/metadata";
import { resolveSidebar } from "@/src/lib/docs/resolve-sidebar";
import type { ResolvedDoc } from "@/src/lib/docs/types";

function createResolvedDoc(overrides: Partial<ResolvedDoc> = {}): ResolvedDoc {
  return {
    requestedLocale: "zh",
    requestedVersion: "1.1.1a",
    requestedSlug: ["player"],
    requestedSection: "player",
    resolvedLocale: "zh",
    resolvedVersion: "1.1.0a",
    resolvedSlug: ["player"],
    resolvedSection: "player",
    sourcePath: "D:/virtual/src/doc/zh/1.1.0a/player/index.md",
    relativeSourcePath: "src/doc/zh/1.1.0a/player/index.md",
    rawContent: "# 玩家\n",
    body: "# 玩家\n",
    frontmatter: {
      title: "玩家",
      desc: "玩家文档入口。",
    },
    fallbackTrace: [],
    isFallback: true,
    isLocaleFallback: false,
    isVersionFallback: true,
    isNavVisible: true,
    isSitemapIncluded: true,
    ...overrides,
  };
}

describe("sidebar and metadata", () => {
  it("derives root header navigation from the current content tree", () => {
    const sidebar = resolveSidebar("zh", "1.1.1a", []);

    expect(sidebar.currentSectionKey).toBeNull();
    expect(sidebar.items).toEqual([]);
    expect(sidebar.headerItems.map((item) => item.text)).toEqual(["矿石魔种文档", "通用", "玩家", "整合包作者", "开发者"]);
  });

  it("treats directory index docs as section roots in the sidebar", () => {
    const sidebar = resolveSidebar("zh", "1.1.1a", ["player"]);

    expect(sidebar.currentSectionKey).toBe("player");
    expect(sidebar.currentSectionTitle).toBe("玩家");
    expect(sidebar.items.map((item) => item.text)).toEqual(["玩家", "快速入门", "自动化思路", "常见问题"]);
  });

  it("uses the resolved source as canonical while still allowing sitemap-backed fallback pages to index", () => {
    const doc = createResolvedDoc({
      requestedLocale: "en",
      requestedVersion: "1.1.1a",
      requestedSlug: ["player"],
      resolvedLocale: "zh",
      resolvedVersion: "1.1.0a",
      resolvedSlug: ["player"],
      relativeSourcePath: "src/doc/zh/1.1.0a/player/index.md",
      isLocaleFallback: true,
      frontmatter: {
        title: "玩家",
        desc: "玩家文档入口。",
      },
    });

    expect(resolveCanonicalPath(doc)).toBe("/doc/zh/1.1.0a/player");

    const metadata = buildDocMetadata(doc);

    expect(metadata.title).toBe("玩家 | Croparia IF Docs");
    expect(metadata.alternates?.canonical).toBe("https://croparia.muyucloud.cool/doc/zh/1.1.0a/player");
    expect(metadata.robots).toEqual({
      index: true,
      follow: true,
    });
  });

  it("keeps non-sitemap pages out of indexing even when the page resolves exactly", () => {
    const doc = createResolvedDoc({
      requestedLocale: "zh",
      requestedVersion: "1.1.1a",
      requestedSlug: ["hidden-note"],
      requestedSection: null,
      resolvedLocale: "zh",
      resolvedVersion: "1.1.1a",
      resolvedSlug: ["hidden-note"],
      resolvedSection: null,
      sourcePath: "D:/virtual/src/doc/zh/1.1.1a/hidden-note.md",
      relativeSourcePath: "src/doc/zh/1.1.1a/hidden-note.md",
      frontmatter: {
        title: "隐藏说明",
        desc: "不参与索引。",
        sitemap: false,
      },
      isFallback: false,
      isLocaleFallback: false,
      isVersionFallback: false,
      isSitemapIncluded: false,
    });

    const metadata = buildDocMetadata(doc);

    expect(metadata.alternates?.canonical).toBe("https://croparia.muyucloud.cool/doc/zh/1.1.1a/hidden-note");
    expect(metadata.robots).toEqual({
      index: false,
      follow: true,
    });
  });
});
