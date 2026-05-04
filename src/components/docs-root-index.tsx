import Link from "next/link";
import { Box, Button, Stack, Typography } from "@mui/material";

import { ContentPaper, PageFooter, SiteHeader } from "@/src/components/docs/chrome-shared";
import { getDocsHomeDescription, getDocsHomeTitle } from "@/src/lib/docs/config";
import { resolveSidebar } from "@/src/lib/docs/resolve-sidebar";
import { buildDocPath } from "@/src/lib/docs/routing";
import type { LocaleCode, VersionSlug } from "@/src/lib/docs/types";

interface DocsRootIndexProps {
  locale: LocaleCode;
  version: VersionSlug;
}

export function DocsRootIndex({ locale, version }: DocsRootIndexProps) {
  const docsTitle = getDocsHomeTitle(locale);
  const docsDescription = getDocsHomeDescription(locale);
  const docsHref = buildDocPath(locale, version);
  const headerItems = resolveSidebar(locale, version, []).headerItems;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <SiteHeader headerItems={headerItems} />
      <Box component="main" sx={{ flex: 1, width: "100%", px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
        <ContentPaper>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="overline" color="primary.main" sx={{ letterSpacing: "0.16em", fontWeight: 700 }}>
                Docs Index
              </Typography>
              <Typography variant="h3" component="h1" sx={{ mt: 1 }}>
                {docsTitle}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: 900 }}>
                {docsDescription}
              </Typography>
            </Box>
            <Stack spacing={1.5}>
              <Typography variant="body1" color="text.secondary">
                当前页面以站点根路由呈现对应语言的文档根 Index 语义，但不会主动跳转到文档完整路径。
              </Typography>
              <Typography variant="body1" color="text.secondary">
                搜索引擎与规范化链接仍然会指向完整文档路径，方便避免根路径与文档子树之间形成重复收录。
              </Typography>
              <Typography variant="body1" color="text.secondary">
                如果你想进入正式文档空间，可以继续访问下面的入口。
              </Typography>
            </Stack>
            <Box>
              <Button component={Link} href={docsHref} variant="contained" color="primary" size="large">
                打开完整文档路径
              </Button>
            </Box>
          </Stack>
        </ContentPaper>
      </Box>
      <PageFooter />
    </Box>
  );
}
