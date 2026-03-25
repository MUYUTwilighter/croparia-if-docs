---
title: Versioning Policy
outline: deep
description: Versioning policy for the Croparia IF docs site, including current release entry points, archive routes, and version-tag generation.
keywords:
  - Croparia IF
  - versioning
  - documentation
  - archive
---

# Versioning Policy

The default landing pages always point to the actively maintained release.

## Current Release

- Croparia IF `1.1.0a`
- Minecraft `1.21.1`
- Current Chinese entry: [/](/)
- Current English entry: [/en/](/en/)

## Archived Release Routes

- Chinese: `/versions/<version>/`
- English: `/en/versions/<version>/`

## Tag-Driven Publishing

Pages that support multiple versions do not need manual copies. They declare `modVersions`, and the prepare script publishes them into the matching version routes.
