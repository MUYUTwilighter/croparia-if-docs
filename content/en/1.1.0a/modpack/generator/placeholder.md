---
title: Placeholder Parsers
desc: Introduces Placeholder syntax, type operations, and the available fields of common generation entries such as crops, melons, and elements in the Croparia IF Runtime Data Generation System.
keywords:
  - Croparia IF
  - 1.1.0a
  - modpack
  - Runtime Data Generation System
  - Placeholder
  - placeholder parser
  - template
  - data generator
  - crop
  - melon
  - element
navOrder: 20
---

# Placeholder Parsers (Placeholder)

The placeholder parser is the interface through which a [Template](index.md#template) actually reads data. Expressions like `${...}` inside templates are handed to the matching `Placeholder` at runtime, then replaced with the final text or JSON fragment.

For modpack authors, the easiest way to think about it is:

- `Template` decides what the file looks like.
- `Placeholder` decides which values the template can read and how those values can be accessed further.

If you have not yet read the overview of the runtime data generation system, it is best to start with the [Runtime Data Generation System](index.md). If you want to see where these expressions are ultimately written, continue with [Create a Data Generator](create-generator.md).

<a id="syntax"></a>

## Basic Syntax

The most basic placeholder forms look like this:

```text
${field}
${field.subfield}
${field.get(key)}
${field.get(0)}
```

For example:

```txt
{
  "item": "${fruit}",
  "tier": ${tier},
  "translation_key": ${translation_key._qis}
}
```

Two points matter here:

- Placeholders are always written inside `${...}`.
- The dot `.` means either “continue into a subfield” or “call a built-in query method”.

<a id="quote"></a>

## Strings and Quotes

Values returned by `Placeholder` are fundamentally JSON values. If the result itself is a string, you need to be careful about quoting when embedding it into a JSON string literal.

Common forms:

- `${name}`: output the raw value directly
- `${name._qis}`: if the result is a string, add double quotes automatically
- `${name._q}`: force the result into a double-quoted string whether it is already a string or not

Recommended rule of thumb:

- If you already wrote the JSON quotes yourself in the template, use `${name}`
- If you want the placeholder to decide whether quotes are needed, use `${name._qis}`

Example:

```txt
{
  "raw_name": "${name}",
  "safe_name": ${name._qis}
}
```

<a id="basic-types"></a>

## Primitive Types

<a id="string"></a>

### String `string`

Strings can be output directly, or combined with `_qis` and `_q`.

```text
${id}
${id.namespace}
${id.path}
${type._qis}
```

<a id="number"></a>

### Number `number`

Numbers are usually embedded directly into JSON:

```text
${tier}
${color.dec}
```

<a id="boolean"></a>

### Boolean `boolean`

The source code supports boolean placeholders, but the common generation entries currently expose very few booleans directly. If an entry does provide one, it can be used the same way as a number.

<a id="compound-types"></a>

## Composite Types

The most practical strength of `Placeholder` is handling lists and maps.

<a id="list"></a>

### List `T[]`

Lists support the following operations:

- `_size`: get the length
- `get(n)`: get one value by index
- `getOr(n, fallback)`: get one value by index, or return a fallback when the index is out of bounds
- `map(expr)`: convert entries that can successfully resolve `expr` into a JSON object keyed by index
- `mapi(expr)`: filter entries that can successfully resolve `expr`, returning a map keyed by index while keeping the original objects as values

Example:

```text
${translations.keys()._size}
${translations.keys().get(0)}
${translations.keys().getOr(0, en_us)}
```

<a id="map"></a>

### Map `Map<String, T>`

Maps support the following operations:

- `_size`: get the number of key-value pairs
- `get(key)`: get one value by key
- `getOr(key, fallback)`: get one value by key, or return a fallback if the key is missing
- `keys()`: return the list of keys
- `values()`: return the list of values
- `mapValue(expr)`: keep only values that can successfully resolve `expr`
- `mapKey(expr)`: remap keys using a value resolved from each entry

Example:

```text
${translations.get(en_us)}
${translations.getOr(zh_cn, untranslated)}
${translations.keys().get(0)}
```

<a id="builtin-types"></a>

## Common Built-in Types

The following types appear in many entries.

<a id="id"></a>

### `id`

The resource-location type supports:

- `${id}`: full ID
- `${id.namespace}`: namespace
- `${id.path}`: path

Example:

```text
${fruit}
${fruit.namespace}
${fruit.path}
```

<a id="color"></a>

### `color`

The color type supports:

- `${color}`: standard color string such as `#00FFAA`
- `${color.hex}`: hexadecimal value without the prefix
- `${color.dec}`: decimal integer

<a id="material"></a>

### `material`

`Material` and its subclasses support:

- `${material.type}`: `item` or `tag`
- `${material.name}`: raw name, keeping `#` for tags
- `${material.count}`: amount
- `${material.id}`: ID with the leading `#` removed

For `ItemMaterial`, the following are also available:

- `${material.result}`: read it as a recipe output entry
- `${material.components}`: component patch

<a id="common-entries"></a>

## Available Fields of Common Generation Entries

The fields below come from the `Placeholder` definitions in the current `1.1.0a` source code. They are suitable for direct use in modpack documentation. Each one corresponds to a [generation entry](index.md#entry) and a [generation entry set](index.md#entry-registry) inside the Runtime Data Generation System.

<a id="crops"></a>

### Fruit Crops `croparia:crops`

Fruit crop entries are implemented by `Crop`, and also inherit the shared fields from [Translatable Entries](#translatable-entry).

Core fields you can use directly:

- `${id}`
- `${color}`
- `${color.hex}`
- `${type}`
- `${material}`
- `${material.name}`
- `${material.result}`
- `${tier}`
- `${seed}`
- `${fruit}`
- `${crop_block}`
- `${croparia}`
- `${translation_key}`
- `${translations}`
- `${translations.get(en_us)}`

Example:

```toml
path = "data/example/recipe/${id.path}.json"
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

If you are writing generators for custom fruit crops, this page pairs well with [Create a Data Generator](create-generator.md).

<a id="melons"></a>

### Melon Crops `croparia:melons`

Melon crop entries are implemented by `Melon`.

Core fields you can use directly:

- `${id}`
- `${color}`
- `${color.hex}`
- `${tier}`
- `${croparia}`
- `${material}`
- `${material.name}`
- `${melon}`
- `${stem}`
- `${attach}`
- `${seed}`
- `${translation_key}`
- `${translations}`

Example:

```toml
path = "assets/example/models/item/${seed.path}.json"
template = """
{
  "parent": "minecraft:item/generated",
  "textures": {
    "layer0": "${seed.namespace}:item/${seed.path}"
  }
}
"""
```

<a id="elements"></a>

### Elements `croparia:elements`

Element entries are implemented by `Element`.

Core fields you can use directly:

- `${id}`
- `${name}`
- `${color}`
- `${color.hex}`
- `${fluid_source}`
- `${fluid_flowing}`
- `${liquid_block}`
- `${bucket}`
- `${potion}`
- `${gem}`

Example:

```toml
path = "data/example/tags/items/${name}.json"
template = """
{
  "replace": false,
  "values": [
    "${gem}",
    "${potion}",
    "${bucket}"
  ]
}
"""
```

<a id="translatable-entry"></a>

## Shared Fields of Translatable Entries

Both `Crop` and `Melon` inherit from `TranslatableEntry`, so both support:

- `${translation_key}`
- `${translations}`
- `${translations.get(en_us)}`
- `${translations.keys()}`
- `${translations.values()}`

These fields are most commonly used by language-file generators.

For example:

```toml
template = '"${translation_key}": "${translations.get(_lang)}"'
```

This kind of pattern is especially useful together with the [language generator](create-generator.md#type-lang).

<a id="tips"></a>

## Recommendations

- Determine the current entry type first, then check which fields it exposes. Do not assume that different entry types share the same field names.
- When building file paths, prefer subfields such as `${id.path}`, `${seed.path}`, and `${fruit.path}`.
- The most common mistake in JSON templates is quoting string values. When in doubt, prefer `${...._qis}`.
- If your template logic is already relying on lots of `get()`, `map()`, `keys()`, and similar combinations, that usually means the entry structure should be refactored before adding more template tricks.
