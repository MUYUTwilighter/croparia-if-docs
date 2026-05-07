---
title: MultiCodec
desc: Explanation of Croparia IF's MultiCodec and how it tries multiple codecs in order so one data type can support several serialized formats.
keywords:
  - Croparia IF
  - Codec API
  - MultiCodec
  - TestedCodec
  - CodecUtil
  - listOf
  - multiple formats
  - union codec
  - developer docs
modVersions:
  - 1.1.0a
navOrder: 20
---

# MultiCodec

<a id="overview"></a>

`MultiCodec<T>` lets one data type support several serialized forms. It tries its inner codecs in order and returns the first successful result.

This need appears all the time in vanilla-style data systems, but Mojang does not provide a ready-made "ordered union codec." Croparia IF's `MultiCodec` fills exactly that gap.

<a id="core-idea"></a>

## Core idea

`MultiCodec<T>` is essentially an `ArrayList<TestedCodec<? extends T>>` that also implements `Codec<T>` itself.

Its behavior is:

1. try the first codec
2. if it fails, record the error
3. try the next codec
4. continue until one succeeds
5. if all fail, merge their errors and return the combined failure

So the most important thing is not just that it can hold multiple codecs, but that **their order matters**.

Earlier branches get the first chance to consume the input, so you should think carefully about:

- which format is more specific
- which format is broader
- whether the failure messages will still help during debugging

<a id="when-to-use"></a>

## When to use it

Common use cases:

- one value may be written as a single value or as a list
- one object may use a shorthand form or a full object form
- old and new config formats need to coexist

For example, a field may accept:

```json
"minecraft:stone"
```

or:

```json
["minecraft:stone", "minecraft:dirt"]
```

That is exactly the kind of case `MultiCodec` is good at.

<a id="basic-usage"></a>

## Basic usage

The most common constructor path is `CodecUtil.of(...)`:

```java
MultiCodec<List<String>> codec = CodecUtil.of(
    Codec.STRING.listOf(),
    Codec.STRING.xmap(List::of, List::getFirst)
);
```

This means:

- first try to decode the input as a list
- if that fails, try it as a single string
- normalize both forms into `List<String>`

In day-to-day code, it is often better to use `CodecUtil.listOf(...)` directly, because that helper already captures the "single item or list" pattern cleanly.

<a id="with-tested-codec"></a>

## Relationship with `TestedCodec`

`MultiCodec` only decides ordering. It does not decide whether a branch is sensible for the current input. That part belongs to [TestedCodec](tested-codec.md#overview).

Inside `CodecUtil.of(...)`, plain codecs are wrapped into `TestedCodec` automatically, so you can choose between:

- passing plain codecs
- passing `TestedCodec` branches that already have custom filtering

When branch boundaries are easy to describe, explicit `TestedCodec` checks usually make the result:

- easier to debug
- safer against overly broad branches
- more stable for long-term format compatibility

<a id="list-of"></a>

## `CodecUtil.listOf(...)`

`CodecUtil.listOf(codec)` is the most common `MultiCodec` helper. It lets one value accept:

- a single element
- a list of elements

and always returns `List<E>`.

```java
MultiCodec<List<Identifier>> codec = CodecUtil.listOf(Identifier.CODEC);
```

That codec can accept:

```json
"croparia:gem_earth"
```

and:

```json
["croparia:gem_earth", "croparia:gem_water"]
```

The point is not just saving a few lines. It is about making a very common compatibility pattern behave the same way everywhere.

<a id="ordering"></a>

## Choosing branch order

Branch order is the main design choice in `MultiCodec`. A good default rule is:

- put more specific formats first
- put broader, easier-to-misfire formats later

For example:

- an object form is usually more specific than a plain string form
- a list form is usually more specific than a single-value form

If the order is reversed, a loose branch may succeed too early and prevent the better branch from ever running.

<a id="tips"></a>

## Tips

- `MultiCodec` is best for "one meaning, several spellings." It is not a replacement for normal data modeling.
- If the number of branches keeps growing, it is often better to narrow the model first instead of stacking more alternatives.
- When one branch shape is easy to detect, combine `MultiCodec` with [TestedCodec](tested-codec.md#with-multicodec).
- If your only need is "single value or list," prefer [CodecUtil.listOf](other.md#list-of).

