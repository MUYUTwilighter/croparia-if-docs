---
title: Content Version Tags
outline: deep
modVersions:
  - 1.1.0a
---

# Content Version Tags

This is the current multi-version maintenance model for the repository.

## Rules

- author docs directly in `content/docs/`
- use frontmatter `modVersions` to declare compatible releases
- pages without `modVersions` are treated as fixed site pages and generated once

## Example

```yaml
---
title: Example Page
modVersions:
  - 1.1.0a
  - 1.0.0
---
```

That means the page is compatible with `1.1.0a` and `1.0.0`. During generation:

- if `1.1.0a` is the current release, the page is emitted at the current route
- if `1.0.0` is archived, the page is emitted under `/versions/1.0.0/...`

## Maintenance Guidance

- put most stable pages on multiple versions
- split truly changed pages only when needed
- leave fixed pages such as version policy without `modVersions`
