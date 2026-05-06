"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, ButtonBase, Collapse, List, Paper, Typography } from "@mui/material";
import { useDocContext } from "@/src/components/docs/doc-context";

interface OutlineItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, "-")
    .replace(/[^\p{L}\p{N}\-_]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function collectOutlineItems(root: HTMLElement) {
  const headings = Array.from(root.querySelectorAll<HTMLElement>("h2, h3, h4"));
  const counts = new Map<string, number>();

  return headings
    .map((heading) => {
      const text = heading.textContent?.trim() ?? "";
      if (!text) {
        return null;
      }

      let id = heading.id.trim();
      if (!id) {
        const base = slugify(text) || "section";
        const count = counts.get(base) ?? 0;
        counts.set(base, count + 1);
        id = count === 0 ? base : `${base}-${count + 1}`;
        heading.id = id;
      }

      const level = Number(heading.tagName.slice(1));
      return { id, text, level };
    })
    .filter((item): item is OutlineItem => Boolean(item));
}

function pickActiveItem(items: OutlineItem[]) {
  let activeId = items[0]?.id ?? "";
  let smallestPositiveTop = Number.POSITIVE_INFINITY;

  for (const item of items) {
    const element = document.getElementById(item.id);
    if (!element) {
      continue;
    }

    const top = element.getBoundingClientRect().top;
    if (top <= 140) {
      activeId = item.id;
    } else if (top < smallestPositiveTop) {
      smallestPositiveTop = top;
      if (!activeId) {
        activeId = item.id;
      }
    }
  }

  return activeId;
}

export function DocOutline() {
  const pathname = usePathname();
  const { doc } = useDocContext();
  const [items, setItems] = useState<OutlineItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".doc-content");
    if (!root) {
      setItems([]);
      setActiveId("");
      return;
    }

    const nextItems = collectOutlineItems(root);
    setItems(nextItems);
    setActiveId(pickActiveItem(nextItems));

    const handleScroll = () => setActiveId(pickActiveItem(nextItems));
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [pathname]);

  const hasItems = items.length > 0;
  const pageTitle = useMemo(() => doc.frontmatter.title ?? "当前页面", [doc.frontmatter.title]);

  return (
    <Paper
      elevation={0}
      sx={{
        display: { xs: "block", xl: "block" },
        border: 1,
        borderColor: "divider",
        overflow: "hidden",
        position: { xl: "sticky" },
        top: { xl: 96 },
      }}
    >
      <ButtonBase
        onClick={() => setMobileOpen((value) => !value)}
        sx={{
          width: "100%",
          display: { xs: "flex", xl: "none" },
          justifyContent: "space-between",
          alignItems: "flex-start",
          px: 2.25,
          py: 1.75,
          textAlign: "left",
          borderBottom: mobileOpen ? 1 : 0,
          borderColor: "divider",
          bgcolor: "rgba(93, 127, 79, 0.025)",
        }}
      >
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: "0.16em", fontWeight: 700, fontSize: "0.68rem" }}>
            In This Page
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 0.35, fontWeight: 600, lineHeight: 1.35 }}>
            {pageTitle}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.6, display: "block", lineHeight: 1.6 }}>
            {hasItems ? `本页共 ${items.length} 个可跳转章节` : "当前页面没有可提取的二级及以下标题。"}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, display: "inline-flex", alignItems: "center" }}>
          {mobileOpen ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}
        </Typography>
      </ButtonBase>
      <Box
        sx={{
          display: { xs: "none", xl: "block" },
          px: 2.25,
          py: 1.75,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "rgba(93, 127, 79, 0.025)",
        }}
      >
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: "0.16em", fontWeight: 700, fontSize: "0.68rem" }}>
          In This Page
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 0.35, fontWeight: 600, lineHeight: 1.35 }}>
          {pageTitle}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.6, display: "block", lineHeight: 1.6 }}>
          {hasItems ? `本页共 ${items.length} 个可跳转章节` : "当前页面没有可提取的二级及以下标题。"}
        </Typography>
      </Box>

      <Collapse in={mobileOpen || false} timeout="auto" unmountOnExit={false} sx={{ display: { xs: "block", xl: "none" } }}>
        {hasItems ? (
          <List disablePadding sx={{ px: 1.25, py: 1.25, display: "flex", flexDirection: "column", gap: 0.4 }}>
            {items.map((item) => {
              const isActive = item.id === activeId;
              const indent = Math.max(0, item.level - 2) * 1.5;

              return (
                <ButtonBase
                  key={item.id}
                  component={Link}
                  href={`#${item.id}`}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    justifyContent: "flex-start",
                    textAlign: "left",
                    borderRadius: 0,
                    px: 1,
                    py: 0.7,
                    pl: 1 + indent,
                    borderLeft: "2px solid",
                    borderLeftColor: isActive ? "primary.main" : "transparent",
                    bgcolor: isActive ? "rgba(93, 127, 79, 0.06)" : "transparent",
                    transition: "background-color 0.18s ease, border-left-color 0.18s ease, transform 0.18s ease",
                    "&:hover": {
                      bgcolor: "rgba(93, 127, 79, 0.05)",
                      transform: "translateX(2px)",
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isActive ? 700 : item.level === 2 ? 600 : 500,
                      color: isActive ? "primary.dark" : "text.primary",
                      lineHeight: 1.45,
                      textTransform: "none",
                    }}
                  >
                    {item.text}
                  </Typography>
                </ButtonBase>
              );
            })}
          </List>
        ) : null}
      </Collapse>

      {hasItems ? (
        <List disablePadding sx={{ display: { xs: "none", xl: "flex" }, px: 1.25, py: 1.25, flexDirection: "column", gap: 0.4 }}>
          {items.map((item) => {
            const isActive = item.id === activeId;
            const indent = Math.max(0, item.level - 2) * 1.5;

            return (
              <ButtonBase
                key={item.id}
                component={Link}
                href={`#${item.id}`}
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  borderRadius: 0,
                  px: 1,
                  py: 0.7,
                  pl: 1 + indent,
                  borderLeft: "2px solid",
                  borderLeftColor: isActive ? "primary.main" : "transparent",
                  bgcolor: isActive ? "rgba(93, 127, 79, 0.06)" : "transparent",
                  transition: "background-color 0.18s ease, border-left-color 0.18s ease, transform 0.18s ease",
                  "&:hover": {
                    bgcolor: "rgba(93, 127, 79, 0.05)",
                    transform: "translateX(2px)",
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isActive ? 700 : item.level === 2 ? 600 : 500,
                    color: isActive ? "primary.dark" : "text.primary",
                    lineHeight: 1.45,
                    textTransform: "none",
                  }}
                >
                  {item.text}
                </Typography>
              </ButtonBase>
            );
          })}
        </List>
      ) : null}
    </Paper>
  );
}
