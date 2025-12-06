// src/components/console/ConsoleCropList.tsx
import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import MultiSelectChip from "@site/src/components/MultiSelectChip";
import EditableCropCard from "./EditableCropCard";
import useApiBase from "@site/src/hooks/useApiBase";
import Crop from "@site/src/type/Crop";
import useDebounced from "@site/src/hooks/useDebounced";
import {SearchOptions} from "@site/src/type/SearchOptions";

export interface ConsoleCropListProps {
  reloadToken: number;
  onUnauthorized: () => void;
  onRequestReload: () => void;
}

interface CropSearchResponse {
  total: number;
  data: Crop[];
}

const ConsoleCropList: React.FC<ConsoleCropListProps> = ({
                                                           reloadToken,
                                                           onUnauthorized,
                                                           onRequestReload,
                                                         }) => {
  const apiBase = useApiBase();

  const [idFilter, setIdFilter] = React.useState("");
  const [materialFilter, setMaterialFilter] = React.useState("");
  const [tierFilter, setTierFilter] = React.useState<number | null>(null);
  const [versionsAll, setVersionsAll] = React.useState<string[]>([]);
  const [depsAll, setDepsAll] = React.useState<string[]>([]);
  const [versionsSel, setVersionsSel] = React.useState<string[]>([]);
  const [depsSel, setDepsSel] = React.useState<string[]>([]);
  const [loadingMeta, setLoadingMeta] = React.useState(false);

  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [crops, setCrops] = React.useState<Crop[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const filters = React.useMemo(
    () => ({
      id: idFilter.trim(),
      material: materialFilter.trim(),
      tier: tierFilter,
      versions: versionsSel,
      dependencies: depsSel,
    }),
    [
      idFilter.trim(),
      materialFilter.trim(),
      tierFilter,
      versionsSel.join(","),
      depsSel.join(","),
    ]
  );

  const debouncedFilters = useDebounced(filters, 250);
  const pageCount = Math.max(1, Math.ceil(total / 20));

  // meta (versions / dependencies) —— 现在依赖 reloadToken
  React.useEffect(() => {
    let abort = new AbortController();
    (async () => {
      try {
        setLoadingMeta(true);
        const [vRes, dRes] = await Promise.all([
          fetch(`${apiBase}/crops/versions`, {
            credentials: "include",
            signal: abort.signal,
          }),
          fetch(`${apiBase}/crops/dependencies`, {
            credentials: "include",
            signal: abort.signal,
          }),
        ]);

        if (vRes.status === 403 || dRes.status === 403) {
          onUnauthorized();
          return;
        }

        if (!vRes.ok || !dRes.ok) return;

        const vList: string[] = await vRes.json();
        const dList: string[] = await dRes.json();
        setVersionsAll(vList || []);
        setDepsAll(dList || []);
      } catch {
        // ignore
      } finally {
        setLoadingMeta(false);
      }
    })();

    return () => abort.abort();
  }, [apiBase, onUnauthorized, reloadToken]);

  // reloadToken 或 filters 更改时，一般会从第一页开始
  React.useEffect(() => {
    setPage(1);
  }, [reloadToken, debouncedFilters]);

  // 列表查询 —— 依赖 reloadToken
  React.useEffect(() => {
    let abort = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const body: SearchOptions = {
          page: page - 1,
          size: 20,
        };

        if (debouncedFilters.id) body.id = debouncedFilters.id;
        if (debouncedFilters.material)
          body.material = debouncedFilters.material;
        if (
          debouncedFilters.tier &&
          debouncedFilters.tier >= 1 &&
          debouncedFilters.tier <= 7
        ) {
          body.tier = debouncedFilters.tier;
        }
        if (debouncedFilters.versions.length)
          body.versions = debouncedFilters.versions;
        if (debouncedFilters.dependencies.length)
          body.dependencies = debouncedFilters.dependencies;

        const res = await fetch(`${apiBase}/crops`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          credentials: "include",
          body: JSON.stringify(body),
          signal: abort.signal,
        });

        if (res.status === 403) {
          onUnauthorized();
          return;
        }

        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          setError(j.error || `Search failed: ${res.status}`);
          setCrops([]);
          setTotal(0);
          return;
        }

        const json: CropSearchResponse = await res.json();
        setCrops(json.data || []);
        setTotal(json.total || 0);
      } catch (e: any) {
        if (e.name === "AbortError") return;
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    })();

    return () => abort.abort();
  }, [apiBase, page, debouncedFilters, onUnauthorized, reloadToken]);

  return (
    <Paper variant="outlined" sx={{p: 2}}>
      {/* Filters header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          mb: 1,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="subtitle1">Crops</Typography>
        <Pagination
          size="small"
          count={pageCount}
          page={page}
          onChange={(_, p) => setPage(p)}
        />
      </Box>

      {/* Filters */}
      <Box sx={{mb: 2}}>
        <Grid container spacing={1.5}>
          <Grid size={{xs: 12, md: 4}}>
            <TextField
              fullWidth
              size="small"
              label="ID"
              value={idFilter}
              onChange={(e) => setIdFilter(e.target.value)}
              placeholder="croparia:iron"
            />
          </Grid>
          <Grid size={{xs: 12, md: 4}}>
            <TextField
              fullWidth
              size="small"
              label="Material"
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
              placeholder="iron"
            />
          </Grid>
          <Grid size={{xs: 12, md: 4}}>
            <Typography variant="body2" color="text.secondary">
              Tier {tierFilter ? `: ${tierFilter}` : "(any)"}
            </Typography>
            <Slider
              size="small"
              value={tierFilter ?? 1}
              min={1}
              max={7}
              step={1}
              marks
              onChange={(_, v) => setTierFilter(Number(v))}
            />
            <Box sx={{display: "flex", gap: 1}}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setTierFilter(null)}
              >
                Any
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setTierFilter(1)}
              >
                Reset
              </Button>
            </Box>
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
            <MultiSelectChip
              label="Dependencies"
              options={depsAll}
              value={depsSel}
              onChange={setDepsSel}
              disabled={loadingMeta}
              placeholder="Filter by dependencies"
            />
          </Grid>
          <Grid size={{xs: 12, md: 6}}>
            <MultiSelectChip
              label="Versions"
              options={versionsAll}
              value={versionsSel}
              onChange={setVersionsSel}
              disabled={loadingMeta}
              placeholder="Filter by versions"
            />
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{mb: 2}} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{display: "flex", justifyContent: "center", py: 4}}>
          <CircularProgress/>
        </Box>
      )}

      {!loading && crops.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No crops found.
        </Typography>
      )}

      {!loading &&
        crops.map((crop) => (
          <EditableCropCard
            key={crop.hash || crop.id}
            crop={crop}
            onChanged={onRequestReload}
            onUnauthorized={onUnauthorized}
          />
        ))}

      {total > 20 && (
        <Box sx={{display: "flex", justifyContent: "center", mt: 2}}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, p) => setPage(p)}
          />
        </Box>
      )}
    </Paper>
  );
};

export default ConsoleCropList;
