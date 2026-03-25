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

## Mod Version And Source Of Truth

- When reading the mod project, always check `D:\Documents\JavaProjects\croparia-if\gradle.properties` first for the relevant mod and platform version information.
- Do not assume Minecraft version, loader version, or mod version from old docs text.
- When docs content depends on behavior that may vary by version, record the exact version used in the docs or commit message.

## Asset And Resource Rules

- If docs need assets from the mod project, copy them into this docs repository before referencing them.
- Never hotlink or directly reference files from the mod repository in site source.
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
- The workspace may contain large unrelated migration changes from an older docs stack. Avoid touching or reverting unrelated files unless the user asks.
