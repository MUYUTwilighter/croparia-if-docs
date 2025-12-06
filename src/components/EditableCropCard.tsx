import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import useApiBase from "@site/src/hooks/useApiBase";
import Crop from "@site/src/type/Crop";

export interface EditableCropCardProps {
  crop: Crop;
  onChanged: () => void;
  onUnauthorized: () => void;
}

const EditableCropCard: React.FC<EditableCropCardProps> = ({
                                                             crop,
                                                             onChanged,
                                                             onUnauthorized,
                                                           }) => {
  const apiBase = useApiBase();

  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [removing, setRemoving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [material, setMaterial] = React.useState(crop.material);
  const [tier, setTier] = React.useState<number>(crop.tier);
  const [color, setColor] = React.useState(crop.color);
  const [type, setType] = React.useState(crop.type);
  const [versionsText, setVersionsText] = React.useState(
    (crop.versions ?? []).join(", ")
  );
  const [translationsText, setTranslationsText] = React.useState(
    JSON.stringify(crop.translations ?? {}, null, 2)
  );
  const [dependenciesText, setDependenciesText] = React.useState(
    JSON.stringify(crop.dependencies ?? {}, null, 2)
  );

  React.useEffect(() => {
    if (!editing) {
      setMaterial(crop.material);
      setTier(crop.tier);
      setColor(crop.color);
      setType(crop.type);
      setVersionsText((crop.versions ?? []).join(", "));
      setTranslationsText(JSON.stringify(crop.translations ?? {}, null, 2));
      setDependenciesText(JSON.stringify(crop.dependencies ?? {}, null, 2));
      setError(null);
    }
  }, [editing, crop]);

  const handleSave = async () => {
    if (!crop.hash) {
      setError("Missing hash, cannot modify this crop.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      let translations: Record<string, string>;
      let dependencies: Record<string, string>;

      try {
        translations = JSON.parse(translationsText || "{}");
      } catch {
        setError("Translations JSON is invalid.");
        return;
      }

      try {
        dependencies = JSON.parse(dependenciesText || "{}");
      } catch {
        setError("Dependencies JSON is invalid.");
        return;
      }

      const versionsParsed = versionsText
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

      const body: Crop = {
        ...crop,
        material,
        tier,
        color,
        type,
        translations,
        dependencies,
        versions: versionsParsed.length ? versionsParsed : undefined,
      };

      const res = await fetch(
        `${apiBase}/crops/modify/${encodeURIComponent(crop.hash)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );

      if (res.status === 403) {
        onUnauthorized();
        return;
      }

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || `Modify failed: ${res.status}`);
        return;
      }

      setEditing(false);
      onChanged();
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!crop.hash) {
      setError("Missing hash, cannot remove this crop.");
      return;
    }
    if (
      !window.confirm(
        `Remove crop "${crop.id}"? This operation cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setRemoving(true);
      setError(null);

      const res = await fetch(
        `${apiBase}/crops/remove/${encodeURIComponent(crop.hash)}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (res.status === 403) {
        onUnauthorized();
        return;
      }

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || `Remove failed: ${res.status}`);
        return;
      }

      onChanged();
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setRemoving(false);
    }
  };

  const depKeys = Object.keys(crop.dependencies || {});
  const hashShort =
    crop.hash && crop.hash.length > 12
      ? crop.hash.slice(0, 12) + "..."
      : crop.hash;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Typography sx={{ fontWeight: 600, wordBreak: "break-all" }}>
            {crop.id}
          </Typography>
          {hashShort && (
            <Chip
              size="small"
              label={`hash: ${hashShort}`}
              variant="outlined"
            />
          )}
          {depKeys.length > 0 ? (
            depKeys.map((d) => <Chip size="small" key={d} label={d} />)
          ) : (
            <Chip size="small" label="no-deps" />
          )}
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "110px 1fr",
                rowGap: 1,
                columnGap: 1.5,
                alignItems: "center",
              }}
            >
              <Typography color="text.secondary">Material</Typography>
              {editing ? (
                <TextField
                  size="small"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                />
              ) : (
                <Typography>{crop.material.toString()}</Typography>
              )}

              <Typography color="text.secondary">Tier</Typography>
              {editing ? (
                <TextField
                  size="small"
                  type="number"
                  slotProps={{
                    htmlInput: { min: 1, max: 7 }
                  }}
                  value={tier}
                  onChange={(e) => setTier(Number(e.target.value))}
                />
              ) : (
                <Typography>{crop.tier}</Typography>
              )}

              <Typography color="text.secondary">Color</Typography>
              {editing ? (
                <TextField
                  size="small"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#AARRGGBB or #RRGGBB"
                />
              ) : (
                <Typography>{crop.color}</Typography>
              )}

              <Typography color="text.secondary">Type</Typography>
              {editing ? (
                <TextField
                  size="small"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                />
              ) : (
                <Typography>{crop.type}</Typography>
              )}

              <Typography color="text.secondary">Versions</Typography>
              <Box>
                {editing ? (
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="e.g. 1.21.0, 1.21.1"
                    value={versionsText}
                    onChange={(e) => setVersionsText(e.target.value)}
                  />
                ) : crop.versions && crop.versions.length > 0 ? (
                  crop.versions.map((v) => (
                    <Chip key={v} size="small" label={v} />
                  ))
                ) : (
                  <Typography color="text.secondary">(none)</Typography>
                )}
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              Translations (JSON)
            </Typography>
            {editing ? (
              <TextField
                multiline
                minRows={4}
                maxRows={8}
                fullWidth
                size="small"
                value={translationsText}
                onChange={(e) => setTranslationsText(e.target.value)}
              />
            ) : (
              <Box
                sx={{
                  maxHeight: 180,
                  overflow: "auto",
                  typography: "body2",
                  fontFamily: "monospace",
                  whiteSpace: "pre",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 1,
                }}
              >
                {JSON.stringify(crop.translations ?? {}, null, 2)}
              </Box>
            )}

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, mb: 0.5 }}
            >
              Dependencies (JSON)
            </Typography>
            {editing ? (
              <TextField
                multiline
                minRows={3}
                maxRows={6}
                fullWidth
                size="small"
                value={dependenciesText}
                onChange={(e) => setDependenciesText(e.target.value)}
              />
            ) : (
              <Box
                sx={{
                  maxHeight: 140,
                  overflow: "auto",
                  typography: "body2",
                  fontFamily: "monospace",
                  whiteSpace: "pre",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 1,
                }}
              >
                {JSON.stringify(crop.dependencies ?? {}, null, 2)}
              </Box>
            )}
          </Grid>
        </Grid>

        {error && (
          <Alert
            severity="error"
            sx={{ mt: 1 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            mt: 2,
            flexWrap: "wrap",
          }}
        >
          {editing ? (
            <>
              <Button
                size="small"
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                startIcon={
                  saving ? <CircularProgress size={16} /> : <SaveIcon />
                }
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          )}

          <Button
            size="small"
            color="error"
            variant="outlined"
            startIcon={
              removing ? <CircularProgress size={16} /> : <DeleteIcon />
            }
            onClick={handleRemove}
            disabled={removing}
          >
            {removing ? "Removing..." : "Remove"}
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default EditableCropCard;
