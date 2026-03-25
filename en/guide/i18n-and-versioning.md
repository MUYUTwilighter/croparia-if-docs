---
title: I18n and Versioning
outline: deep
---

# I18n and Versioning

## Internationalization

VitePress has built-in i18n support. This site is now configured for:

- `root`: Simplified Chinese
- `en`: English

The content structure follows this pattern:

```text
.
├─ index.md
├─ guide/
├─ en/
│  ├─ index.md
│  └─ guide/
└─ versions/
```

## Versioning

VitePress does not ship a dedicated one-click versioning system. For this site, we use a directory-based strategy:

- the current release stays at the root and `/en/`
- archived releases will live under `/versions/<version>/`
- archived English releases will live under `/en/versions/<version>/`

This keeps URLs stable, predictable, and easy to automate later.

## Current Recorded Release

- Mod `1.1.0a`
- Minecraft `1.21.1`
