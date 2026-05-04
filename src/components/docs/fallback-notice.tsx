"use client";

import { Alert } from "@mui/material";

import { useFallbackNotice } from "@/src/components/docs/doc-context";

export function FallbackNotice() {
  const { shouldDisplay, message } = useFallbackNotice();

  if (!shouldDisplay || !message) {
    return null;
  }

  return <Alert severity="info">{message}</Alert>;
}
