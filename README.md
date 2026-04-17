# Croparia IF Docs

This repository contains the VitePress documentation site for the Croparia IF Minecraft mod.

## Scope

- This repository is the docs workspace.
- The main mod repository lives at `D:\Documents\JavaProjects\croparia-if`.
- Read from the mod repository when version or behavior needs verification.
- Do not modify the mod repository from this docs workspace.

## Current Stack

- VitePress `^1.6.4`
- Default docs locale:
  - Simplified Chinese at `/`
- Current recorded mod version:
  - Croparia IF `1.1.0a`
  - Minecraft `1.21.1`

The current version values come from `D:\Documents\JavaProjects\croparia-if\gradle.properties`.

## Commands

```bash
npm run docs:prepare
npm run docs:watch
npm run docs:dev
npm run docs:build
npm run docs:preview
npm run docs:publish -- <deploy-dir>
```

Notes:

- `docs:prepare` generates the actual VitePress source tree into `docs/`.
- `docs:watch` watches `content/` and `docs.config.mjs`, then regenerates `docs/` automatically.
- `docs:dev` starts both the content watcher and the VitePress dev server.
- `docs:build` and `docs:preview` still run `docs:prepare` first.
- `docs:publish` runs `docs:prepare`, builds VitePress, then mirrors `.vitepress/dist` into the deploy directory you pass in.
- On this machine, `npm.cmd` may be needed instead of `npm` in PowerShell.

PowerShell example:

```powershell
npm.cmd run docs:publish -- "D:\sites\croparia-if-docs"
```

You can also set `DOCS_DEPLOY_DIR` and run `npm run docs:publish`.
By default the publish script refuses to sync into a directory inside this repository, to avoid wiping local source files by mistake.

## Content Model

This site uses a generated content model so long-term multi-version maintenance does not require copying the whole docs tree for every release.

### Source Directories

- `content/docs/`
  - Authored Markdown source for the Chinese docs.
- `docs/`
  - Prepared output consumed by VitePress via `srcDir`.
- `content/public/`
  - Static files copied as-is, such as `robots.txt`.

### Version Tags

Pages in `content/docs/` can declare compatible mod versions in frontmatter:

```yaml
modVersions:
  - 1.1.0a
  - 1.0.0
```

Generation rules:

1. Pages with `modVersions` are emitted to every matching mod version route.
2. If a matching version is the current release, the page is emitted at the site root route.
3. If a matching version is archived, the page is emitted under `/versions/<version>/`.
4. Pages without `modVersions` are treated as fixed site pages and emitted once.

The generated `docs/` directory should still be treated as build output, not as the primary authoring source.

## Routing Convention

- Current docs: `/`
- Archived docs: `/versions/<version>/`

The current release lives at the locale root. Archived releases should only get their own pages when content actually differs.

## Key Files

- `memory.md`
  - Project memory and workflow constraints.
- `docs.config.mjs`
  - Shared version metadata and site routing helpers.
- `.vitepress/config.ts`
  - VitePress config, nav, sidebar, and route-aware UI setup.
- `scripts/prepare-docs.mjs`
  - Content preparation script for tag-driven multi-version docs.

## SEO Support

The site now includes a baseline SEO setup:

- `sitemap.xml` generation through VitePress `sitemap`
- `robots.txt` in `content/public/`
- automatic canonical URLs
- alternate `hreflang` links for the Chinese site
- default Open Graph and Twitter meta tags
- page-level `description`, `keywords`, `tags`, and `robots` frontmatter support

Archived version pages are prepared to default to `noindex,follow` so old versions do not compete with the current release in search results.

The current SEO hostname/base assume GitHub Pages project-site deployment at `https://muyutwilighter.github.io/croparia-if-docs/`.

## Adding A New Archived Version

1. Add the version metadata in `docs.config.mjs`.
2. Update page `modVersions` values under `content/docs/` for docs that should include the new version.
3. Only create separate pages when wording or behavior truly diverges across versions.
4. Run `npm.cmd run docs:build` to verify routing and content generation.

## Assets

- If assets are needed from the mod repository or the old docs backup, copy them into this repository before referencing them.
- Do not hotlink or directly reference files from outside this repository in site source.

## Git Workflow

- Keep commits atomic.
- Do not mix unrelated dirty worktree changes into a commit.
- By project convention, completed modifications are typically committed unless explicitly requested otherwise.
