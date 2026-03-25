---
title: Docs Architecture
outline: deep
modVersions:
  - 1.1.0a
---

# Docs Architecture

The docs site now uses a tag-driven generation model.

## Directory Layers

- `content/docs/`: the authored Markdown source
- `content/public/`: static files such as `robots.txt`
- `docs/`: generated VitePress routing source

## Build Flow

1. maintain pages under `content/docs/<locale>/`
2. declare compatible mod versions with frontmatter `modVersions`
3. `npm run docs:prepare` expands those pages into `docs/`
4. VitePress builds from `docs/`

## Best Fit

This structure works well when most docs stay valid across multiple releases and only a small subset really diverges.
