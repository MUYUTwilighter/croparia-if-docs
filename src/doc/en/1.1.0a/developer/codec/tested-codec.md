---
title: TestedCodec
desc: Explanation of Croparia IF's TestedCodec, how it performs pre-checks before real encoding or decoding, and why it serves as the base building block for tools such as MultiCodec.
keywords:
  - Croparia IF
  - Codec API
  - TestedCodec
  - CodecUtil
  - EncodeTest
  - DecodeTest
  - MultiCodec
  - pre-check
  - developer docs
modVersions:
  - 1.1.0a
navOrder: 10
---

# TestedCodec

<a id="overview"></a>

`TestedCodec<T>` is the lowest-level building block in Croparia IF's Codec API. It wraps a normal `Codec<T>` and runs a lightweight pre-check before actual encoding or decoding happens.

It exists because:

- not every codec branch is suitable for every input
- some branches can be ruled out just from the raw structure
- a single codec should not have to own branch ordering and branch filtering at the same time

Because of that, `TestedCodec` is rarely the star of a large feature by itself. It is more often the small foundation under [MultiCodec](multi-codec.md#overview), [MultiFieldCodec](multi-field-codec.md#overview), and `CodecUtil.of(...)`.

<a id="core-idea"></a>

## Core idea

Internally, `TestedCodec<T>` holds three things:

- the real `Codec<T>` that does the actual work
- one `EncodeTest<T>`
- one `DecodeTest<?>`

Its behavior is simple:

- run `EncodeTest` before encoding
- run `DecodeTest` before decoding
- if the test succeeds, continue into the wrapped codec
- if the test fails, return `DataResult.error(...)` directly

So its main value is not "how to encode or decode," but "whether this branch should even be tried."

<a id="when-to-use"></a>

## When to use it

Good use cases:

- you are combining multiple branches inside `MultiCodec`, and want to filter obvious mismatches first
- you want a codec to allow encoding only when an object satisfies some state check
- you want clearer failure messages for rejected branches

Less suitable cases:

- there is only one codec branch and no structural filtering is needed
- all validation is already naturally expressed inside the codec itself

<a id="basic-usage"></a>

## Basic usage

In practice, the most common entry is not `new TestedCodec<>(...)`, but `CodecUtil.of(...)`:

```java
Codec<List<String>> raw = Codec.STRING.listOf();

TestedCodec<List<String>> codec = CodecUtil.of(
    raw,
    list -> list.isEmpty()
        ? TestedCodec.fail(() -> "List must not be empty")
        : TestedCodec.success()
);
```

This means:

- use the raw codec for decoding
- check whether the list is empty before encoding
- if it is empty, reject encoding with an explicit error

If you need a decode-side pre-check, you can also provide a `DecodeTest`:

```java
TestedCodec<Integer> codec = CodecUtil.of(
    Codec.INT,
    (ops, input) -> ops.getNumberValue(input).isSuccess()
        ? TestedCodec.success()
        : TestedCodec.fail(() -> "Input is not a number")
);
```

<a id="encode-decode-tests"></a>

## `EncodeTest` and `DecodeTest`

`TestedCodec` exposes two test interfaces:

- `EncodeTest<T>`
  - checks whether an object should be encoded through the current branch
- `DecodeTest<I>`
  - checks whether the raw input should be decoded through the current branch

Both return a `TestResult`, which contains:

- `success = true/false`
- `msg = Supplier<String>`

One practical detail matters here: the failure message is built lazily, so you can afford to make it more specific without adding cost to the success path.

<a id="with-multicodec"></a>

## Relationship with `MultiCodec`

If `MultiCodec` is responsible for "trying several branches in order," then `TestedCodec` is responsible for "each branch checking whether it is appropriate first."

That is why `CodecUtil.of(...)` prefers to wrap plain codecs into `TestedCodec` before combining them.

You can read the relationship like this:

- `TestedCodec`
  - branch-local pre-check
- `MultiCodec`
  - branch ordering and dispatch

So when you design a codec that accepts multiple input shapes, the common pattern is:

1. prepare one codec for each format
2. add `TestedCodec` when branch filtering helps
3. combine them with `MultiCodec`

<a id="tips"></a>

## Tips

- When several branches are easy to distinguish by structure, prefer an explicit `DecodeTest` instead of making every branch fail the hard way.
- `EncodeTest` works best for deciding whether a branch should be used, not for carrying every business rule.
- If your only goal is "put a normal codec into `MultiCodec`," start with `CodecUtil.of(...)` instead of hand-writing constructors every time.
- When the failure message is for developers, try to explain why that branch does not apply, instead of only saying it failed.

