---
title: I18n and Versioning
outline: deep
modVersions:
  - 1.1.0a
---

# I18n and Versioning

## Internationalization

VitePress handles locale switching natively. The site currently enables:

- `root`: Simplified Chinese
- `en`: English

## Versioning

Versioned docs use route conventions plus page-tag generation:

- current Chinese: `/`
- current English: `/en/`
- archived Chinese: `/versions/<version>/`
- archived English: `/en/versions/<version>/`

## Version Tags

Pages can declare compatible releases in frontmatter:

```yaml
modVersions:
  - 1.1.0a
  - 1.0.0
```

The prepare script publishes that page into the matching version routes automatically.
