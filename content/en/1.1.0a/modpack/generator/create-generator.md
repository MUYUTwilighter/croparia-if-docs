---
title: Create a Data Generator
desc: Introduces where to place data generator files, their core fields, generator types, and a minimal example in the Croparia IF 1.1.0a Runtime Data Generation System.
keywords:
  - Croparia IF
  - 1.1.0a
  - modpack
  - Runtime Data Generation System
  - data generator
  - TOML
  - CDG
  - JSON
  - placeholder
  - template
navOrder: 10
---

# Create a Data Generator

This page only answers one question: how to write a working data generator file. For the overall concepts, see the [Runtime Data Generation System](index.md). For field value syntax, see [Placeholder Parsers](placeholder.md).

<a id="file-format"></a>

## Where It Goes

Generator files belong in the `generator/` directory of the corresponding handler, not directly inside `assets/` or `data/`:

- Datapack: `[game directory]/croparia/datapack/generator/`
- Resource pack: `[game directory]/croparia/resourcepack/generator/`

The generated [outputs](index.md#pack-handler) will then be written to:

- Datapack: `[game directory]/croparia/datapack/data/`
- Resource pack: `[game directory]/croparia/resourcepack/assets/`

Supported formats:

- `toml`
- `cdg`
- `json`

`toml` is the recommended default.

<a id="minimal-example"></a>

## Minimal Example

```toml
registry = "croparia:crops"
path = "example/recipes/${id.path}.json"
template = """
{
  "type": "minecraft:crafting_shapeless",
  "ingredients": [
    { "item": "${fruit}" }
  ],
  "result": {
    "id": "${seed}",
    "count": 1
  }
}
"""
```

This means:

- iterate over `croparia:crops`
- calculate `path` once for each entry
- fill `template` with the current entry
- generate multiple independent files

<a id="common-fields"></a>

## Core Fields

- `registry`: which [generation entry set](index.md#entry-registry) should be iterated
  - common values:
    - `croparia:crops`
    - `croparia:melons`
    - `croparia:elements`
- `path`: relative output path; this field is itself a [template](index.md#template)
  - example:

```toml
path = "${id.namespace}/models/item/${seed.path}.json"
```

- `template`: the final file content to write; this is also a template string
  - example:

```toml
template = """
{
  "parent": "croparia:item/template_seed"
}
"""
```

- `type`: generator type
  - available values:
    - [`croparia:generator`](#type-generator) (default)
    - [`croparia:aggregated`](#type-aggregated)
    - [`croparia:lang`](#type-lang)

- `startup`: whether this generator should participate before the server is fully started

- `enabled`: whether the generator is enabled; useful for temporarily disabling a file without deleting it
  - example:

```toml
enabled = false
```

- `whitelist`
  - purpose: only generate for specific entries instead of traversing the whole `registry`
  - common use cases: debugging, partial overrides
  - example:

```toml
whitelist = ["croparia:coal", "croparia:iron"]
```

<a id="generator-types"></a>

## Generator Types

<a id="type-generator"></a>

### Standard Generator `croparia:generator`

The default type. One entry usually produces one file; if multiple entries resolve to the same target path, the later write overrides the earlier one.

Good for:

- recipes
- models
- loot tables
- blockstates

```toml
registry = "croparia:crops"
startup = true
path = "${id.namespace}/models/item/${seed.path}.json"
template = """
{
  "parent": "croparia:item/template_seed"
}
"""
```

<a id="type-aggregated"></a>

### Aggregated Generator `croparia:aggregated`

Each entry first produces a piece of `content`, then all pieces are merged into one shared `template`. This is a good fit for files like tags, where many entries must be combined into one result.

Extra field:

- `content`

```toml
registry = "croparia:crops"
type = "croparia:aggregated"
startup = true
path = "croparia/tags/item/seeds/crops.json"
content = '    "${seed}"'
template = """
{
  "replace": false,
  "values": [
${content}
  ]
}
"""
```

<a id="type-lang"></a>

### Language Generator `croparia:lang`

This type is designed for translatable entries. It splits output by language and injects the `_lang` placeholder for use inside templates.

Good for:

- language files

```toml
registry = "croparia:crops"
type = "croparia:lang"
startup = true
path = "${id.namespace}/lang/${lang}.json"
template = '"${translation_key}": "${translations.get(_lang)}"'
```

For language-related fields, see [Placeholder Parsers](placeholder.md#translatable-entry).
