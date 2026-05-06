"use client";

import { Alert, Box, Container, Stack, Typography } from "@mui/material";

import {
  useDiscoveryState,
  useDocContext,
  useDocNavigation,
  useLocaleSwitcher,
  useVersionSwitcher,
} from "@/src/components/docs/doc-context";
import { ContentPaper, PageFooter, SiteHeader } from "@/src/components/docs/chrome-shared";
import { FallbackNotice } from "@/src/components/docs/fallback-notice";

export function SpecialDocChrome({ children }: { children: React.ReactNode }) {
  const { doc } = useDocContext();
  const { headerItems } = useDocNavigation();
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
  const showDebugPanel = process.env.NODE_ENV !== "production";
  const showDiscoveryNotice = process.env.NODE_ENV !== "production";

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <SiteHeader headerItems={headerItems} localeItems={localeItems} versionItems={versionItems} />
      <Box component="main" sx={{ flex: 1, width: "100%" }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
          <Stack spacing={3}>
            {showDebugPanel ? (
              <ContentPaper>
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="overline" color="primary.main" sx={{ letterSpacing: "0.16em", fontWeight: 700 }}>
                      Root Document Debug
                    </Typography>
                    <Typography variant="h5" component="h2" sx={{ mt: 1 }}>
                      {doc.frontmatter.title ?? "未知标题"}
                    </Typography>
                    {doc.frontmatter.desc ? (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, maxWidth: 960 }}>
                        {doc.frontmatter.desc}
                      </Typography>
                    ) : null}
                  </Box>
                </Stack>
              </ContentPaper>
            ) : null}
            <Stack spacing={2.5} sx={{ width: "100%" }}>
              {isHidden && showDiscoveryNotice ? (
                <Alert severity="warning">
                  该页面通过 frontmatter 控制可发现性：
                  {!isNavVisible ? " `nonav: true` 已将它从导航中排除；" : ""}
                  {!isSitemapIncluded ? " `sitemap: false` 已将它从 sitemap 和默认索引策略中排除。" : ""}
                </Alert>
              ) : null}
              {!isHidden ? <FallbackNotice /> : null}
              <Box>
                {children}
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>
      <PageFooter />
    </Box>
  );
}
