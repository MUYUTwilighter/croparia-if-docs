"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import { DocOutline } from "@/src/components/docs/doc-outline";
import { FallbackNotice } from "@/src/components/docs/fallback-notice";
import type { SidebarItem } from "@/src/lib/docs/types";
import { ContentPaper, PageFooter, ResponsiveDebugPanel, SiteHeader, docContentSx } from "@/src/components/docs/chrome-shared";

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
        const isExpanded = hasChildren && (depth === 0 || isActiveBranch);
        const isTopLevel = depth === 0;

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
                borderRadius: 0,
                px: isTopLevel ? 0.75 : 1,
                py: isTopLevel ? 0.55 : 0.7,
                pl: (isTopLevel ? 0.75 : 1) + depth * 1.35,
                borderLeft: "2px solid",
                borderLeftColor: isActivePage ? "primary.main" : isActiveBranch ? "rgba(93, 127, 79, 0.55)" : "transparent",
                bgcolor: isActivePage ? "rgba(93, 127, 79, 0.05)" : "transparent",
                borderBottom: isTopLevel ? 1 : 0,
                borderBottomColor: isTopLevel ? "rgba(0, 0, 0, 0.06)" : "transparent",
                transition: "background-color 0.18s ease, border-left-color 0.18s ease, color 0.18s ease",
                "&:hover": {
                  bgcolor: isTopLevel ? "rgba(0, 0, 0, 0.025)" : "rgba(93, 127, 79, 0.05)",
                },
              }}
            >
              <Typography
                variant={isTopLevel ? "caption" : "body2"}
                sx={{
                  fontWeight: isTopLevel ? (isActiveBranch ? 700 : 600) : isActivePage ? 700 : isActiveBranch ? 600 : 500,
                  color: isActivePage ? "primary.dark" : isTopLevel ? "text.secondary" : "text.primary",
                  lineHeight: 1.45,
                  textTransform: "none",
                  letterSpacing: isTopLevel ? "0.04em" : "normal",
                }}
              >
                {item.text}
              </Typography>
              {hasChildren ? (
                <Typography
                  component="span"
                  variant="caption"
                  sx={{
                    color: isExpanded ? (isTopLevel ? "text.secondary" : "primary.main") : "text.disabled",
                    ml: 1,
                    flexShrink: 0,
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  {isExpanded ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ChevronRightIcon sx={{ fontSize: 16 }} />}
                </Typography>
              ) : null}
            </ButtonBase>
            {hasChildren ? (
              <Collapse in={isExpanded} timeout="auto" unmountOnExit={false}>
              <Box
                  sx={{
                    borderLeft: 1,
                    borderColor: isExpanded ? "rgba(93, 127, 79, 0.28)" : "divider",
                    ml: 1.25,
                    mt: 0.5,
                    pl: 0.6,
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
  const showDebugPanel = process.env.NODE_ENV !== "production";
  const showDiscoveryNotice = process.env.NODE_ENV !== "production";
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <SiteHeader headerItems={headerItems} localeItems={localeItems} versionItems={versionItems} />
      <Box component="main" sx={{ flex: 1, width: "100%" }}>
        <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
          <Stack spacing={3}>
            {showDebugPanel ? (
              <ResponsiveDebugPanel
                title={doc.frontmatter.title ?? "未设置标题的文档页面"}
                description={doc.frontmatter.desc ?? "当前正在查看 resolver 最终命中的文档结果。"}
              >
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="overline" color="primary.main" sx={{ letterSpacing: "0.16em", fontWeight: 700 }}>
                      Document Debug
                    </Typography>
                    <Typography variant="h5" component="h2" sx={{ mt: 1 }}>
                      {doc.frontmatter.title ?? "未设置标题的文档页面"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, maxWidth: 960 }}>
                      {doc.frontmatter.desc ?? "当前正在查看 resolver 最终命中的文档结果。"}
                    </Typography>
                  </Box>
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
              </ResponsiveDebugPanel>
            ) : null}

            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: { xs: "1fr", lg: "280px minmax(0, 1fr)", xl: "280px minmax(0, 1fr) 260px" },
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
                <ButtonBase
                  onClick={() => setMobileSidebarOpen((value) => !value)}
                  sx={{
                    width: "100%",
                    display: { xs: "flex", lg: "none" },
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    px: 2.5,
                    py: 1.75,
                    textAlign: "left",
                    borderBottom: 1,
                    borderColor: "divider",
                    bgcolor: "rgba(93, 127, 79, 0.025)",
                  }}
                >
                  <Box>
                    <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: "0.16em", fontWeight: 700, fontSize: "0.68rem" }}>
                      Section
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 0.35, fontWeight: 600, lineHeight: 1.35 }}>
                      {currentSectionTitle ?? "当前栏目"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.6, display: "block", lineHeight: 1.6 }}>
                      {sidebarItems.length > 0 ? `共 ${sidebarItems.length} 个一级导航项` : "当前页面不参与侧栏导航"}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, display: "inline-flex", alignItems: "center" }}>
                    {mobileSidebarOpen ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}
                  </Typography>
                </ButtonBase>
                <Box
                  sx={{
                    display: { xs: "none", lg: "block" },
                    px: 2.5,
                    py: 1.75,
                    borderBottom: 1,
                    borderColor: "divider",
                    bgcolor: "rgba(93, 127, 79, 0.025)",
                  }}
                >
                  <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: "0.16em", fontWeight: 700, fontSize: "0.68rem" }}>
                    Section
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 0.35, fontWeight: 600, lineHeight: 1.35 }}>
                    {currentSectionTitle ?? "当前栏目"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.6, display: "block", lineHeight: 1.6 }}>
                    {sidebarItems.length > 0 ? `共 ${sidebarItems.length} 个一级导航项` : "当前页面不参与侧栏导航"}
                  </Typography>
                </Box>
                <Collapse in={mobileSidebarOpen || false} timeout="auto" unmountOnExit={false} sx={{ display: { xs: "block", lg: "none" } }}>
                  <Box sx={{ px: 1.5, py: 1.5, overflowY: "auto" }}>
                    {sidebarItems.length > 0 ? (
                      <Box onClick={() => setMobileSidebarOpen(false)}>
                        <SidebarTree items={sidebarItems} pathname={normalizedPathname} />
                      </Box>
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
                </Collapse>
                <Box sx={{ display: { xs: "none", lg: "block" }, px: 1.5, py: 1.5, maxHeight: { lg: "calc(100vh - 148px)" }, overflowY: "auto" }}>
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
                <Stack spacing={2.5}>
                  {isHidden && showDiscoveryNotice ? (
                    <Alert severity="warning">
                      该页面通过 frontmatter 控制可发现性：
                      {!isNavVisible ? " `nonav: true` 已将它从侧栏导航中排除；" : ""}
                      {!isSitemapIncluded ? " `sitemap: false` 已将它从 sitemap 和默认索引策略中排除。" : ""}
                    </Alert>
                  ) : null}
                  {!isHidden ? <FallbackNotice /> : null}
                  <Box className="doc-content" sx={docContentSx}>
                    {children}
                  </Box>
                </Stack>
              </ContentPaper>

              <DocOutline />
            </Box>
          </Stack>
        </Box>
      </Box>
      <PageFooter />
    </Box>
  );
}
