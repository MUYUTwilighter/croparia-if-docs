---
title: Other Helpers
desc: Overview of the most commonly used CodecUtil helpers outside of MultiCodec and MultiFieldCodec, including extend, listOf, toMap, JSON helpers, and StreamCodec conversion.
keywords:
  - Croparia IF
  - Codec API
  - CodecUtil
  - extend
  - listOf
  - toMap
  - encodeJson
  - decodeJson
  - StreamCodec
  - developer docs
modVersions:
  - 1.1.0a
navOrder: 40
---

# Other Helpers

<a id="overview"></a>

Besides [TestedCodec](tested-codec.md#overview), [MultiCodec](multi-codec.md#overview), and [MultiFieldCodec](multi-field-codec.md#overview), `CodecUtil` also contains a few helpers that are especially useful in day-to-day development.

This page focuses on the ones you are most likely to reach for first.

<a id="extend"></a>

## `CodecUtil.extend(...)`

This is one of the most characteristic helpers in Croparia IF's Codec API. Its purpose is very specific:

- you already have a parent `MapCodec`
- the child only wants to append a few fields
- you do not want to rewrite the full `RecordCodecBuilder`

For example:

```java
MapCodec<Child> codec = CodecUtil.extend(
    Parent.CODEC,
    Codec.INT.fieldOf("extra").forGetter(Child::getExtra),
    (parent, extra) -> new Child(parent.getId(), extra)
);
```

The idea is:

1. reuse `Parent.CODEC` for the parent fields
2. decode the new `extra` field
3. rebuild the child object from both parts

Once you start dealing with inheritance-heavy data models, `extend(...)` becomes extremely convenient.

<a id="list-of"></a>

## `CodecUtil.listOf(...)`

`listOf(codec)` is the ready-made helper for the "single value or list" pattern.

```java
MultiCodec<List<Identifier>> codec = CodecUtil.listOf(Identifier.CODEC);
```

It accepts both:

- one value
- a list of values

and normalizes them into `List<E>`.

If you want your data format to stay friendly for the very common "just one item" case, this helper is a good fit.

<a id="to-map"></a>

## `CodecUtil.toMap(...)`

Vanilla separates `Codec<T>` and `MapCodec<T>`:

- `Codec<T>` works with arbitrary values
- `MapCodec<T>` works with keyed object structures

`CodecUtil.toMap(...)` bridges that gap:

- if the input already is a `MapCodec`, return it directly
- otherwise, wrap it through `MapCodec.assumeMapUnsafe(codec)`

Its main use case is:

- you currently have a normal `Codec`
- but the API you are calling requires `MapCodec`

The `unsafe` in that path is not decorative. Use it only when you really understand the expected shape of the input.

<a id="json-helpers"></a>

## JSON helpers

`CodecUtil` also provides several JSON-oriented helpers:

- `encodeJson(object, codec)`
- `decodeJson(element, codec)`
- `dumpJson(object, codec, path, override)`
- `readJson(file, codec)`
- `readJson(string, codec)`

Their value is mostly practical:

- they automatically go through `RegistryOps`
- they are convenient for tools, data generation, and debug output

If your goal is simply "can this object encode to JSON correctly?" or "read this object quickly from a file," these helpers are much nicer than rebuilding `JsonOps` plumbing by hand every time.

<a id="stream-codec"></a>

## StreamCodec helpers

Croparia IF also provides two helpers for network-side serialization:

- `toStream(codec)`
- `mapStream(codec, parser, getter)`

Their job is to turn a normal `Codec` into `StreamCodec<RegistryFriendlyByteBuf, T>`, so existing data structures can be reused in packets and sync logic.

If you already have a stable `Codec<T>` and want the network layer to reuse the same model, these helpers save a lot of duplication.

<a id="ops"></a>

## `getOps(...)` and `getRegistryOps(...)`

These are lower-level utilities that you usually do not need to memorize, but they become useful when codec code starts failing around registry context.

Their main responsibilities are:

- building `RegistryOps` when game context is available
- falling back safely when registry access is unavailable, such as in tests or very early startup

If you ever handle codec execution manually in utility code and run into registry-related problems, the ideas behind these helpers are worth studying.

<a id="tips"></a>

## Tips

- When a child type only adds fields, reach for `extend(...)` before copying the entire parent codec.
- For "single value or list" compatibility, prefer `listOf(...)` instead of rebuilding a [MultiCodec](multi-codec.md#list-of) from scratch.
- Use `toMap(...)` only when you know the call site truly requires `MapCodec`.
- If all you want is quick JSON debugging, `encodeJson(...)` and `decodeJson(...)` are usually the fastest path.

