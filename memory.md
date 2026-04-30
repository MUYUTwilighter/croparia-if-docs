# Croparia IF Docs Project Memory

This repository is the VitePress front-end documentation site for the Croparia IF Minecraft mod.

## Startup Checklist For Every Future Conversation

1. Check whether this memory has changed before doing other substantial work.
2. Use git-based checks such as `git log --oneline -- memory.md` and `git diff -- memory.md` from this repository.
3. If the memory file has been updated since the last known state, explicitly tell the user in the conversation that the project memory has changed and that you are following the newer version.

## Repository Scope

- This repository is the docs site agent workspace. Treat it as the only writable project unless the user explicitly says otherwise.
- The main mod project lives at `D:\Documents\JavaProjects\croparia-if`.
- The mod project is built with Architectury Loom and targets Fabric plus NeoForge or Forge-family loaders.
- The mod project is read-only from the docs agent perspective. Never modify files in `D:\Documents\JavaProjects\croparia-if`.
- Legacy reusable art assets may be available at `D:\Documents\WebStormProjects\croparia-if-docs-old`.

## Mod Version And Source Of Truth

- When reading the mod project, always check `D:\Documents\JavaProjects\croparia-if\gradle.properties` first for the relevant mod and platform version information.
- Documentation versioning should primarily track Croparia IF mod versions, not Minecraft versions.
- By default, assume the same Croparia IF mod version behaves the same across different supported Minecraft versions unless the user explicitly indicates a version-specific behavior difference.
- Do not assume Minecraft version, loader version, or mod version from old docs text.
- When docs content depends on behavior that may vary by version, record the exact version used in the docs or commit message.
- The mod repository currently reports `mod_version=1.1.1a-dev` and `minecraft_version=1.21.1`.

## Asset And Resource Rules

- If docs need assets from the mod project, copy them into this docs repository before referencing them.
- If docs need legacy art that no longer exists in the current repo, check `D:\Documents\WebStormProjects\croparia-if-docs-old` first.
- Never hotlink or directly reference files from the mod repository in site source.
- Never reference assets directly from `D:\Documents\WebStormProjects\croparia-if-docs-old` in site source. Copy them into this docs repository before use.
- Prefer storing reused static assets in a stable docs-side location such as `.vitepress/public/` with clear subfolders.
- If imported assets are large, use local tools such as `cwebp` and `ffmpeg` to compress them before committing.
- Keep source-to-doc asset mapping easy to trace in commit messages or nearby docs notes.

## Working Conventions

- Default to reusable implementations. If logic, rendering, or content transformation may repeat, extract a util, helper, component, or shared content structure instead of duplicating it.
- When adding reusable code for this site, keep the abstraction inside the docs repo, not the mod repo.
- Favor conventions that work well with VitePress: Markdown-first content, shared Vue components only where they materially reduce duplication, and small focused utilities.

## Git Workflow Expectations

- Unless the user explicitly says not to, automatically commit local changes after completing a requested modification.
- If a task is large, split it into multiple atomic commits.
- Never mix unrelated dirty-worktree changes into a commit. Commit only the files touched for the current task.
- Before committing, inspect the worktree carefully because this repository may already contain unrelated user edits or migration leftovers.

## External Documentation To Prefer

Use official documentation as the primary reference when architecture or framework behavior is unclear:

- VitePress: <https://vitepress.dev/>
- Architectury docs, including API, Loom, and Plugin: <https://docs.architectury.dev/>
- NeoForge docs: <https://docs.neoforged.net/>
- Fabric docs: <https://docs.fabricmc.net/>

This docs repo currently uses VitePress `^1.6.4` in `package.json`.

## Current Architecture

- The current docs site is a VitePress project with config at `.vitepress/config.ts`.
- The authored docs source is `docs/`.
- Static public files live in `docs/public/`.
- There is no `content/` authoring tree and no prepare-docs generation chain in active use.
- `srcDir` points directly to `docs`, so Markdown pages and static assets are edited in place.
- The site currently serves a Simplified Chinese primary docs tree at `/`.
- Archived docs use manual overrides under `docs/versions/<version>/`.
- The main `docs/` tree is the fallback source of truth for all versions unless an archived page overrides the same relative path.
- When documenting a new version, create files under `docs/versions/<version>/` only for pages whose wording, behavior, or information architecture truly differs from the main docs tree.
- Version switching prefers the archived page at the same relative path when it exists.
- If an archived version does not provide a page for the current route, the version switcher falls back to the main page under `/`.
- Shared version metadata is maintained in `docs.config.mjs`.
- Version metadata can declare a `sidebarKey`, allowing a version to use an independent sidebar profile when its topology diverges from the main line.
- Sidebar profiles are resolved in `.vitepress/config.ts`; by default versions use the `default` sidebar profile unless `sidebarKey` says otherwise.
- README contains the current maintenance guidance for direct authoring, archive overrides, publishing, and routing conventions.
- The SEO baseline remains in place, including sitemap, robots, canonical URLs, alternate `hreflang`, and default social metadata support.
- Avoid reintroducing imported/local symbol collisions in `.vitepress/config.ts`.
- `docs.config.mjs` currently declares `currentVersion.slug` as `1.1.1a`.
- The backup copy at `D:\Documents\WebStormProjects\croparia-if-docs-old` is the safer place to recover old art or wording without reintroducing the old stack into this repo.
