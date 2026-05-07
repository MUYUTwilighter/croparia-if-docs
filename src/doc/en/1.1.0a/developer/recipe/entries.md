---
title: Preset Input and Output Types
desc: Explanation of ItemInput, ItemOutput, BlockInput, and BlockOutput in the Croparia IF Recipe API, along with the situations where each one fits best.
keywords:
  - Croparia IF
  - Recipe API
  - ItemInput
  - ItemOutput
  - BlockInput
  - BlockOutput
  - SlotDisplay
  - recipe input and output
  - developer docs
modVersions:
  - 1.1.0a
navOrder: 10
---

# Preset Input and Output Types

<a id="overview"></a>

Croparia IF ships several preset input and output structures inside the Recipe API to solve two recurring problems:

- vanilla recipe I/O representations are not especially stable and do not always match Croparia IF's needs
- recipe matching, JEI or REI display, and JSON serialization benefit from sharing the same object model

The four most commonly used types are:

- `ItemInput`
- `ItemOutput`
- `BlockInput`
- `BlockOutput`

All of them implement `SlotDisplay`, so they are not only data holders. They can also provide icons and candidate stacks for recipe display directly.

<a id="mental-model"></a>

## Mental model

The simplest way to read these four types is:

- `ItemInput`
  - how item inputs are matched
- `ItemOutput`
  - how item outputs are described
- `BlockInput`
  - how block or block-state inputs are matched
- `BlockOutput`
  - how block-state outputs are described

Input-side types usually emphasize:

- matching logic
- tag support
- component or property constraints
- amount requirements

Output-side types usually emphasize:

- what is ultimately produced
- how it should be displayed
- how it can be rebuilt into `ItemStack` or `BlockState`

<a id="item-input-output"></a>

## `ItemInput` and `ItemOutput`

`ItemInput` and `ItemOutput` both revolve around `ItemStack`, but they do different jobs.

`ItemInput` focuses on matching:

- it can match by `id`
- it can match by `tag`
- it can carry `DataComponentPatch`
- it can require a minimum `amount`

It also includes runtime-facing methods such as:

- `matches(...)`
- `matchType(...)`
- `consume(...)`
- `getDisplayStacks()`

That means `ItemInput` is not just a static descriptor. It already contains input-checking and consumption logic.

`ItemOutput` focuses on production:

- target output item `id`
- attached components
- amount
- conversion back into `ItemSpec` or `ItemStack`

If all you need is "what item does the player get in the end?", `ItemOutput` is usually enough. If you need "how should the input be matched and consumed?", then `ItemInput` is the right tool.

<a id="block-input-output"></a>

## `BlockInput` and `BlockOutput`

The block side is similar to the item side, but adds the dimension of block-state properties.

`BlockInput` focuses on matching blocks or block states:

- it can match by `id`
- it can match by `tag`
- it can carry `BlockProperties`
- it supports special cases such as "any block"

It also implements `LootItemCondition`, so it can be reused directly in some block check or drop-related contexts.

`BlockOutput` focuses on producing a target block state:

- it stores the target block `id`
- it stores `BlockProperties`
- it can rebuild a display stack
- it can place the block directly into the world through `setBlock(...)`

If the end result of a recipe is "place this block state in the world," `BlockOutput` is much more convenient than hand-rolling `Identifier + properties`.

<a id="codecs"></a>

## Why these types all carry codecs

These preset types generally ship with:

- `CODEC_STR`
- `CODEC_COMP`
- `CODEC`
- `STREAM_CODEC`

The design idea behind that is:

- shorthand and full object forms should both be supported
- network sync and JSON I/O should reuse the same structure

For example, `ItemInput` supports both a shorthand string and a full object form. Internally, that compatibility is coordinated through [MultiCodec](../codec/multi-codec.md#overview) and [TestedCodec](../codec/tested-codec.md#overview).

So the Recipe API and the [Codec API](../codec/index.md#overview) are meant to work together directly.

<a id="display"></a>

## `SlotDisplay`

All of these preset types implement `SlotDisplay`. For developers, this means they can participate not only in recipe matching, but also in recipe UI display directly.

The most visible result is:

- JEI and REI can read display stacks from them directly
- the recipe class does not need to maintain a second, display-only data model

That design sharply reduces the usual split between "logic objects" and "display objects."

<a id="when-to-use"></a>

## When to prefer these preset types

Good cases:

- the recipe really is centered on items or blocks
- you want JSON, runtime matching, and JEI or REI display to share one structure
- you want to reuse Croparia IF's existing shorthand and full-form compatibility

Less suitable cases:

- your recipe input or output is not item- or block-based, but some more abstract custom resource
- you only need a tiny internal structure that will never be displayed

In the first case, it is usually better to define a new entry type of your own and model its codec and display interface by referencing these preset structures.

<a id="tips"></a>

## Tips

- Separate "input matching objects" from "output description objects" early. Do not try to make `ItemOutput` carry input validation.
- If the recipe needs both matching and display, reusing these preset types is usually cleaner than wrapping them in another DTO.
- If your JSON should support both shorthand and full object forms, study these codecs first instead of starting from zero.
- When you later integrate JEI or REI, using these preset types already removes a large part of the glue work.

After the entry model is in place, the next step is usually [JEI integration](jei.md#overview) or [REI integration](rei.md#overview).

