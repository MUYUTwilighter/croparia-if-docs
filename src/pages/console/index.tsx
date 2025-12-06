// src/pages/console/index.tsx
import React from "react";
import Layout from "@theme/Layout";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";

import UploadPanel from "@site/src/components/UploadPanel";
import ConsoleCropList from "@site/src/components/ConsoleCropList";
import useApiBase from "@site/src/hooks/useApiBase";

function redirectToLogin() {
  if (typeof window !== "undefined") {
    window.location.href = "/console/login";
  }
}

interface AuthResponse {
  authorized: boolean;
}

const ConsoleInner: React.FC = () => {
  const apiBase = useApiBase();

  const [authChecked, setAuthChecked] = React.useState(false);
  const [authorized, setAuthorized] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);

  const [reloadToken, setReloadToken] = React.useState(0);
  const triggerReload = React.useCallback(() => {
    setReloadToken((x) => x + 1);
  }, []);

  // 鉴权
  React.useEffect(() => {
    let abort = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${apiBase}/auth`, {
          method: "GET",
          credentials: "include",
          signal: abort.signal,
        });
        if (!res.ok) {
          setAuthorized(false);
          return;
        }
        const json = (await res.json()) as AuthResponse;
        if (!json.authorized) {
          redirectToLogin();
          return;
        }
        setAuthorized(true);
      } finally {
        setAuthChecked(true);
      }
    })();

    return () => abort.abort();
  }, [apiBase]);

  const handleUnauthorized = React.useCallback(() => {
    redirectToLogin();
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch(`${apiBase}/auth/logout`, {
        method: "POST",
        credentials: "include",
      }).catch(() => undefined);
    } finally {
      setLoggingOut(false);
      redirectToLogin();
    }
  };

  if (!authChecked) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!authorized) {
    // 已触发重定向，这里不再渲染内容
    return null;
  }

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 1, sm: 2 },
        py: 2,
      }}
    >
      {/* Title + Logout */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Croparia IF Console
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage crop definitions (upload, search, modify, remove).
          </Typography>
        </Box>
        <Tooltip title="Log out">
          <span>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? "Logging out..." : "Log out"}
            </Button>
          </span>
        </Tooltip>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <UploadPanel
            onUploaded={triggerReload}
            onUnauthorized={handleUnauthorized}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <ConsoleCropList
            reloadToken={reloadToken}
            onUnauthorized={handleUnauthorized}
            onRequestReload={triggerReload}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default function ConsolePage() {
  return (
    <Layout title="Console" description="Croparia IF console">
      <ConsoleInner />
    </Layout>
  );
}
