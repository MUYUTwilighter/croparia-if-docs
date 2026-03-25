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
- The git history of this repository includes an older Docusaurus-based docs frontend that was later abandoned because multilingual and multi-version maintenance was too costly.
- Reusable art assets from the abandoned Docusaurus site were backed up at `D:\Documents\WebStormProjects\croparia-if-docs-old`.

## Mod Version And Source Of Truth

- When reading the mod project, always check `D:\Documents\JavaProjects\croparia-if\gradle.properties` first for the relevant mod and platform version information.
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

As of 2026-03-25, this docs repo itself is using VitePress `^1.6.4` in `package.json`.

## Current Repo Snapshot

- The current docs site is a VitePress project with config at `.vitepress/config.ts`.
- The repository has completed the baseline upgrade for multilingual and multiversion docs.
- Locale routing currently uses:
  - Simplified Chinese at `/`
  - English at `/en/`
- Version routing currently uses:
  - Chinese archives at `/versions/<version>/`
  - English archives at `/en/versions/<version>/`
- The content model now uses generated source input instead of editing VitePress pages directly as the primary source.
- Authoritative content directories are:
  - `content/versioned/base/<locale>/` for shared versioned pages
  - `content/versioned/releases/<version>/<locale>/` for release-specific overrides
  - `content/global/<locale>/` for non-versioned fixed-route pages
- `scripts/prepare-docs.mjs` prepares content into `.generated/`, and VitePress reads from `.generated/` via `srcDir`.
- `.generated/` is build input generated from source content, not the long-term hand-edited source of truth.
- Shared version metadata is maintained in `docs.config.mjs`.
- README now contains maintenance guidance for the generated content model and routing conventions.
- The current recorded release in the docs stack is Croparia IF `1.1.0a` on Minecraft `1.21.1`.
- The workspace may contain large migration changes that remove the abandoned Docusaurus site from version control. Treat those deletions as intentional cleanup when the user asks to commit them.
- The backup copy at `D:\Documents\WebStormProjects\croparia-if-docs-old` is the safer place to recover old art or wording without reintroducing the old stack into this repo.
