"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  Alert,
  Box,
  ButtonBase,
  Collapse,
  Divider,
  List,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  useDiscoveryState,
  useDocContext,
  useDocNavigation,
  useLocaleSwitcher,
  useVersionSwitcher,
} from "@/src/components/docs/doc-context";
import { FallbackNotice } from "@/src/components/docs/fallback-notice";
import type { SidebarItem } from "@/src/lib/docs/types";
import { ContentPaper, PageFooter, SiteHeader, docContentSx } from "@/src/components/docs/chrome-shared";

function normalizePathname(pathname: string) {
  return pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function isCurrentOrAncestor(pathname: string, href: string) {
  const current = normalizePathname(pathname);
  const target = normalizePathname(href);

  return current === target || current.startsWith(`${target}/`);
}

function SidebarTree({
  items,
  pathname,
  depth = 0,
}: {
  items: SidebarItem[];
  pathname: string;
  depth?: number;
}) {
  return (
    <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
      {items.map((item) => {
        const hasChildren = Boolean(item.items && item.items.length > 0);
        const isActiveBranch = isCurrentOrAncestor(pathname, item.href);
        const isActivePage = normalizePathname(pathname) === normalizePathname(item.href);

        return (
          <Box key={item.href}>
            <ButtonBase
              component={Link}
              href={item.href}
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "left",
                borderRadius: 2,
                px: 1.5,
                py: 1,
                pl: 1.5 + depth * 1.5,
                border: "1px solid",
                borderColor: isActivePage ? "primary.main" : "transparent",
                bgcolor: isActivePage ? "rgba(93, 127, 79, 0.14)" : isActiveBranch ? "rgba(93, 127, 79, 0.06)" : "transparent",
                transition: "background-color 0.18s ease, border-color 0.18s ease, transform 0.18s ease",
                "&:hover": {
                  bgcolor: isActivePage ? "rgba(93, 127, 79, 0.18)" : "action.hover",
                  transform: "translateX(2px)",
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: isActivePage ? 700 : isActiveBranch ? 600 : 500,
                  color: isActivePage ? "primary.dark" : "text.primary",
                  lineHeight: 1.45,
                }}
              >
                {item.text}
              </Typography>
              {hasChildren ? (
                <Typography
                  component="span"
                  variant="caption"
                  sx={{ color: isActiveBranch ? "primary.main" : "text.disabled", ml: 1, flexShrink: 0 }}
                >
                  {isActiveBranch ? "−" : "+"}
                </Typography>
              ) : null}
            </ButtonBase>
            {hasChildren ? (
              <Collapse in={isActiveBranch} timeout="auto" unmountOnExit={false}>
                <Box
                  sx={{
                    borderLeft: 1,
                    borderColor: isActiveBranch ? "primary.light" : "divider",
                    ml: 2,
                    mt: 0.75,
                    pl: 1,
                  }}
                >
                  <SidebarTree items={item.items ?? []} pathname={pathname} depth={depth + 1} />
                </Box>
              </Collapse>
            ) : null}
          </Box>
        );
      })}
    </List>
  );
}

export function DocChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { doc, requestedPath, resolvedPath, canonicalPath } = useDocContext();
  const { headerItems, sidebarItems, currentSectionTitle } = useDocNavigation();
  const { isNavVisible, isSitemapIncluded, isHidden } = useDiscoveryState();
  const localeSwitcher = useLocaleSwitcher();
  const versionSwitcher = useVersionSwitcher();
  const localeItems = localeSwitcher.locales.map((locale) => ({
    key: locale.code,
    href: locale.href,
    label: locale.label,
    isCurrent: locale.isCurrent,
  }));
  const versionItems = versionSwitcher.versions.map((version) => ({
    key: version.slug,
    href: version.href,
    label: version.label,
    isCurrent: version.isCurrent,
  }));
  const normalizedPathname = useMemo(() => normalizePathname(pathname ?? requestedPath), [pathname, requestedPath]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <SiteHeader headerItems={headerItems} localeItems={localeItems} versionItems={versionItems} />
      <Box component="main" sx={{ flex: 1, width: "100%" }}>
        <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
          <Stack spacing={3}>
            <ContentPaper>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="overline" color="primary.main" sx={{ letterSpacing: "0.16em", fontWeight: 700 }}>
                    Document
                  </Typography>
                  <Typography variant="h3" component="h1" sx={{ mt: 1 }}>
                    {doc.frontmatter.title ?? "未设置标题的文档页面"}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: 960 }}>
                    {doc.frontmatter.desc ?? "这里渲染的是 resolver 最终命中的 MDX 内容源，并沿用统一的导航、fallback 与 canonical 规则。"}
                  </Typography>
                </Box>
                {isHidden ? (
                  <Alert severity="warning">
                    该页面通过 frontmatter 控制可发现性：
                    {!isNavVisible ? " `nonav: true` 已将它从侧栏导航中排除；" : ""}
                    {!isSitemapIncluded ? " `sitemap: false` 已将它从 sitemap 和默认索引策略中排除。" : ""}
                  </Alert>
                ) : null}
                {!isHidden ? <FallbackNotice /> : null}
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
                  <Typography variant="body2" color="text.secondary">
                    请求路径：{requestedPath}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    实际来源：{resolvedPath}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Canonical：{canonicalPath}
                  </Typography>
                </Stack>
              </Stack>
            </ContentPaper>

            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: { xs: "1fr", lg: "280px minmax(0, 1fr)" },
                alignItems: "start",
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  px: 0,
                  py: 0,
                  position: { lg: "sticky" },
                  top: { lg: 96 },
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    px: 2.5,
                    py: 2.25,
                    borderBottom: 1,
                    borderColor: "divider",
                    bgcolor: "rgba(93, 127, 79, 0.06)",
                  }}
                >
                  <Typography variant="overline" color="primary.main" sx={{ letterSpacing: "0.14em", fontWeight: 700 }}>
                    Navigation
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.75 }}>
                    栏目导航
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, lineHeight: 1.7 }}>
                    {currentSectionTitle ?? "当前页面不参与侧栏导航"}
                  </Typography>
                </Box>
                <Box sx={{ px: 1.5, py: 1.5, maxHeight: { lg: "calc(100vh - 148px)" }, overflowY: "auto" }}>
                  {sidebarItems.length > 0 ? (
                    <SidebarTree items={sidebarItems} pathname={normalizedPathname} />
                  ) : (
                    <Stack spacing={1.25} sx={{ px: 1, py: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        当前文档没有可展示的侧栏结构。
                      </Typography>
                      <Divider />
                      <Typography variant="caption" color="text.disabled">
                        这通常意味着该页面被标记为独立页，或当前栏目尚未组织导航树。
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </Paper>

              <ContentPaper sx={{ minWidth: 0 }}>
                <Box className="doc-content" sx={docContentSx}>
                  {children}
                </Box>
              </ContentPaper>
            </Box>
          </Stack>
        </Box>
      </Box>
      <PageFooter />
    </Box>
  );
}
