---
title: Docs Architecture
outline: deep
---

# Docs Architecture

The docs site now uses a generated structure instead of directly hand-maintaining every routed page.

## Directory Layers

- `content/versioned/base/`: shared pages that can be reused by multiple versions
- `content/versioned/releases/<version>/`: per-release overrides
- `content/global/`: non-versioned pages rendered at fixed site routes
- `.generated/`: the prepared VitePress source directory

## Build Flow

1. `npm run docs:prepare`
2. shared content and release overrides are merged into `.generated/`
3. VitePress reads the final pages through `srcDir: '.generated'`

## Why This Exists

- unchanged docs stay in one place
- only changed pages need release-specific copies
- adding a new archived version no longer requires copying the whole site
