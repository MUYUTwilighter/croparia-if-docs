"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Chip,
  ClickAwayListener,
  Container,
  Divider,
  InputBase,
  List,
  ListItemButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Toolbar,
  Typography,
  CircularProgress,
  type SxProps,
  type Theme,
} from "@mui/material";
import { usePathname } from "next/navigation";

import { useDocSearch } from "@/src/components/docs/use-doc-search";
import { siteConfig } from "@/src/lib/docs/config";
import type { ResolvedSidebar } from "@/src/lib/docs/types";

type HeaderItem = ResolvedSidebar["headerItems"][number];

interface SiteHeaderProps {
  headerItems: HeaderItem[];
  localeItems?: SwitcherItem[];
  versionItems?: SwitcherItem[];
}

interface SwitcherItem {
  key: string;
  href: string;
  label: string;
  isCurrent: boolean;
}

function SearchResultMeta({ label }: { label: string }) {
  return (
    <Chip
      label={label}
      size="small"
      variant="outlined"
      sx={{
        height: 22,
        borderRadius: 999,
        fontSize: "0.7rem",
        "& .MuiChip-label": { px: 1 },
      }}
    />
  );
}

function DocSearchBox() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { query, setQuery, results, total, isLoading, error } = useDocSearch({
    limit: 8,
    enabled: true,
    debounceMs: 120,
  });

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const normalizedQuery = query.trim();
  const hasQuery = normalizedQuery.length > 0;
  const showPanel = isOpen && (hasQuery || isLoading || Boolean(error));

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <Box sx={{ position: "relative", width: { xs: "100%", sm: 280, md: 340 }, minWidth: 0 }}>
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 0.75,
            border: "1px solid",
            borderColor: showPanel ? "primary.main" : "divider",
            borderRadius: 999,
            bgcolor: "background.paper",
            transition: "border-color 0.18s ease, box-shadow 0.18s ease",
            boxShadow: showPanel ? "0 10px 26px rgba(17, 14, 9, 0.12)" : "none",
          }}
        >
          <Typography component="span" variant="body2" sx={{ color: "text.disabled", userSelect: "none" }}>
            搜索
          </Typography>
          <InputBase
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setIsOpen(false);
              }
            }}
            placeholder="搜索文档内容..."
            inputProps={{ "aria-label": "Search docs" }}
            sx={{
              flex: 1,
              minWidth: 0,
              fontSize: "0.95rem",
              "& input::placeholder": {
                opacity: 1,
                color: "text.disabled",
              },
            }}
          />
          {isLoading ? <CircularProgress size={16} sx={{ color: "primary.main" }} /> : null}
        </Paper>

        {showPanel ? (
          <Paper
            elevation={0}
            sx={{
              position: "absolute",
              top: "calc(100% + 10px)",
              left: 0,
              right: 0,
              zIndex: 30,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 18px 40px rgba(17, 14, 9, 0.16)",
            }}
          >
            <Box sx={{ px: 1.75, py: 1.25, borderBottom: "1px solid", borderColor: "divider", bgcolor: "rgba(93, 127, 79, 0.05)" }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                {hasQuery ? `“${normalizedQuery}” 的搜索结果` : "开始搜索文档"}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.5 }}>
                {isLoading
                  ? "正在检索当前语言与版本文档..."
                  : error
                    ? error
                    : hasQuery
                      ? `找到 ${total} 条结果`
                      : "支持标题、段落和章节标题检索。"}
              </Typography>
            </Box>

            {hasQuery && !isLoading && !error ? (
              results.length > 0 ? (
                <List disablePadding sx={{ maxHeight: 420, overflowY: "auto" }}>
                  {results.map((result, index) => (
                    <Box key={result.href}>
                      {index > 0 ? <Divider /> : null}
                      <ListItemButton
                        component={Link}
                        href={result.href}
                        onClick={() => setIsOpen(false)}
                        sx={{ alignItems: "flex-start", px: 1.75, py: 1.4 }}
                      >
                        <Stack spacing={0.85} sx={{ minWidth: 0 }}>
                          <Stack direction="row" spacing={0.75} useFlexGap sx={{ alignItems: "center", flexWrap: "wrap" }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                              {result.title}
                            </Typography>
                            <SearchResultMeta label={result.locale.toUpperCase()} />
                            <SearchResultMeta label={result.version} />
                            {result.section ? <SearchResultMeta label={result.section} /> : null}
                          </Stack>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "primary.main",
                              fontWeight: 500,
                              wordBreak: "break-all",
                            }}
                          >
                            {result.href}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              lineHeight: 1.65,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {result.description}
                          </Typography>
                        </Stack>
                      </ListItemButton>
                    </Box>
                  ))}
                </List>
              ) : (
                <Box sx={{ px: 1.75, py: 2.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                    没有找到匹配内容
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.5, lineHeight: 1.7 }}>
                    可以试试更短的关键词，或者换一个文档术语。
                  </Typography>
                </Box>
              )
            ) : null}
          </Paper>
        ) : null}
      </Box>
    </ClickAwayListener>
  );
}

export const docContentSx: SxProps<Theme> = {
  "& > :first-of-type": {
    mt: 0,
  },
  "& > :last-child": {
    mb: 0,
  },
  "& h1, & h2, & h3, & h4, & h5, & h6": {
    color: "text.primary",
    scrollMarginTop: 96,
    lineHeight: 1.25,
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  "& h1": {
    mt: 0,
    mb: 2.5,
    fontSize: { xs: "2rem", md: "2.5rem" },
  },
  "& h2": {
    mt: 6,
    mb: 2,
    pt: 1.5,
    borderTop: "1px solid",
    borderColor: "divider",
    fontSize: { xs: "1.55rem", md: "1.85rem" },
  },
  "& h3": {
    mt: 4.5,
    mb: 1.5,
    fontSize: { xs: "1.25rem", md: "1.45rem" },
  },
  "& h4": {
    mt: 3.5,
    mb: 1.25,
    fontSize: { xs: "1.08rem", md: "1.18rem" },
  },
  "& h5": {
    mt: 3,
    mb: 1,
    fontSize: "1rem",
  },
  "& h6": {
    mt: 2.5,
    mb: 1,
    fontSize: "0.94rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  "& p": {
    my: 1.75,
    fontSize: { xs: "1rem", md: "1.04rem" },
    lineHeight: 1.9,
    color: "text.secondary",
  },
  "& strong": {
    color: "text.primary",
    fontWeight: 700,
  },
  "& em": {
    color: "text.primary",
  },
  "& a": {
    color: "primary.main",
    fontWeight: 500,
    textDecoration: "underline",
    textUnderlineOffset: "0.18em",
    textDecorationColor: "rgba(93, 127, 79, 0.38)",
    transition: "color 0.18s ease, text-decoration-color 0.18s ease",
    "&:hover": {
      color: "primary.dark",
      textDecorationColor: "currentColor",
    },
  },
  "& ul, & ol": {
    my: 2,
    pl: 3,
    color: "text.secondary",
  },
  "& ul": {
    listStyleType: "disc",
  },
  "& ol": {
    listStyleType: "decimal",
  },
  "& li": {
    my: 0.85,
    paddingLeft: 0.35,
    fontSize: { xs: "0.99rem", md: "1rem" },
    lineHeight: 1.85,
    color: "text.secondary",
  },
  "& li > p": {
    my: 0.75,
  },
  "& ul ul, & ul ol, & ol ul, & ol ol": {
    my: 1,
  },
  "& hr": {
    my: 4.5,
    border: 0,
    borderTop: "1px solid",
    borderColor: "divider",
  },
  "& blockquote": {
    my: 3,
    mx: 0,
    px: 2.5,
    py: 2,
    borderLeft: "4px solid",
    borderColor: "primary.main",
    borderRadius: "0 16px 16px 0",
    bgcolor: "rgba(93, 127, 79, 0.08)",
  },
  "& blockquote p": {
    my: 0,
    color: "text.primary",
  },
  "& :not(pre) > code": {
    px: 0.75,
    py: 0.3,
    borderRadius: 1.5,
    border: "1px solid",
    borderColor: "rgba(93, 127, 79, 0.16)",
    bgcolor: "rgba(93, 127, 79, 0.08)",
    color: "text.primary",
    fontSize: "0.92em",
    fontWeight: 500,
  },
  "& pre": {
    my: 3,
    overflowX: "auto",
    borderRadius: 3.5,
    border: "1px solid",
    borderColor: "rgba(255,255,255,0.08)",
    p: 2.25,
    bgcolor: "#181613",
    color: "#f7f3ea",
    boxShadow: "0 18px 34px rgba(17, 14, 9, 0.18)",
  },
  "& pre code": {
    p: 0,
    border: 0,
    bgcolor: "transparent",
    color: "inherit",
    fontSize: "0.92rem",
    fontWeight: 400,
    lineHeight: 1.7,
  },
  "& table:not(.game-item-card__table)": {
    width: "100%",
    minWidth: 640,
    borderCollapse: "separate",
    borderSpacing: 0,
    overflow: "hidden",
    borderRadius: 2.5,
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
  },
  "& table:not(.game-item-card__table) thead th": {
    bgcolor: "rgba(93, 127, 79, 0.08)",
    color: "text.primary",
    fontWeight: 700,
  },
  "& table:not(.game-item-card__table) th, & table:not(.game-item-card__table) td": {
    border: "1px solid",
    borderColor: "divider",
    borderTop: 0,
    borderLeft: 0,
    px: 1.75,
    py: 1.25,
    textAlign: "left",
    verticalAlign: "top",
    fontSize: "0.95rem",
    lineHeight: 1.75,
    color: "text.secondary",
  },
  "& table:not(.game-item-card__table) tr > *:last-child": {
    borderRight: 0,
  },
  "& table:not(.game-item-card__table) tbody tr:last-child > *": {
    borderBottom: 0,
  },
  "& details": {
    my: 2.5,
    px: 2,
    py: 1.5,
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 2.5,
    bgcolor: "rgba(255,255,255,0.55)",
  },
  "& summary": {
    cursor: "pointer",
    color: "text.primary",
    fontWeight: 600,
  },
  "& img": {
    display: "block",
    marginBlock: "24px",
    maxWidth: "100%",
    height: "auto",
    borderRadius: 0,
    boxShadow: "0 16px 32px rgba(32, 25, 16, 0.14)",
  },
  "& .game-gui-frame img, & .game-item-display__icon, & .recipe-arrow, & .recipe-connector": {
    display: "block",
    margin: 0,
    maxWidth: "none",
    height: "auto",
    borderRadius: 0,
    boxShadow: "none",
  },
};

function HeaderSwitcher({
  label,
  items,
  color = "primary",
}: {
  label: string;
  items: SwitcherItem[];
  color?: "primary" | "secondary";
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const currentItem = useMemo(
    () => items.find((item) => item.isCurrent) ?? items[0] ?? null,
    [items],
  );

  if (!currentItem) {
    return null;
  }

  return (
    <>
      <Button
        variant="outlined"
        color={color}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{ borderRadius: 999, px: 1.5, whiteSpace: "nowrap" }}
      >
        {label}：{currentItem.label} ▾
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {items.map((item) => (
          <MenuItem
            key={item.key}
            component={Link}
            href={item.href}
            selected={item.isCurrent}
            onClick={() => setAnchorEl(null)}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export function SiteHeader({ headerItems, localeItems = [], versionItems = [] }: SiteHeaderProps) {
  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Container maxWidth={false}>
        <Toolbar disableGutters sx={{ minHeight: 72, gap: 3, px: { xs: 2, md: 4 } }}>
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <Typography variant="h6" sx={{ color: "text.primary" }}>
              {siteConfig.siteName}
            </Typography>
          </Link>
          <Box sx={{ flex: { xs: "1 1 100%", md: "0 1 auto" }, order: { xs: 3, md: 1 }, width: { xs: "100%", md: "auto" } }}>
            <DocSearchBox />
          </Box>
          <Stack
            direction="row"
            spacing={1.25}
            useFlexGap
            sx={{ ml: { md: "auto" }, flexWrap: "wrap", alignItems: "center", rowGap: 0.75, order: { xs: 1, md: 2 } }}
          >
            {headerItems.map((item, index) => (
              <Stack key={item.key} direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                {index > 0 ? (
                  <Typography variant="body2" sx={{ color: "text.disabled", userSelect: "none" }}>
                    |
                  </Typography>
                ) : null}
                <Link href={item.href} style={{ textDecoration: "none" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: item.isCurrent ? "primary.main" : "text.secondary",
                      fontWeight: item.isCurrent ? 700 : 500,
                      letterSpacing: "0.02em",
                      transition: "color 0.2s ease",
                      "&:hover": {
                        color: item.isCurrent ? "primary.dark" : "text.primary",
                      },
                    }}
                  >
                    {item.text}
                  </Typography>
                </Link>
              </Stack>
            ))}
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ flexWrap: "wrap", alignItems: "center", ml: { xs: 0, md: 1 }, order: { xs: 2, md: 3 } }}
          >
            {localeItems.length > 0 ? <HeaderSwitcher label="语言" items={localeItems} color="primary" /> : null}
            {versionItems.length > 0 ? <HeaderSwitcher label="版本" items={versionItems} color="secondary" /> : null}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
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
