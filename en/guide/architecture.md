---
title: Docs Architecture
outline: deep
---

# Docs Architecture

The current VitePress site is organized like this:

## Routing

- `/`: current Simplified Chinese home
- `/guide/`: current Simplified Chinese guide
- `/en/`: current English home
- `/en/guide/`: current English guide
- `/versions/`: versioning policy and archive entry for Chinese docs
- `/en/versions/`: versioning policy and archive entry for English docs

## Configuration

- Locale switching uses VitePress built-in `locales`
- Version switching uses directory conventions plus shared version metadata
- The current release and future archived releases are maintained in `.vitepress/config.ts`

## Future Growth

When we need to archive an older release:

1. Add the Markdown pages under `versions/<version>/` and `en/versions/<version>/`.
2. Append the version metadata to `archivedVersions` in `.vitepress/config.ts`.
3. Extract more shared content or automate generation if the release matrix grows.
