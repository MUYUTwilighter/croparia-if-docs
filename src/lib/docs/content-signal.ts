// Development helper for content-driven hot reload.
// `scripts/dev.mjs` rewrites this file when files under `content/` change.
// Outside development we keep a stable baseline so builds remain deterministic.
export const contentSignal = "static" as const;
