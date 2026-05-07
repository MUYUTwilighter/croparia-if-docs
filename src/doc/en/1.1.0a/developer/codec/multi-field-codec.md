---
title: MultiFieldCodec
desc: Explanation of Croparia IF's MultiFieldCodec and OptionalMultiFieldCodec, which allow one field to accept multiple key names and optional presence.
keywords:
  - Croparia IF
  - Codec API
  - MultiFieldCodec
  - OptionalMultiFieldCodec
  - CodecUtil
  - fieldsOf
  - optionalFieldsOf
  - multiple key names
  - MapCodec
  - developer docs
modVersions:
  - 1.1.0a
navOrder: 30
---

# MultiFieldCodec

<a id="overview"></a>

`MultiFieldCodec<T>` is built on top of `MapCodec<T>` and lets one field accept several different key names. It is especially useful for renamed fields, aliases, and backward compatibility.

Where [MultiCodec](multi-codec.md#overview) solves "multiple value formats," `MultiFieldCodec` solves "multiple names for the same field."

<a id="core-idea"></a>

## Core idea

Its behavior is:

- during decoding, look through several candidate keys in order
- return the first one that exists and decodes successfully
- during encoding, always write back to the first key name

That makes it naturally suited for cases where reading should be compatible, but writing should converge on one canonical name.

For example, if you want both of these forms to work:

```json
{ "id": 1 }
```

and:

```json
{ "index": 1 }
```

you can map both onto the same field with `MultiFieldCodec`.

<a id="codecutil-fields"></a>

## `CodecUtil.fieldsOf(...)`

In real code, you usually do not instantiate `MultiFieldCodec` directly. The normal entry point is `CodecUtil.fieldsOf(...)`:

```java
MapCodec<MyType> codec = RecordCodecBuilder.mapCodec(instance -> instance.group(
    CodecUtil.fieldsOf(Codec.INT, "id", "index").forGetter(MyType::getId)
).apply(instance, MyType::new));
```

This means:

- accept both `id` and `index` during decoding
- always encode back as `id`

It is a very natural fit for smooth field renames.

<a id="optional-field"></a>

## `OptionalMultiFieldCodec`

`OptionalMultiFieldCodec<T>` is the optional variant of the same idea.

Its difference is:

- if none of the candidate keys exist, it returns `Optional.empty()`
- if candidate keys exist but all of them fail to decode, it returns an error

That makes it a better choice for:

- optional fields
- compatibility with old field names when the field itself is not mandatory

In practice, the common entry point is `CodecUtil.optionalFieldsOf(...)`.

<a id="codecutil-optional"></a>

## `CodecUtil.optionalFieldsOf(...)`

Croparia IF exposes two common forms:

- one that returns `OptionalMultiFieldCodec<T>`
- one that accepts a default value and returns a normal `MapCodec<T>`

For example:

```java
MapCodec<Integer> codec = CodecUtil.optionalFieldsOf(Codec.INT, 0, "id", "index");
```

That means:

- `id` and `index` are both accepted
- if neither key exists, use the default value `0`
- when encoding, only the first key name is written

If you want to preserve the meaning of "present versus absent," prefer the optional form and handle the `Optional<T>` yourself.

<a id="when-to-use"></a>

## When to use it

Good use cases:

- a field was renamed, but old configs still need to load
- one concept historically used more than one name
- you want to expose a friendlier alias while still keeping legacy compatibility

Poor use cases:

- the names differ because the underlying meaning has already diverged
- you are only trying to avoid writing proper field definitions

If the semantics behind two names have already split, they should no longer be merged into one `MultiFieldCodec`.

<a id="tips"></a>

## Tips

- Since encoding always writes the first key name, make sure that first name is the one you want to keep long-term.
- If the field is genuinely optional, prefer `optionalFieldsOf(...)` instead of mixing "missing field" and "failed parse" into one behavior.
- When one field starts collecting too many aliases, it is often a sign that the config model itself needs to be cleaned up.
- If you also need multiple key names **and** multiple value formats, it is completely fine to combine `MultiFieldCodec` with [MultiCodec](multi-codec.md#overview).

