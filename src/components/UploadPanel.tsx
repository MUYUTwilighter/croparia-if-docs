// src/components/console/UploadPanel.tsx
import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import useApiBase from "@site/src/hooks/useApiBase";
import Crop from "@site/src/type/Crop";

export interface UploadPanelProps {
  onUploaded: () => void;
  onUnauthorized: () => void;
}

export interface UploadResult {
  fileName: string;
  status: "success" | "error";
  message: string;
  hash?: string;
}

const UploadPanel: React.FC<UploadPanelProps> = ({
                                                   onUploaded,
                                                   onUnauthorized,
                                                 }) => {
  const apiBase = useApiBase();
  const [versionInput, setVersionInput] = React.useState("");
  const [versions, setVersions] = React.useState<string[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [uploadResults, setUploadResults] = React.useState<UploadResult[]>([]);
  const [snackbar, setSnackbar] = React.useState<string | null>(null);

  const handleAddVersion = () => {
    const v = versionInput.trim();
    if (!v) return;
    if (!versions.includes(v)) {
      setVersions((prev) => [...prev, v]);
    }
    setVersionInput("");
  };

  const handleVersionKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddVersion();
    }
  };

  const handleRemoveVersion = (v: string) => {
    setVersions((prev) => prev.filter((x) => x !== v));
  };

  const handleUploadFiles: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!versions.length) {
      setSnackbar("Add at least one version before uploading.");
      e.target.value = "";
      return;
    }

    const list = Array.from(files);
    setUploading(true);
    setUploadResults([]);

    try {
      for (const file of list) {
        try {
          const text = await file.text();
          const json = JSON.parse(text) as Crop;
          const enriched: Crop = {
            ...json,
            versions: versions,
          };

          const res = await fetch(`${apiBase}/crops/upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(enriched),
          });

          if (res.status === 403) {
            onUnauthorized();
            return;
          }

          if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            setUploadResults((prev) => [
              ...prev,
              {
                fileName: file.name,
                status: "error",
                message: j.error || `Upload failed: ${res.status}`,
              },
            ]);
          } else {
            const j = (await res.json().catch(() => ({}))) as {
              message?: string;
              hash?: string;
            };
            setUploadResults((prev) => [
              ...prev,
              {
                fileName: file.name,
                status: "success",
                message: j.message || "Uploaded",
                hash: j.hash,
              },
            ]);
          }
        } catch (err: any) {
          setUploadResults((prev) => [
            ...prev,
            {
              fileName: file.name,
              status: "error",
              message: err.message || String(err),
            },
          ]);
        }
      }

      // 通知外层刷新（列表 + meta）
      onUploaded();
      setSnackbar("Upload completed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          mb: 1,
        }}
      >
        <Typography variant="subtitle1">Upload Crops</Typography>
        {uploading && <CircularProgress size={18} />}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        1. Add version tags &nbsp; 2. Select one or more crop JSON files to
        upload. All selected files will be uploaded with the specified
        versions.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          flexWrap: "wrap",
          mb: 1,
        }}
      >
        <TextField
          label="Version"
          size="small"
          value={versionInput}
          onChange={(e) => setVersionInput(e.target.value)}
          onKeyDown={handleVersionKeyDown}
          placeholder="e.g. 1.21.1"
        />
        <Button variant="outlined" size="small" onClick={handleAddVersion}>
          Add
        </Button>
      </Box>

      <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
        {versions.map((v) => (
          <Chip
            key={v}
            label={v}
            size="small"
            onDelete={() => handleRemoveVersion(v)}
          />
        ))}
        {versions.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No versions added yet.
          </Typography>
        )}
      </Box>

      <Button variant="contained" component="label" disabled={uploading}>
        Select crop JSON files
        <input
          type="file"
          hidden
          multiple
          accept="application/json"
          onChange={handleUploadFiles}
        />
      </Button>

      {uploadResults.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Upload results:
          </Typography>
          {uploadResults.map((r, i) => (
            <Box
              key={`${r.fileName}-${i}`}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: 1,
                border: "1px solid",
                borderColor:
                  r.status === "success" ? "success.main" : "error.main",
                p: 1,
                mb: 0.5,
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Typography variant="body2">{r.fileName}</Typography>
              <Typography
                variant="body2"
                color={r.status === "success" ? "success.main" : "error.main"}
              >
                {r.message}
                {r.hash ? ` (hash: ${r.hash})` : ""}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        message={snackbar || ""}
      />
    </Paper>
  );
};

export default UploadPanel;
