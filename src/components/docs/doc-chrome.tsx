"use client";

import Link from "next/link";
import {
  Alert,
  Box,
  List,
  ListItemButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  useDiscoveryState,
  useDocContext,
  useDocNavigation,
  useFallbackNotice,
  useLocaleSwitcher,
  useVersionSwitcher,
} from "@/src/components/docs/doc-context";
import type { SidebarItem } from "@/src/lib/docs/types";
import { ContentPaper, PageFooter, PageMetaBar, SiteHeader, docContentSx } from "@/src/components/docs/chrome-shared";

function SidebarTree({ items }: { items: SidebarItem[] }) {
  return (
    <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {items.map((item) => (
        <Box key={item.href}>
          <ListItemButton
            component={Link}
            href={item.href}
            sx={{ borderRadius: 2, alignItems: "flex-start", px: 1.5, py: 1 }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
              {item.text}
            </Typography>
          </ListItemButton>
          {item.items && item.items.length > 0 ? (
            <Box sx={{ borderLeft: 1, borderColor: "divider", ml: 2, pl: 1.5, mt: 1 }}>
              <SidebarTree items={item.items} />
            </Box>
          ) : null}
        </Box>
      ))}
    </List>
  );
}

export function DocChrome({ children }: { children: React.ReactNode }) {
  const { doc, requestedPath, resolvedPath, canonicalPath } = useDocContext();
  const { headerItems, sidebarItems, currentSectionKey, currentSectionTitle } = useDocNavigation();
  const { isFallback, message } = useFallbackNotice();
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

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <SiteHeader headerItems={headerItems} />
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
                <PageMetaBar localeItems={localeItems} versionItems={versionItems} />
                {isHidden ? (
                  <Alert severity="warning">
                    该页面通过 frontmatter 控制可发现性：
                    {!isNavVisible ? " `nonav: true` 已将它从侧栏导航中排除；" : ""}
                    {!isSitemapIncluded ? " `sitemap: false` 已将它从 sitemap 和默认索引策略中排除。" : ""}
                  </Alert>
                ) : null}
                {!isHidden && isFallback && message ? (
                  <Alert severity="info">
                    {message} 此类 fallback 页面默认使用真实来源页的 canonical，并以 `noindex,follow` 暴露给搜索引擎。
                  </Alert>
                ) : null}
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
                  px: 2.5,
                  py: 3,
                  position: { lg: "sticky" },
                  top: { lg: 96 },
                }}
              >
                <Typography variant="h6">栏目导航</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {currentSectionTitle ?? "当前页面不参与侧栏导航"}
                </Typography>
                <Box sx={{ mt: 2.5 }}>
                  <SidebarTree items={sidebarItems} />
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
