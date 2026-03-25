---
title: Versioning Policy
outline: deep
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

## Content Reuse Strategy

Archived releases do not need a full copy of the docs by default:

1. shared base content is loaded first
2. release-specific override files are layered on top
3. only changed pages need their own Markdown files
