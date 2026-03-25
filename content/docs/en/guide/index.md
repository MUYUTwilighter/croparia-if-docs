---
title: Start Here
outline: deep
description: English guide entry for the current Croparia IF release, including docs architecture, versioning, and version-tag generation.
keywords:
  - Croparia IF
  - guide
  - docs architecture
  - versioning
modVersions:
  - 1.1.0a
---

# Start Here

The default docs currently target:

- Croparia IF `1.1.0a`
- compatible with Minecraft `1.21.1`

## Entry Points

- [Docs Architecture](/en/guide/architecture)
- [I18n and Versioning](/en/guide/i18n-and-versioning)
- [Content Version Tags](/en/guide/content-version-tags)
- [Versioning Policy](/en/versions/)

## Current Strategy

- author docs under `content/docs/`
- declare compatible Croparia IF mod versions with `modVersions`
- treat Croparia IF mod versions as the primary docs version axis, not Minecraft versions
- let the prepare script publish them into current or archived version routes
