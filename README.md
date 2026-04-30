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
npm run docs:dev
npm run docs:build
npm run docs:preview
npm run docs:publish -- <deploy-dir>
npm run docs:publish:ssh
```

Notes:

- `docs/` is now the direct authoring source for Markdown pages and static assets.
- `docs:dev` starts the local VitePress development server directly.
- `docs:build` and `docs:preview` use `docs/` directly, without a preparation step.
- `docs:publish` builds VitePress, then mirrors `.vitepress/dist` into the deploy directory you pass in.
- `docs:publish:ssh` builds VitePress, uploads `.vitepress/dist` to a remote server through SSH, then replaces the remote target directory.
- On this machine, `npm.cmd` may be needed instead of `npm` in PowerShell.

PowerShell example:

```powershell
npm.cmd run docs:publish -- "D:\sites\croparia-if-docs"
```

You can also set `DOCS_DEPLOY_DIR` and run `npm run docs:publish`.
By default the publish script refuses to sync into a directory inside this repository, to avoid wiping local source files by mistake.

Both publish scripts now load environment variables from `.env` / `.env.local` through `dotenv`.
You can start from [.env.example](D:/Documents/WebStormProjects/croparia-if-docs/.env.example) and create your own local `.env`.

SSH publish example:

```powershell
$env:DOCS_SSH_HOST="example.com"
$env:DOCS_SSH_USER="deploy"
$env:DOCS_SSH_TARGET_DIR="/var/www/croparia-if-docs"
$env:DOCS_SSH_PORT="22"
$env:DOCS_SSH_KEY="C:\Users\you\.ssh\id_ed25519"
npm.cmd run docs:publish:ssh
```

SSH publish notes:

- Required variables: `DOCS_SSH_HOST`, `DOCS_SSH_USER`, `DOCS_SSH_TARGET_DIR`
- Optional variables: `DOCS_SSH_PORT`, `DOCS_SSH_KEY`
- Set `DOCS_SSH_KEEP_BACKUP=1` if you want the previous remote directory kept as `<target>.codex-backup`
- The current script assumes the remote server provides a POSIX shell with `sh`, `mkdir`, `mv`, and `rm`

## Content Model

This site now uses a direct authoring model:

- `docs/`
  - Primary VitePress source for Markdown pages.
- `docs/public/`
  - Static files served by VitePress, such as `robots.txt`, images, and data assets.

There is no extra generation layer between authored Markdown and the VitePress source tree.
When a new mod version needs different docs, archive or copy the affected pages manually under the versioned routes.

## Routing Convention

- Current docs: `/`
- Archived docs: `/versions/<version>/`

The current release lives at the locale root. Archived releases should only get their own pages when content actually differs.

Version switch behavior:

- The header version selector prefers `/versions/<version>/<same-path>` when that archived page exists.
- If the archived version does not provide a dedicated page for the current path, the site falls back to the main page under `/`.
- Shared pages are therefore authored once in `docs/`, while version-specific overrides live under `docs/versions/<version>/`.
- Sidebars now follow the version metadata. By default a version inherits the main sidebar profile, but a version can opt into its own sidebar profile when its page topology diverges.

## Key Files

- `memory.md`
  - Project memory and workflow constraints.
- `docs.config.mjs`
  - Shared version metadata and site routing helpers.
- `.vitepress/config.ts`
  - VitePress config, nav, sidebar, and route-aware UI setup.

## SEO Support

The site now includes a baseline SEO setup:

- `sitemap.xml` generation through VitePress `sitemap`
- `robots.txt` in `docs/public/`
- automatic canonical URLs
- alternate `hreflang` links for the Chinese site
- default Open Graph and Twitter meta tags
- page-level `description`, `keywords`, `tags`, and `robots` frontmatter support

Archived version pages are prepared to default to `noindex,follow` so old versions do not compete with the current release in search results.

The current SEO hostname/base assume GitHub Pages project-site deployment at `https://muyutwilighter.github.io/croparia-if-docs/`.

## Adding A New Archived Version

1. Add the version metadata in `docs.config.mjs`.
2. Create `docs/versions/<version>/` and add only the pages that differ from the main docs tree.
3. Keep the same relative path as the main page you are overriding. For example, override `docs/player/index.md` with `docs/versions/<version>/player/index.md`.
4. If a page is not created under `docs/versions/<version>/`, that version will fall back to the main page content at the same route.
5. If that version needs a different sidebar topology, set `sidebarKey` in `docs.config.mjs` and add the corresponding sidebar profile in `.vitepress/config.ts`.
6. Only create separate pages when wording, behavior, or information architecture truly diverges across versions.
7. Run `npm.cmd run docs:build` to verify routing and content generation.

## Assets

- If assets are needed from the mod repository or the old docs backup, copy them into this repository before referencing them.
- Do not hotlink or directly reference files from outside this repository in site source.

## Git Workflow

- Keep commits atomic.
- Do not mix unrelated dirty worktree changes into a commit.
- By project convention, completed modifications are typically committed unless explicitly requested otherwise.
