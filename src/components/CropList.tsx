// @site/src/components/CropList.tsx
import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {useColorMode} from "@docusaurus/theme-common";

import {createTheme, ThemeProvider} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import CodeBlock from "@theme/CodeBlock";

import TintPic from "@site/src/components/TintPic";
import LayeredPic from "@site/src/components/LayeredPic";
import MultiSelectChip from "@site/src/components/MultiSelectChip";

//
// ---------- Types from the API ----------
//

export interface Pageable {
  page: number;
  size: number;
}

export interface SearchOptions extends Pageable {
  id?: string;
  types?: string[];
  tier?: number;
  material?: string;
  dependencies?: string[];
  versions?: string[];
}

export interface Crop {
  id: string;
  tier: number;
  material: string;
  color: string; // #AARRGGBB
  type: string;
  translations: {
    [key: string]: string;
  };
  dependencies: {
    [key: string]: string;
  };
}

interface CropSearchResponse {
  total: number;
  data: Crop[];
}

//
// ---------- Constants & helpers ----------
//

const TIER_MIN = 1;
const TIER_MAX = 7;
const PAGE_SIZE = 20;

function useApiBase() {
  const {siteConfig} = useDocusaurusContext();
  return (siteConfig.customFields as any).API_URL as string;
}

// Remove alpha channel from ARGB (#AARRGGBB) -> #RRGGBB
function formatColor(hex: string): string {
  const m = /^#?([a-fA-F0-9]{8})$/.exec(hex);
  if (!m) return hex; // fallback
  const n = parseInt(m[1], 16);
  const rgb = n & 0x00ffffff; // strip alpha
  return `#${rgb.toString(16).padStart(6, "0")}`;
}

function seedTextureUrl(tier: number): string {
  return `https://raw.githubusercontent.com/MUYUTwilighter/croparia-if/master/common/src/main/resources/assets/croparia/textures/item/croparia${tier}.png`;
}

// Asset URLs
const SEED_GRAY_URL =
  "https://raw.githubusercontent.com/MUYUTwilighter/croparia-if/master/common/src/main/resources/assets/croparia/textures/item/seed_crop.png";
const FRUIT_BASE = (t: Crop["type"]) =>
  `https://raw.githubusercontent.com/MUYUTwilighter/croparia-if/master/common/src/main/resources/assets/croparia/textures/item/fruit_${t}.png`;
const FRUIT_OVERLAY = (t: Crop["type"]) =>
  `https://raw.githubusercontent.com/MUYUTwilighter/croparia-if/master/common/src/main/resources/assets/croparia/textures/item/fruit_${t}_overlay.png`;
const CROP_BLOCK_BASE = (t: Crop["type"]) =>
  `https://raw.githubusercontent.com/MUYUTwilighter/croparia-if/master/common/src/main/resources/assets/croparia/textures/block/${t}_stage_7.png`;
const CROP_BLOCK_OVERLAY = (t: Crop["type"]) =>
  `https://raw.githubusercontent.com/MUYUTwilighter/croparia-if/master/common/src/main/resources/assets/croparia/textures/block/${t}_stage_7_overlay.png`;

// Simple debounce hook
function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

//
// ---------- Secret redirect hook (5 taps to console) ----------
//

function useSecretRedirect(targetPath: string = "/console") {
  const TAP_REQUIRED = 5;
  const WINDOW_MS = 1500;

  const tapCountRef = React.useRef(0);
  const startRef = React.useRef<number | null>(null);

  return React.useCallback(() => {
    const now = Date.now();
    if (!startRef.current || now - startRef.current > WINDOW_MS) {
      // Start a new window
      startRef.current = now;
      tapCountRef.current = 1;
      return;
    }

    tapCountRef.current += 1;
    if (tapCountRef.current >= TAP_REQUIRED) {
      tapCountRef.current = 0;
      startRef.current = null;
      if (typeof window !== "undefined") {
        window.location.href = targetPath;
      }
    }
  }, [targetPath]);
}

//
// ---------- Main component ----------
//

export default function CropList() {
  const apiBase = useApiBase();
  const {colorMode} = useColorMode();

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {mode: colorMode === "dark" ? "dark" : "light"},
      }),
    [colorMode]
  );

  // Meta (versions, dependencies)
  const [allVersions, setAllVersions] = React.useState<string[]>([]);
  const [allDeps, setAllDeps] = React.useState<string[]>([]);
  const [loadingMeta, setLoadingMeta] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Filters
  const [idInput, setIdInput] = React.useState("");
  const [material, setMaterial] = React.useState("");
  const [tier, setTier] = React.useState<number | null>(null);
  const [depsSelected, setDepsSelected] = React.useState<string[]>([]);
  const [versionsSelected, setVersionsSelected] = React.useState<string[]>([]);

  // Search / list
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [crops, setCrops] = React.useState<Crop[]>([]);
  const [loadingSearch, setLoadingSearch] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleSecretTap = useSecretRedirect("/console");

  //
  // Load versions & dependencies on mount
  //
  React.useEffect(() => {
    let abort = new AbortController();
    (async () => {
      try {
        setLoadingMeta(true);
        setError(null);

        const [verRes, depRes] = await Promise.all([
          fetch(`${apiBase}/crops/versions`, {signal: abort.signal}),
          fetch(`${apiBase}/crops/dependencies`, {signal: abort.signal}),
        ]);

        if (!verRes.ok) {
          throw new Error(`Failed to load versions: ${verRes.status}`);
        }
        if (!depRes.ok) {
          throw new Error(`Failed to load dependencies: ${depRes.status}`);
        }

        const verList: string[] = await verRes.json();
        const depList: string[] = await depRes.json();

        setAllVersions(verList || []);
        setAllDeps(depList || []);
      } catch (e: any) {
        if (e.name !== "AbortError") {
          setError(e.message || String(e));
        }
      } finally {
        setLoadingMeta(false);
      }
    })();

    return () => abort.abort();
  }, [apiBase]);

  //
  // Build debounced filter object
  //
  const filters = React.useMemo(
    () => ({
      id: idInput.trim(),
      material: material.trim(),
      tier,
      dependencies: depsSelected,
      versions: versionsSelected,
    }),
    [
      idInput.trim(),
      material.trim(),
      tier,
      depsSelected.join(","),
      versionsSelected.join(","),
    ]
  );

  const debouncedFilters = useDebouncedValue(filters, 250);

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [debouncedFilters]);

  //
  // Fetch crops when filters or page change
  //
  React.useEffect(() => {
    let abort = new AbortController();
    (async () => {
      try {
        setLoadingSearch(true);
        setError(null);
        setExpanded(false);

        const body: SearchOptions = {
          page: page - 1, // API pageable usually 0-based
          size: PAGE_SIZE,
        };

        if (debouncedFilters.id) body.id = debouncedFilters.id;
        if (debouncedFilters.material) body.material = debouncedFilters.material;
        if (
          debouncedFilters.tier &&
          debouncedFilters.tier >= TIER_MIN &&
          debouncedFilters.tier <= TIER_MAX
        ) {
          body.tier = debouncedFilters.tier;
        }
        if (debouncedFilters.dependencies.length) {
          body.dependencies = debouncedFilters.dependencies;
        }
        if (debouncedFilters.versions.length) {
          body.versions = debouncedFilters.versions;
        }

        const res = await fetch(`${apiBase}/crops`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(body),
          signal: abort.signal,
        });

        if (!res.ok) {
          throw new Error(`Search failed: ${res.status}`);
        }

        const json: CropSearchResponse = await res.json();
        setTotal(json.total || 0);
        setCrops(json.data || []);
      } catch (e: any) {
        if (e.name !== "AbortError") {
          setError(e.message || String(e));
        }
      } finally {
        setLoadingSearch(false);
      }
    })();

    return () => abort.abort();
  }, [apiBase, page, debouncedFilters]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <ThemeProvider theme={theme}>
      {/* NOTE: no extra outer padding/margin/title here */}
      <Grid container spacing={2}>
        {/* Filters */}
        <Grid size={{xs: 12, md: 4, lg: 3}}>
          <Paper variant="outlined" sx={{p: 2, position: "sticky", top: 16}}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography
                variant="subtitle1"
                onClick={handleSecretTap}
                sx={{
                  cursor: "default",
                  userSelect: "none",
                }}
              >
                Filters
              </Typography>
              {loadingMeta && <CircularProgress size={18}/>}
            </Box>
            <Divider sx={{mb: 2}}/>

            {/* ID */}
            <TextField
              label="ID"
              placeholder="e.g. croparia:iron"
              fullWidth
              value={idInput}
              onChange={(e) => setIdInput(e.target.value)}
              size="small"
              sx={{mb: 2}}
            />

            {/* Material */}
            <TextField
              label="Material"
              placeholder="e.g. iron"
              fullWidth
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              size="small"
              sx={{mb: 2}}
            />

            {/* Dependencies multi-select */}
            <Box sx={{mb: 2}}>
              <MultiSelectChip
                label="Dependencies"
                options={allDeps}
                value={depsSelected}
                onChange={setDepsSelected}
                placeholder="Select dependencies"
                disabled={loadingMeta}
              />
            </Box>

            {/* Versions multi-select */}
            <Box sx={{mb: 2}}>
              <MultiSelectChip
                label="Versions"
                options={allVersions}
                value={versionsSelected}
                onChange={setVersionsSelected}
                placeholder="Select versions"
                disabled={loadingMeta}
              />
            </Box>

            {/* Tier slider */}
            <Box sx={{mb: 1}}>
              <Typography variant="body2" sx={{mb: 1}}>
                Tier:{" "}
                {tier ? (
                  <>
                    <img
                      src={seedTextureUrl(tier)}
                      alt={`tier-${tier}`}
                      width={20}
                      height={20}
                      style={{imageRendering: "pixelated"}}
                    />{" "}
                    {tier}
                  </>
                ) : (
                  "(any)"
                )}
              </Typography>
              <Slider
                size="small"
                value={tier ?? TIER_MIN}
                min={TIER_MIN}
                max={TIER_MAX}
                step={1}
                marks
                onChange={(_, v) => setTier(Number(v))}
                onChangeCommitted={(_, v) => setTier(Number(v))}
              />
              <Box sx={{display: "flex", gap: 1, mt: 1}}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setTier(null)}
                >
                  Any
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setTier(1)}
                >
                  Reset to 1
                </Button>
              </Box>
            </Box>

            {error && (
              <Box sx={{mt: 2}}>
                <Chip
                  color="error"
                  label={error}
                  onDelete={() => setError(null)}
                  size="small"
                />
              </Box>
            )}
          </Paper>
        </Grid>

        {/* List / Results */}
        <Grid size={{xs: 12, md: 8, lg: 9}}>
          <Paper variant="outlined" sx={{p: 2}}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Typography variant="subtitle1">
                Results ({total ?? 0})
              </Typography>
              <Pagination
                size="small"
                count={pageCount}
                page={page}
                onChange={(_, p) => setPage(p)}
              />
            </Box>
            <Divider sx={{mb: 1}}/>

            {loadingSearch && (
              <Box sx={{display: "flex", justifyContent: "center", py: 4}}>
                <CircularProgress/>
              </Box>
            )}

            {!loadingSearch && crops.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No results.
              </Typography>
            )}

            {!loadingSearch &&
              crops.map((crop) => {
                const depKeys = Object.keys(crop.dependencies || {});
                const rgbHex = formatColor(crop.color);

                return (
                  <Accordion
                    key={crop.id}
                    expanded={expanded === crop.id}
                    onChange={(_, isExp) =>
                      setExpanded(isExp ? crop.id : false)
                    }
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{fontWeight: 600, wordBreak: "break-all"}}
                        >
                          {crop.id}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          {depKeys.length > 0 ? (
                            depKeys.map((d) => (
                              <Chip key={d} size="small" label={d}/>
                            ))
                          ) : (
                            <Chip size="small" label="no-deps"/>
                          )}
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid size={{xs: 12, md: 7}}>
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "140px 1fr",
                              rowGap: 1,
                              columnGap: 2,
                            }}
                          >
                            <Typography color="text.secondary">
                              Type
                            </Typography>
                            <Typography>{crop.type}</Typography>

                            <Typography color="text.secondary">
                              Color
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: 0.5,
                                  background: rgbHex,
                                  border: "1px solid",
                                  borderColor: "divider",
                                }}
                              />
                              <Typography>{rgbHex}</Typography>
                            </Box>

                            <Typography color="text.secondary">
                              Material
                            </Typography>
                            <Typography>{crop.material}</Typography>

                            <Typography color="text.secondary">
                              Tier
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <img
                                src={seedTextureUrl(crop.tier)}
                                alt={`tier-${crop.tier}`}
                                width={20}
                                height={20}
                                style={{imageRendering: "pixelated"}}
                              />
                              <Typography>{crop.tier}</Typography>
                            </Box>

                            <Typography color="text.secondary">
                              Translations
                            </Typography>
                            <Box>
                              {crop.translations &&
                              Object.keys(crop.translations).length > 0 ? (
                                Object.entries(crop.translations).map(
                                  ([lang, val]) => (
                                    <Box
                                      key={lang}
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      <Chip size="small" label={lang}/>
                                      <Typography>{val}</Typography>
                                    </Box>
                                  )
                                )
                              ) : (
                                <Typography color="text.secondary">
                                  (none)
                                </Typography>
                              )}
                            </Box>

                            <Typography color="text.secondary">
                              Dependencies
                            </Typography>
                            <Box>
                              {depKeys.length > 0 ? (
                                depKeys.map((m) => (
                                  <Box
                                    key={m}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Chip size="small" label={m}/>
                                    <Typography color="text.secondary">
                                      {crop.dependencies[m]}
                                    </Typography>
                                  </Box>
                                ))
                              ) : (
                                <Typography color="text.secondary">
                                  (none)
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Grid>

                        <Grid size={{xs: 12, md: 5}}>
                          {/* Previews */}
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "repeat(3, 1fr)",
                              gap: 1,
                              alignItems: "center",
                              justifyItems: "center",
                            }}
                          >
                            <Box sx={{textAlign: "center"}}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Seed
                              </Typography>
                              <TintPic
                                src={SEED_GRAY_URL}
                                color={rgbHex}
                                size={64}
                              />
                            </Box>
                            <Box sx={{textAlign: "center"}}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Fruit
                              </Typography>
                              <LayeredPic
                                baseSrc={FRUIT_BASE(crop.type)}
                                overlaySrc={FRUIT_OVERLAY(crop.type)}
                                overlayTint={rgbHex}
                                size={64}
                              />
                            </Box>
                            <Box sx={{textAlign: "center"}}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Crop
                              </Typography>
                              <LayeredPic
                                baseSrc={CROP_BLOCK_BASE(crop.type)}
                                overlaySrc={CROP_BLOCK_OVERLAY(crop.type)}
                                overlayTint={rgbHex}
                                size={64}
                              />
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      <CodeBlock language="json">
                        {JSON.stringify(crop, null, 2)}
                      </CodeBlock>
                    </AccordionDetails>
                  </Accordion>
                );
              })}

            {total > PAGE_SIZE && (
              <Box sx={{display: "flex", justifyContent: "center", mt: 2}}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(_, p) => setPage(p)}
                />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
