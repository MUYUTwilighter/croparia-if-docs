# Croparia IF Docs Project Memory

This repository is the Next.js documentation frontend for the Croparia IF Minecraft mod.

## Startup Checklist For Every Future Conversation

1. Check whether this memory has changed before doing other substantial work.
2. Use git-based checks such as `git log --oneline -- memory.md` and `git diff -- memory.md` from this repository.
3. If the memory file has been updated since the last known state, explicitly tell the user in the conversation that the project memory has changed and that you are following the newer version.

## Repository Scope

- This repository is the docs site agent workspace. Treat it as the only writable project unless the user explicitly says otherwise.
- The main mod project lives at `D:\Documents\JavaProjects\croparia-if`.
- The mod project is built with Architectury Loom and targets Fabric plus NeoForge or Forge-family loaders.
- The mod project is read-only from the docs agent perspective. Never modify files in `D:\Documents\JavaProjects\croparia-if`.
- Legacy reusable art assets may be available at `D:\Documents\WebStormProjects\croparia-if-docs-docusaurus` and `D:\Documents\WebStormProjects\croparia-if-docs-vp`.

## Mod Version And Source Of Truth

- When reading the mod project, always check `D:\Documents\JavaProjects\croparia-if\gradle.properties` first for the relevant mod and platform version information.
- Documentation versioning should primarily track Croparia IF mod versions, not Minecraft versions.
- By default, assume the same Croparia IF mod version behaves the same across different supported Minecraft versions unless the user explicitly indicates a version-specific behavior difference.
- Do not assume Minecraft version, loader version, or mod version from old docs text.
- When docs content depends on behavior that may vary by version, record the exact version used in the docs or commit message.

## Asset And Resource Rules

- If docs need assets from the mod project or legacy docs projects, copy them into this docs repository before referencing them.
- Never hotlink or directly reference files from the mod repository or legacy docs repositories in site source.
- Prefer storing reused static assets in `public/`, with stable subfolders such as `public/assets/` and `public/data/`.
- Do not reintroduce content-era asset assumptions such as `content/public/`; the active app-level static asset root is `public/`.
- If imported assets are large, use local tools such as `cwebp` and `ffmpeg` to compress them before committing.
- Keep source-to-doc asset mapping easy to trace in commit messages or nearby docs notes.

## Working Conventions

- Default to reusable implementations. If logic, rendering, or content transformation may repeat, extract a util, parser helper, React component, shared provider, or hook instead of duplicating it.
- Keep domain logic pure whenever possible. Parsing, routing, navigation derivation, SEO derivation, visibility checks, and search indexing belong in `src/lib/docs/`.
- Keep UI consumption concerns in `src/components/docs/` and page route entrypoints in `app/`.
- Do not move docs-specific business logic into ad hoc page components when it can live in the shared docs libraries.
- The current architecture is parser-driven, not sidebar-config-driven and not “Markdown file maps directly to static site behavior without interpretation”.

## Git Workflow Expectations

- Unless the user explicitly says not to, automatically commit local changes after completing a requested modification.
- If a task is large, split it into multiple atomic commits.
- Never mix unrelated dirty-worktree changes into a commit. Commit only the files touched for the current task.
- Before committing, inspect the worktree carefully because this repository may already contain unrelated user edits or migration leftovers.

## External Documentation To Prefer

Use official documentation as the primary reference when architecture or framework behavior is unclear:

- Next.js: <https://nextjs.org/docs>
- React: <https://react.dev/>
- MDX: <https://mdxjs.com/docs/>
- Architectury docs, including API, Loom, and Plugin: <https://docs.architectury.dev/>
- NeoForge docs: <https://docs.neoforged.net/>
- Fabric docs: <https://docs.fabricmc.net/>

This docs repo currently uses Next.js `16.2.4`, React `19.2.4`, and MDX through `@next/mdx`.

## Current Architecture

- The docs frontend is a Next.js App Router project.
- Route entrypoints live under `app/`.
- The formal documentation space is normalized to `/doc/[locale]/[version]/[...slug]`.
- Short paths and compatibility entrypoints still exist, but they ultimately normalize to the full `/doc/...` document path model.
- Root-path special document pages are supported at `/`, `/<locale>`, `/[root-doc]`, and `/<locale>/[root-doc]`.
- Root-path special document pages render document content without a sidebar, but their canonical URL still points to the full `/doc/...` path.

## Content System

- `src/doc/` is the only document content source.
- Documents are organized as `src/doc/[locale]/[version]/...`.
- `src/doc/` is the source of truth; do not treat route files in `app/` as the authored docs source.
- The docs system is parser-driven. Page rendering depends on resolved content, metadata, navigation state, visibility state, and fallback state rather than direct filesystem-to-page assumptions.
- The active locale set currently includes `zh`, `en`, and `es`, with locale fallback configured in `src/lib/docs/config.ts`.

## Core Directories

- `app/` contains Next route entrypoints and route handlers.
- `src/doc/` contains authored documentation content by locale and version.
- `src/lib/docs/` contains pure docs infrastructure such as parsing, routing, navigation derivation, SEO logic, search logic, and content resolution.
- `src/components/docs/` contains the docs consumption layer, including shared components, context provider, and hooks.
- `public/` contains static assets for the Next app.

## Resolution And Fallback Rules

- `resolveDoc()` is the central document resolver.
- Resolution is version-first, then locale-fallback within that version, then inherited-version fallback.
- When a document is requested, preserve the requested version semantics as long as possible before falling back across version inheritance.
- Only return 404 after all applicable locale and version fallback paths are exhausted.
- Resolved page state includes requested and resolved locale, version, and slug, plus fallback trace, frontmatter, and visibility state.

## Navigation Model

- Header and sidebar are content-driven, derived automatically from `src/doc/` structure plus frontmatter.
- Navigation no longer depends on a hand-written sidebar tree.
- Top-level standalone docs that sit beside section directories may enter the header but do not enter the sidebar.
- Section index pages enter the header.
- Pages inside a section enter that section’s sidebar.
- When a section page is open, the sidebar should show only navigation for the current section.

## Frontmatter Rules

- Supported content-driving frontmatter keys are `title`, `desc`, `nonav`, `navOrder`, and `sitemap`.
- Other simple scalar frontmatter values should flow into metadata.
- Default behavior is:
  - `title`: first H1, otherwise `未知标题`
  - `desc`: first paragraph following the H1, otherwise empty
  - `nonav`: `false`
  - `navOrder`: `0`
  - `sitemap`: `true`

## SEO And Indexing

- Canonical URLs must be computed from the real resolved source page, not merely from the incoming request URL.
- Fallback pages should default to `noindex,follow` to avoid duplicate-content indexing problems.
- Sitemap entries should include only full document paths that satisfy visibility rules.
- Root-path special document pages may render content directly, but canonical URLs should still point to `/doc/...`.

## Search System

- Site search is implemented with a generated index plus an API route at `/api/search`.
- Search indexing should deduplicate by real source page, not create duplicate entries for fallback URLs.
- Search responses should expose both the current-context href and the canonical href of the real source page.

## Caching And Dev Mode

- Document scanning, frontmatter parsing, slug listing, `resolveDoc()`, and sidebar resolution are cached.
- MDX compilation results are cached.
- The earlier custom `contentSignal` hot-reload bridge is no longer part of the active architecture.
- `npm run dev` now maps directly to `next dev`.
- Doc changes under `src/doc/` should flow through Next's normal development detection and refresh chain.

## Testing

- The project uses Vitest-based tests aligned with the Next environment.
- Key test coverage areas include document fallback order, route normalization, navigation and visibility rules, canonical behavior, and search URL or parameter contracts.
- Primary test commands are `npm run test` and `npm run test:run`.

## Consumption Layer

- Low-level resolver and routing logic should remain pure functions, not be hookified prematurely.
- Page consumption should flow through provider plus hooks.
- The current docs consumption layer provides:
  - `DocProvider`
  - `useDocContext`
  - `useOptionalDocContext`
  - `useDocNavigation`
  - `useFallbackNotice`
  - `useDiscoveryState`
  - `useLocaleSwitcher`
  - `useVersionSwitcher`
  - `useDocSearch`
- New UI controls such as locale switchers, version switchers, fallback notices, header or sidebar UI, and search boxes should build on these hooks before inventing parallel state systems.
