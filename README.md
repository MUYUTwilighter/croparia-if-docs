# Croparia IF Docs

This repository contains the VitePress documentation site for the Croparia IF Minecraft mod.

## Scope

- This repository is the docs workspace.
- The main mod repository lives at `D:\Documents\JavaProjects\croparia-if`.
- Read from the mod repository when version or behavior needs verification.
- Do not modify the mod repository from this docs workspace.

## Current Stack

- VitePress `^1.6.4`
- Default locales:
  - Simplified Chinese at `/`
  - English at `/en/`
- Current recorded mod version:
  - Croparia IF `1.1.0a`
  - Minecraft `1.21.1`

The current version values come from `D:\Documents\JavaProjects\croparia-if\gradle.properties`.

## Commands

```bash
npm run docs:prepare
npm run docs:dev
npm run docs:build
npm run docs:preview
```

Notes:

- `docs:prepare` generates the actual VitePress source tree into `.generated/`.
- `docs:dev`, `docs:build`, and `docs:preview` all run `docs:prepare` first.
- On this machine, `npm.cmd` may be needed instead of `npm` in PowerShell.

## Content Model

This site uses a generated content model so long-term multi-version maintenance does not require copying the whole docs tree for every release.

### Source Directories

- `content/versioned/base/`
  - Shared pages reused across multiple versions.
- `content/versioned/releases/<version>/`
  - Version-specific overrides.
- `content/global/`
  - Non-versioned pages rendered at fixed routes.
- `.generated/`
  - Prepared output consumed by VitePress via `srcDir`.

### Inheritance Rules

For each locale and target version:

1. Shared content from `content/versioned/base/<locale>/` is copied first.
2. Version-specific content from `content/versioned/releases/<version>/<locale>/` is layered on top.
3. Global content from `content/global/<locale>/` is copied into fixed routes.

This means unchanged pages stay single-sourced, while changed pages can be overridden per version.

## Routing Convention

- Current Chinese docs: `/`
- Current English docs: `/en/`
- Archived Chinese docs: `/versions/<version>/`
- Archived English docs: `/en/versions/<version>/`

The current release lives at the locale root. Archived releases should only get their own pages when content actually differs.

## Key Files

- `memory.md`
  - Project memory and workflow constraints.
- `docs.config.mjs`
  - Shared locale and version metadata.
- `.vitepress/config.ts`
  - VitePress config, nav, sidebar, and route-aware UI setup.
- `scripts/prepare-docs.mjs`
  - Content preparation script for shared and versioned docs.

## Adding A New Archived Version

1. Add the version metadata in `docs.config.mjs`.
2. Set its inheritance relationship if it mostly follows an earlier version.
3. Create only the changed pages under `content/versioned/releases/<version>/`.
4. Run `npm.cmd run docs:build` to verify routing and content generation.

## Assets

- If assets are needed from the mod repository or the old docs backup, copy them into this repository before referencing them.
- Do not hotlink or directly reference files from outside this repository in site source.

## Git Workflow

- Keep commits atomic.
- Do not mix unrelated dirty worktree changes into a commit.
- By project convention, completed modifications are typically committed unless explicitly requested otherwise.
