"use client";

import { useOptionalDocContext } from "@/src/components/docs/doc-context";

export function useGameLocale(explicitLocale?: string) {
  const docContext = useOptionalDocContext();

  return explicitLocale ?? docContext?.doc.requestedLocale ?? docContext?.doc.resolvedLocale ?? "zh";
}
