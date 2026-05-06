import { describe, expect, it } from "vitest";

import { resolveSidebar } from "@/src/lib/docs/resolve-sidebar";
import type { SidebarItem } from "@/src/lib/docs/types";

function collectHrefs(items: SidebarItem[]): string[] {
  return items.flatMap((item) => [item.href, ...collectHrefs(item.items ?? [])]);
}

describe("resolveSidebar", () => {
  it("keeps section navigation visible when the root docs home is nonav", () => {
    const sidebar = resolveSidebar("zh", "1.1.1a", ["general"]);
    const hrefs = collectHrefs(sidebar.items);

    expect(sidebar.currentSectionKey).toBe("general");
    expect(sidebar.currentSectionTitle).toBe("通用");
    expect(sidebar.headerItems.some((item) => item.key === "general")).toBe(true);
    expect(sidebar.items.length).toBeGreaterThan(0);
    expect(sidebar.items[0]?.href).toBe("/doc/zh/1.1.1a/general");
    expect(hrefs.some((href) => href.includes("/general/concepts/"))).toBe(true);
  });
});
