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
- Locale routing currently uses:
  - Simplified Chinese at `/`
  - English at `/en/`
- Version routing currently uses:
  - Chinese archives at `/versions/<version>/`
  - English archives at `/en/versions/<version>/`
- The authoritative hand-written content source is now `content/docs/`.
- Static public files live in `content/public/` and are copied into the generated docs root.
- `scripts/prepare-docs.mjs` now prepares content into `docs/`, and VitePress reads from `docs/` via `srcDir`.
- `docs/` is generated build input, not the long-term hand-edited source of truth.
- Multi-version distribution no longer uses `content/versioned/base` plus `content/versioned/releases` overlay directories.
- Version compatibility is now declared per page with frontmatter `modVersions`, and `scripts/prepare-docs.mjs` distributes pages to current or archived routes automatically.
- Pages with `modVersions` matching the current release emit to locale root routes.
- Pages with `modVersions` matching archived releases emit under `/versions/<version>/` or `/en/versions/<version>/`.
- Pages without `modVersions` are treated as fixed site pages and emitted once.
- Shared version metadata is maintained in `docs.config.mjs`.
- README now contains maintenance guidance for the generated content model and routing conventions.
- The SEO baseline remains in place, including sitemap, robots, canonical URLs, alternate `hreflang`, and default social metadata support.
- Avoid reintroducing imported/local symbol collisions in `.vitepress/config.ts`, especially around helpers such as `guideRoot`.
- The current recorded release in the docs stack is Croparia IF `1.1.0a` on Minecraft `1.21.1`.
- The backup copy at `D:\Documents\WebStormProjects\croparia-if-docs-old` is the safer place to recover old art or wording without reintroducing the old stack into this repo.
