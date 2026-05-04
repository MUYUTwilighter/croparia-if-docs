"use client";

import { Alert, Box, Container, Stack, Typography } from "@mui/material";

import {
  useDiscoveryState,
  useDocContext,
  useDocNavigation,
  useFallbackNotice,
  useLocaleSwitcher,
  useVersionSwitcher,
} from "@/src/components/docs/doc-context";
import { ContentPaper, PageFooter, SiteHeader, docContentSx } from "@/src/components/docs/chrome-shared";

export function SpecialDocChrome({ children }: { children: React.ReactNode }) {
  const { doc } = useDocContext();
  const { headerItems } = useDocNavigation();
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
      <SiteHeader headerItems={headerItems} localeItems={localeItems} versionItems={versionItems} />
      <Box component="main" sx={{ flex: 1, width: "100%" }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
          <Stack spacing={3}>
            <ContentPaper>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="overline" color="primary.main" sx={{ letterSpacing: "0.16em", fontWeight: 700 }}>
                    Root Document
                  </Typography>
                  <Typography variant="h3" component="h1" sx={{ mt: 1 }}>
                    {doc.frontmatter.title ?? "未知标题"}
                  </Typography>
                  {doc.frontmatter.desc ? (
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: 960 }}>
                      {doc.frontmatter.desc}
                    </Typography>
                  ) : null}
                </Box>
                {isHidden ? (
                  <Alert severity="warning">
                    该页面通过 frontmatter 控制可发现性：
                    {!isNavVisible ? " `nonav: true` 已将它从导航中排除；" : ""}
                    {!isSitemapIncluded ? " `sitemap: false` 已将它从 sitemap 和默认索引策略中排除。" : ""}
                  </Alert>
                ) : null}
                {!isHidden && isFallback && message ? (
                  <Alert severity="info">
                    {message} 此类 fallback 页面默认使用真实来源页的 canonical，并以 `noindex,follow` 暴露给搜索引擎。
                  </Alert>
                ) : null}
              </Stack>
            </ContentPaper>
            <ContentPaper sx={{ width: "100%" }}>
              <Box className="doc-content" sx={docContentSx}>
                {children}
              </Box>
            </ContentPaper>
          </Stack>
        </Container>
      </Box>
      <PageFooter />
    </Box>
  );
}
