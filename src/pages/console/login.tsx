import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

interface AuthResponse {
  authorized: boolean;
}

function useApiBase() {
  const { siteConfig } = useDocusaurusContext();
  return (siteConfig.customFields as any).API_URL as string;
}

function redirectToConsole() {
  if (typeof window !== "undefined") {
    window.location.href = "/console";
  }
}

export default function ConsoleLoginPage() {
  const apiBase = useApiBase();

  const [token, setToken] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [authChecked, setAuthChecked] = React.useState(false);

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
          setAuthChecked(true);
          return;
        }
        const json = (await res.json()) as AuthResponse;
        if (json.authorized) {
          redirectToConsole();
          return;
        }
      } finally {
        setAuthChecked(true);
      }
    })();

    return () => abort.abort();
  }, [apiBase]);

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    if (!token.trim()) {
      setError("Token is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: token.trim() }),
      });

      if (res.status === 400) {
        setError("Token is missing or invalid.");
        return;
      }
      if (res.status === 401) {
        setError("Invalid token.");
        return;
      }
      if (!res.ok) {
        setError(`Login failed: ${res.status}`);
        return;
      }

      redirectToConsole();
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (!authChecked) {
    return (
      <Layout title="Console Login" description="Console login">
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
      </Layout>
    );
  }

  return (
    <Layout title="Console Login" description="Console login">
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 1,
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            maxWidth: 400,
            width: "100%",
            p: 3,
          }}
        >
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            Croparia IF Console
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Enter your console token to continue.
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Token"
              fullWidth
              size="small"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={submitting}
            >
              {submitting ? "Logging in..." : "Log in"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
}
