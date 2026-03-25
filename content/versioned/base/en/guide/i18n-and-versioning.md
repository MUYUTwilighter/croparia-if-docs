---
title: I18n and Versioning
outline: deep
---

# I18n and Versioning

## Internationalization

VitePress handles locale switching natively. The site currently enables:

- `root`: Simplified Chinese
- `en`: English

## Versioning

Versioned docs use route conventions plus a generation step:

- current Chinese: `/`
- current English: `/en/`
- archived Chinese: `/versions/<version>/`
- archived English: `/en/versions/<version>/`

## Duplicate Content Handling

Repeated docs are not maintained by copying folders by hand:

- shared content lives in `content/versioned/base/`
- version differences live in `content/versioned/releases/<version>/`

That keeps most unchanged pages single-sourced.
