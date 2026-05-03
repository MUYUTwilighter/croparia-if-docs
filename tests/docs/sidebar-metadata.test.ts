import { describe, expect, it } from "vitest";

import { buildDocMetadata, resolveCanonicalPath } from "@/src/lib/docs/metadata";
import { resolveDoc } from "@/src/lib/docs/resolve-doc";
import { resolveSidebar } from "@/src/lib/docs/resolve-sidebar";
import { resolveStandaloneRootDoc } from "@/src/lib/docs/root-docs";

describe("sidebar and metadata", () => {
  it("keeps hidden root docs out of header navigation", () => {
    const sidebar = resolveSidebar("zh", "1.1.1a", []);

    expect(sidebar.currentSectionKey).toBeNull();
    expect(sidebar.items).toEqual([]);
    expect(sidebar.headerItems.map((item) => item.text)).toEqual(["Croparia IF 文档", "玩家文档占位页"]);
  });

  it("resolves standalone root docs that are not part of a section tree", () => {
    const doc = resolveStandaloneRootDoc("zh", "1.1.1a", ["removed"]);

    expect(doc).not.toBeNull();
    expect(doc?.requestedSlug).toEqual(["removed"]);
    expect(doc?.frontmatter.title).toBe("测试页面：已移除");
  });

  it("uses the resolved source as canonical and marks fallback pages as noindex", () => {
    const doc = resolveDoc({
      locale: "en",
      version: "1.1.1a",
      slug: ["player"],
    });

    expect(doc).not.toBeNull();
    expect(resolveCanonicalPath(doc!)).toBe("/doc/zh/1.1.0a/player");

    const metadata = buildDocMetadata(doc!);

    expect(metadata.title).toBe("玩家文档占位页 | Croparia IF Docs");
    expect(metadata.alternates?.canonical).toBe("https://croparia.muyucloud.cool/doc/zh/1.1.0a/player");
    expect(metadata.robots).toEqual({
      index: false,
      follow: true,
    });
  });

  it("keeps exact but non-sitemap pages out of indexing", () => {
    const doc = resolveDoc({
      locale: "zh",
      version: "1.1.1a",
      slug: ["removed"],
    });

    expect(doc).not.toBeNull();

    const metadata = buildDocMetadata(doc!);

    expect(metadata.alternates?.canonical).toBe("https://croparia.muyucloud.cool/doc/zh/1.1.1a/removed");
    expect(metadata.robots).toEqual({
      index: false,
      follow: true,
    });
  });
});
