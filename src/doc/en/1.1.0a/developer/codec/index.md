---
title: Codec API
desc: Overview of the Codec API for Croparia IF downstream developers, focusing on how to understand and use MultiCodec, MultiFieldCodec, TestedCodec, and CodecUtil.
keywords:
  - Croparia IF
  - Codec API
  - CodecUtil
  - MultiCodec
  - MultiFieldCodec
  - OptionalMultiFieldCodec
  - TestedCodec
  - MapCodec
  - RecordCodecBuilder
  - developer docs
modVersions:
  - 1.1.0a
navOrder: 50
---

# Codec API

<a id="overview"></a>

The Codec API is Croparia IF's set of extensions around Mojang's `Codec` system. Its goal is not to replace `Codec`, `MapCodec`, or `RecordCodecBuilder`, but to smooth out a few pain points that appear often in real-world data modeling:

- one type needs to support multiple serialized forms
- one field needs to accept multiple key names
- a branch should be filtered by structure before the real codec runs
- a subclass wants to reuse a parent `MapCodec` and only append a few fields

If you already know vanilla codecs, this API is best read as "a small set of high-frequency upgrades centered around `CodecUtil`."

<a id="when-to-use"></a>

## When to use the Codec API

Typical cases where Croparia IF's Codec API is worth using:

- you want one value to support both a single-item form and a list form
- you want to keep old and new field names compatible at the same time
- you want to reject clearly mismatched input structures before entering the real codec
- you already have a parent `MapCodec` and want to extend it in a subclass without rewriting the whole `RecordCodecBuilder`

If your case is just regular object encoding and decoding, vanilla `RecordCodecBuilder.mapCodec(...)` is usually enough. There is no need to force these helpers in only for style consistency.

<a id="mental-model"></a>

## Mental model

It helps to remember the API like this:

- `TestedCodec`
  - adds a pre-check to one codec branch
- `MultiCodec`
  - chains multiple codecs and tries them in order
- `MultiFieldCodec`
  - lets one field accept multiple key names
- `OptionalMultiFieldCodec`
  - similar to `MultiFieldCodec`, but the whole field may be absent
- `CodecUtil.extend(...)`
  - appends fields on top of an existing `MapCodec`
- `CodecUtil.listOf(...)`
  - lets one value accept either a single entry or a list

In plainer words:

- `TestedCodec` answers "when should this codec branch even be tried?"
- `MultiCodec` answers "if there are multiple branches, which one goes first?"
- `MultiFieldCodec` answers "what if this field used more than one key name?"
- `CodecUtil.extend(...)` answers "how do I reuse the parent codec instead of rewriting it?"

<a id="navigation"></a>

## Navigation

- [TestedCodec: pre-checks](tested-codec.md#overview)
- [MultiCodec: multiple formats](multi-codec.md#overview)
- [MultiFieldCodec: multiple key names](multi-field-codec.md#overview)
- [Other helpers](other.md#overview)

