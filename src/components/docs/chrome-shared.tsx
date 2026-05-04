import Link from "next/link";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Toolbar,
  Typography,
  type SxProps,
  type Theme,
} from "@mui/material";

import { siteConfig } from "@/src/lib/docs/config";
import type { ResolvedSidebar } from "@/src/lib/docs/types";

type HeaderItem = ResolvedSidebar["headerItems"][number];

interface SiteHeaderProps {
  headerItems: HeaderItem[];
  localeItems?: SwitcherItem[];
}

interface SwitcherItem {
  key: string;
  href: string;
  label: string;
  isCurrent: boolean;
}

interface PageMetaBarProps {
  versionItems: SwitcherItem[];
}

export const docContentSx: SxProps<Theme> = {
  "& > :first-of-type": {
    mt: 0,
  },
  "& h1, & h2, & h3, & h4": {
    mt: 4,
    mb: 2,
    color: "text.primary",
    scrollMarginTop: 96,
  },
  "& p, & li": {
    fontSize: "0.98rem",
    lineHeight: 1.85,
    color: "text.secondary",
  },
  "& a": {
    color: "primary.main",
    textDecorationColor: "rgba(93, 127, 79, 0.4)",
  },
  "& code": {
    px: 0.75,
    py: 0.25,
    borderRadius: 1,
    bgcolor: "rgba(93, 127, 79, 0.08)",
    color: "text.primary",
    fontSize: "0.92em",
  },
  "& pre": {
    overflowX: "auto",
    borderRadius: 3,
    p: 2,
    bgcolor: "#1f1d19",
    color: "#f6f1e8",
  },
  "& pre code": {
    p: 0,
    bgcolor: "transparent",
    color: "inherit",
  },
  "& table": {
    width: "100%",
    borderCollapse: "collapse",
    my: 3,
  },
  "& th, & td": {
    border: "1px solid",
    borderColor: "divider",
    px: 1.5,
    py: 1,
    textAlign: "left",
  },
  "& img": {
    maxWidth: "100%",
    height: "auto",
  },
};

export function SiteHeader({ headerItems, localeItems = [] }: SiteHeaderProps) {
  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Container maxWidth={false}>
        <Toolbar disableGutters sx={{ minHeight: 72, gap: 3, px: { xs: 2, md: 4 } }}>
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <Typography variant="h6" sx={{ color: "text.primary" }}>
              {siteConfig.siteName}
            </Typography>
          </Link>
          <Stack direction="row" spacing={1} useFlexGap sx={{ ml: "auto", flexWrap: "wrap" }}>
            {headerItems.map((item) => (
              <Link key={item.key} href={item.href} style={{ textDecoration: "none" }}>
                <Button
                  variant={item.isCurrent ? "contained" : "text"}
                  color={item.isCurrent ? "primary" : "inherit"}
                  sx={{
                    borderRadius: 999,
                    px: 2,
                    color: item.isCurrent ? "primary.contrastText" : "text.secondary",
                  }}
                >
                  {item.text}
                </Button>
              </Link>
            ))}
          </Stack>
          {localeItems.length > 0 ? (
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center", ml: { xs: 0, md: 1 } }}>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                语言
              </Typography>
              {localeItems.map((item) => (
                <Link key={item.key} href={item.href} style={{ textDecoration: "none" }}>
                  <Chip
                    clickable
                    color={item.isCurrent ? "primary" : "default"}
                    label={item.label}
                    variant={item.isCurrent ? "filled" : "outlined"}
                    size="small"
                  />
                </Link>
              ))}
            </Stack>
          ) : null}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export function PageMetaBar({ versionItems }: PageMetaBarProps) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
        <Typography variant="body2" color="text.secondary">
          版本
        </Typography>
        {versionItems.map((item) => (
          <Link key={item.key} href={item.href} style={{ textDecoration: "none" }}>
            <Chip
              clickable
              color={item.isCurrent ? "secondary" : "default"}
              label={item.label}
              variant={item.isCurrent ? "filled" : "outlined"}
            />
          </Link>
        ))}
      </Stack>
    </Stack>
  );
}

export function PageFooter() {
  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", bgcolor: "background.paper", mt: "auto" }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" } }}
        >
          <Typography variant="body2" color="text.secondary">
            {siteConfig.siteName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Parser-driven Next.js docs frontend for Croparia IF.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export function ContentPaper({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        px: { xs: 2.5, md: 4 },
        py: { xs: 3, md: 4 },
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}

export function SectionDivider() {
  return <Divider sx={{ my: 3 }} />;
}
