import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {useColorMode} from "@docusaurus/theme-common";

// MUI v6
import {ThemeProvider, createTheme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
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
import TintPic from "@site/src/components/TintPic";
import LayeredPic from "@site/src/components/LayeredPic";
import CodeBlock from "@theme/CodeBlock"; // use Grid (v2 API with size prop available in MUI v6)

// ---------- Types from the API ----------
interface Material {
  name: string;
  count: number;
  components: Record<string, any>;
}

interface Crop {
  id: string;
  tier: number;
  material: string | Material;
  color: string; // #AARRGGBB
  type: "animal" | "crop" | "food" | "monster" | "nature";
  dependencies: Record<string, string>; // modid -> translationKey
  translations?: Record<string, string>;
}

const CROP_TYPES = ["animal", "crop", "food", "monster", "nature"] as const;

// ---------- Helpers ----------
const TIER_MIN = 1, TIER_MAX = 7, PAGE_SIZE = 20;

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
  return `#${rgb.toString(16).padStart(6, '0')}`;
}

function seedTextureUrl(tier: number): string {
  return `https://raw.githubusercontent.com/MUYUTwilighter/croparia-if/master/common/src/main/resources/assets/croparia/textures/item/croparia${tier}.png`;
}

// Asset URLs (raw.githubusercontent.com to avoid CORS)
const SEED_GRAY_URL = "https://raw.githubusercontent.com/MUYUTwilighter/croparia-if/master/common/src/main/resources/assets/croparia/textures/item/seed_crop.png";
const FRUIT_BASE = (t: Crop["type"]) => `https://raw.githubusercontent.com/MUYUTwilighter/croparia-if/master/common/src/main/resources/assets/croparia/textures/item/fruit_${t}.png`;
const FRUIT_OVERLAY = (t: Crop["type"]) => `https://raw.githubusercontent.com/MUYUTwilighter/croparia-if/master/common/src/main/resources/assets/croparia/textures/item/fruit_${t}_overlay.png`;
const CROP_BLOCK_BASE = (t: Crop["type"]) => `https://raw.githubusercontent.com/MUYUTwilighter/croparia-if/master/common/src/main/resources/assets/croparia/textures/block/${t}_stage_7.png`;
const CROP_BLOCK_OVERLAY = (t: Crop["type"]) => `https://raw.githubusercontent.com/MUYUTwilighter/croparia-if/master/common/src/main/resources/assets/croparia/textures/block/${t}_stage_7_overlay.png`;

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function CropSearchPanel() {
  const apiBase = useApiBase();
  const {colorMode} = useColorMode();

  const theme = React.useMemo(() => createTheme({
    palette: {mode: colorMode === "dark" ? "dark" : "light"},
  }), [colorMode]);

  // Versions / meta
  const [versions, setVersions] = React.useState<string[]>([]);
  const [version, setVersion] = React.useState<string>("");
  const [allIds, setAllIds] = React.useState<string[]>([]);
  const [allDeps, setAllDeps] = React.useState<string[]>([]);
  const [loadingMeta, setLoadingMeta] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Filters
  const [idInput, setIdInput] = React.useState("");
  const [material, setMaterial] = React.useState("");
  const [depsSelected, setDepsSelected] = React.useState<string[]>([]);
  const [typesSelected, setTypesSelected] = React.useState<string[]>([]);
  const [tier, setTier] = React.useState<number | null>(null);

  // Search state
  const [ids, setIds] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(1);
  const [loadingSearch, setLoadingSearch] = React.useState(false);

  // Page crops
  const [crops, setCrops] = React.useState<Crop[]>([]);
  const [expanded, setExpanded] = React.useState<string | false>(false);

  // --- Fetch versions at mount ---
  React.useEffect(() => {
    let abort = new AbortController();
    (async () => {
      try {
        setLoadingMeta(true);
        const res = await fetch(`${apiBase}/version`, {signal: abort.signal});
        if (!res.ok) throw new Error(`Failed to load versions: ${res.status}`);
        const data: string[] = await res.json();
        setVersions(data);
        if (data.length > 0) setVersion(v => v || data[0]);
      } catch (e: any) {
        if (e.name !== 'AbortError') setError(e.message || String(e));
      } finally {
        setLoadingMeta(false);
      }
    })();
    return () => abort.abort();
  }, [apiBase]);

  // --- Fetch ids & dependencies whenever version changes ---
  React.useEffect(() => {
    if (!version) return;
    let cancel = new AbortController();
    (async () => {
      try {
        setLoadingMeta(true);
        const [idsRes, depsRes] = await Promise.all([
          fetch(`${apiBase}/version/${encodeURIComponent(version)}`, {signal: cancel.signal}),
          fetch(`${apiBase}/dependencies/${encodeURIComponent(version)}`, {signal: cancel.signal}),
        ]);
        if (!idsRes.ok) throw new Error(`Failed to load ids: ${idsRes.status}`);
        if (!depsRes.ok) throw new Error(`Failed to load dependencies: ${depsRes.status}`);
        const idsList: string[] = await idsRes.json();
        const depsJson = await depsRes.json();
        const depsList: string[] = Array.isArray(depsJson) ? depsJson : Object.keys(depsJson || {});
        setAllIds(idsList);
        setAllDeps(depsList);
        setDepsSelected([]);
        setIdInput("");
        setPage(1);
      } catch (e: any) {
        if (e.name !== 'AbortError') setError(e.message || String(e));
      } finally {
        setLoadingMeta(false);
      }
    })();
    return () => cancel.abort();
  }, [version, apiBase]);

  // Stable filters + debounce
  const filters = React.useMemo(() => ({
    idInput,
    material,
    depsSelected,
    typesSelected,
    tier,
  }), [idInput, material, depsSelected.join(','), typesSelected.join(','), tier]);
  const debouncedFilters = useDebouncedValue(filters, 250);

  // --- Trigger search when version or filters change ---
  React.useEffect(() => {
    if (!version) return;
    let cancel = new AbortController();
    (async () => {
      setLoadingSearch(true);
      setExpanded(false);
      try {
        const params = new URLSearchParams();
        if (debouncedFilters.idInput.trim()) params.set('id', debouncedFilters.idInput.trim());
        if (debouncedFilters.material.trim()) params.set('material', debouncedFilters.material.trim());
        if (debouncedFilters.depsSelected.length) params.set('dependencies', debouncedFilters.depsSelected.join(','));
        if (debouncedFilters.typesSelected.length) params.set('types', debouncedFilters.typesSelected.join(','));
        if (debouncedFilters.tier && debouncedFilters.tier >= TIER_MIN && debouncedFilters.tier <= TIER_MAX) params.set('tier', String(debouncedFilters.tier));

        const url = `${apiBase}/search/${encodeURIComponent(version)}${params.toString() ? `?${params.toString()}` : ''}`;
        const res = await fetch(url, {signal: cancel.signal});
        if (!res.ok) throw new Error(`Search failed: ${res.status}`);
        const idList: string[] = await res.json();
        setIds(idList);
        setPage(1);
      } catch (e: any) {
        if (e.name !== 'AbortError') setError(e.message || String(e));
      } finally {
        setLoadingSearch(false);
      }
    })();
    return () => cancel.abort();
  }, [version, debouncedFilters, apiBase]);

  // --- Fetch current page crops ---
  React.useEffect(() => {
    if (!version || ids.length === 0) {
      setCrops([]);
      return;
    }
    const start = (page - 1) * PAGE_SIZE;
    const pageIds = ids.slice(start, start + PAGE_SIZE);
    let cancel = new AbortController();
    (async () => {
      try {
        const qs = new URLSearchParams({ids: pageIds.join(',')}).toString();
        const res = await fetch(`${apiBase}/crop/${encodeURIComponent(version)}?${qs}`, {signal: cancel.signal});
        if (!res.ok) throw new Error(`Failed to load crops: ${res.status}`);
        const list: Crop[] = await res.json();
        setCrops(list);
      } catch (e: any) {
        if (e.name !== 'AbortError') setError(e.message || String(e));
      }
    })();
    return () => cancel.abort();
  }, [ids, page, version, apiBase]);

  const pageCount = Math.max(1, Math.ceil(ids.length / PAGE_SIZE));

  const handleToggleType = (t: string) => {
    setTypesSelected(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };
  const handleToggleDep = (d: string) => {
    setDepsSelected(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Header / Version Picker */}
      <Box sx={{mb: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap'}}>
        <Autocomplete
          size="small"
          options={versions}
          sx={{minWidth: 240}}
          value={version || null}
          onChange={(_, v) => setVersion(v || "")}
          renderInput={(params) => <TextField {...params} label="Version"/>}/>
        {loadingMeta && <CircularProgress size={20}/>}
        {error && <Chip color="error" label={error} onDelete={() => setError(null)}/>}
      </Box>

      <Grid container spacing={2}>
        {/* Sidebar Filters */}
        <Grid size={{xs: 12, md: 4, lg: 3}}>
          <Paper variant="outlined" sx={{p: 2, position: 'sticky', top: 16}}>
            <Typography variant="subtitle1" gutterBottom>Filters</Typography>
            <Divider sx={{mb: 2}}/>

            {/* ID (autocomplete from allIds) */}
            <Autocomplete
              freeSolo
              options={allIds}
              value={idInput}
              onInputChange={(_, v) => setIdInput(v)}
              renderInput={(params) => <TextField {...params} label="ID" placeholder="e.g. croparia:iron"/>}
              sx={{mb: 2}}
            />

            {/* Material */}
            <TextField
              label="Material"
              placeholder="e.g. iron"
              fullWidth
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              sx={{mb: 2}}
            />

            {/* Dependencies (checkbox list) */}
            <Box sx={{mb: 2}}>
              <Typography variant="body2" sx={{mb: 1}}>Dependencies</Typography>
              <Box sx={{overflow: 'auto', pr: 1}}>
                <FormGroup>
                  {allDeps.map(dep => (
                    <FormControlLabel key={dep}
                                      control={<Checkbox checked={depsSelected.includes(dep)}
                                                         onChange={() => handleToggleDep(dep)}/>}
                                      label={dep}
                    />
                  ))}
                </FormGroup>
              </Box>
            </Box>

            {/* Types */}
            <Box sx={{mb: 2}}>
              <Typography variant="body2" sx={{mb: 1}}>Types</Typography>
              <FormGroup>
                {CROP_TYPES.map(t => (
                  <FormControlLabel key={t}
                                    control={<Checkbox checked={typesSelected.includes(t)}
                                                       onChange={() => handleToggleType(t)}/>}
                                    label={t}
                  />
                ))}
              </FormGroup>
            </Box>

            {/* Tier */}
            <Box sx={{mb: 1}}>
              <Typography variant="body2" sx={{mb: 1}}>Tier: {tier ? <>
                <img src={seedTextureUrl(tier)} alt={`tier-${tier}`} width={20} height={20}
                     style={{imageRendering: 'pixelated'}}/>
                {tier}
              </> : '(any)'}</Typography>
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
              <Box sx={{display: 'flex', gap: 1}}>
                <Button size="small" onClick={() => setTier(null)}>Any</Button>
                <Button size="small" onClick={() => setTier(1)}>Reset to 1</Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Results */}
        <Grid size={{xs: 12, md: 8, lg: 9}}>
          <Paper variant="outlined" sx={{p: 2}}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1}}>
              <Typography variant="subtitle1">Results ({ids.length})</Typography>
              <Pagination size="small" count={pageCount} page={page} onChange={(_, p) => setPage(p)}/>
            </Box>
            <Divider sx={{mb: 1}}/>

            {loadingSearch && (
              <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
                <CircularProgress/>
              </Box>
            )}

            {!loadingSearch && crops.length === 0 && (
              <Typography variant="body2" color="text.secondary">No results.</Typography>
            )}

            {!loadingSearch && crops.map(crop => {
              const depKeys = Object.keys(crop.dependencies || {});
              const rgbHex = formatColor(crop.color);
              return (
                <Accordion key={crop.id} expanded={expanded === crop.id}
                           onChange={(_, isExp) => setExpanded(isExp ? crop.id : false)}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap'}}>
                      {/* insert copy action */}
                      <Typography variant="body1" sx={{fontWeight: 600}}>{crop.id}</Typography>
                      <Box sx={{display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap'}}>
                        {depKeys.length > 0 ? depKeys.map(d => (<Chip key={d} size="small" label={d}/>)) :
                          <Chip size="small" label="no-deps"/>}
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid size={{xs: 12, md: 7}}>
                        <Box sx={{display: 'grid', gridTemplateColumns: '140px 1fr', rowGap: 1, columnGap: 2}}>
                          <Typography color="text.secondary">Type</Typography>
                          <Typography>{crop.type}</Typography>

                          <Typography color="text.secondary">Color</Typography>
                          <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <Box sx={{
                              width: 16,
                              height: 16,
                              borderRadius: 0.5,
                              background: rgbHex,
                              border: '1px solid',
                              borderColor: 'divider'
                            }}/>
                            <Typography>{rgbHex}</Typography>
                          </Box>

                          <Typography color="text.secondary">Material</Typography>
                          {typeof crop.material === 'string' ? (
                            <Typography>{crop.material} (x2)</Typography>
                          ) : (
                            <Box>
                              <Typography>{crop.material.name} (x{crop.material.count})</Typography>
                              {crop.material.components && Object.keys(crop.material.components).length > 0 && (
                                <Box sx={{mt: 0.5}}>
                                  {Object.entries(crop.material.components).map(([k, v]) => (
                                    <Chip key={k} size="small" label={`${k}: ${JSON.stringify(v)}`}
                                          sx={{mr: 0.5, mb: 0.5}}/>
                                  ))}
                                </Box>
                              )}
                            </Box>
                          )}

                          <Typography color="text.secondary">Tier</Typography>
                          <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <img src={seedTextureUrl(crop.tier)} alt={`tier-${crop.tier}`} width={20} height={20}
                                 style={{imageRendering: 'pixelated'}}/>
                            <Typography>{crop.tier}</Typography>
                          </Box>

                          <Typography color="text.secondary">Translations</Typography>
                          <Box>
                            {crop.translations && Object.keys(crop.translations).length > 0 ? (
                              Object.entries(crop.translations).map(([lang, val]) => (
                                <Box key={lang} sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                  <Chip size="small" label={lang}/>
                                  <Typography>{val}</Typography>
                                </Box>
                              ))
                            ) : (
                              <Typography color="text.secondary">(none)</Typography>
                            )}
                          </Box>

                          <Typography color="text.secondary">Dependencies</Typography>
                          <Box>
                            {depKeys.length > 0 ? (
                              depKeys.map(m => (
                                <Box key={m} sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                  <Chip size="small" label={m}/>
                                  <Typography color="text.secondary">{crop.dependencies[m]}</Typography>
                                </Box>
                              ))
                            ) : (
                              <Typography color="text.secondary">(none)</Typography>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{xs: 12, md: 5}}>
                        {/* Previews: seed (tinted), fruit (base + tinted overlay), crop block (base + overlay) */}
                        <Box sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: 1,
                          alignItems: 'center',
                          justifyItems: 'center'
                        }}>
                          <Box sx={{textAlign: 'center'}}>
                            <Typography variant="body2" color="text.secondary">Seed</Typography>
                            <TintPic src={SEED_GRAY_URL} color={rgbHex} size={64}/>
                          </Box>
                          <Box sx={{textAlign: 'center'}}>
                            <Typography variant="body2" color="text.secondary">Fruit</Typography>
                            <LayeredPic baseSrc={FRUIT_BASE(crop.type)} overlaySrc={FRUIT_OVERLAY(crop.type)}
                                        overlayTint={rgbHex} size={64}/>
                          </Box>
                          <Box sx={{textAlign: 'center'}}>
                            <Typography variant="body2" color="text.secondary">Crop</Typography>
                            <LayeredPic baseSrc={CROP_BLOCK_BASE(crop.type)}
                                        overlaySrc={CROP_BLOCK_OVERLAY(crop.type)} overlayTint={rgbHex} size={64}/>
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

            {ids.length > PAGE_SIZE && (
              <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                <Pagination count={pageCount} page={page} onChange={(_, p) => setPage(p)}/>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
