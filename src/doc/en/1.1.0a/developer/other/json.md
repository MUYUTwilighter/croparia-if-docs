---
title: JSON Transformation
desc: Explains Croparia IF's JsonTransformer and how it converts formats such as json, toml, and cdg into JsonElement for later Codec-based reading.
keywords:
  - Croparia IF
  - JsonTransformer
  - JSON
  - TOML
  - CDG
  - JsonElement
  - developer docs
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 20
---

# JSON Transformation

<a id="overview"></a>

`JsonTransformer` lives under `api.json`, and its job is very direct: convert several text-based config formats into one unified `JsonElement`.

The point of that layer is:

- upper systems can keep using a uniform `Codec` / `JsonElement` pipeline
- file-format differences stay at the file-reading boundary instead of leaking into business logic

The formats supported by default in the current code are:

- `json`
- `toml`
- `cdg`

<a id="mental-model"></a>

## Mental model

The easiest way to understand `JsonTransformer` is to treat it as "a text preprocessor layer before Codec."

It does **not** handle:

- business-level structural validation
- object deserialization
- registry resolution

It handles exactly one thing:

- convert one text format into `JsonElement`

That is why the runtime data generation system can read `.json`, `.toml`, and `.cdg` files while still keeping the later decoding path unified.

<a id="workflow"></a>

## Workflow

The workflow is intentionally simple:

1. choose a transformer from the file suffix
2. convert the raw text into `JsonElement`
3. hand the result to codec logic or other business code

In the source, this format-to-transformer mapping is stored in `JsonTransformer.TRANSFORMERS`.

<a id="formats"></a>

## Why this layer is useful

Its main value is clean boundaries:

- file-format detection stays concentrated at the input layer
- upper systems only have to work with `JsonElement`

Without `JsonTransformer`, upper systems usually fall into one of two patterns:

- every feature module starts checking `.json / .toml / .cdg` on its own
- codecs get forced to carry responsibilities that really belong to text-format conversion

Croparia IF's design here is:

- normalize text into `JsonElement` first
- then let everything after that flow as JSON-shaped data

That keeps systems like:

- [Runtime Data Generation](../generator/index.md#overview)
- [Codec API](../codec/index.md#overview)

much cleaner internally.

<a id="when-to-use"></a>

## When to reuse this pattern

If the system you are building:

- needs to support multiple text config formats
- eventually feeds all of them into one codec pipeline
- benefits from separating "read the file" from "decode the object"

then `JsonTransformer` is a strong reference design.

If the system only supports plain JSON, or never needs `JsonElement` at all, then adding a separate transform layer just for consistency is probably unnecessary.

<a id="tips"></a>

## Tips

- When your higher-level logic already revolves around `JsonElement` or `Codec`, it is usually cleaner to normalize formats first through something like `JsonTransformer`.
- If you need one more text format later, add it at the transformer layer first instead of editing several business modules.
- `JsonTransformer` works best as "text to JSON structure." It should not become the place where object-level semantics are validated.

