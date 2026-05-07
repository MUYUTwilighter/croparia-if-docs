---
title: Reading and Modifying Block Properties
desc: Explains Croparia IF's BlockProperties and how it participates in block-state extraction, matching, serialization, and later application back onto real block states.
keywords:
  - Croparia IF
  - BlockProperties
  - BlockState
  - block properties
  - DataComponent
  - developer docs
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 30
---

# Reading and Modifying Block Properties

<a id="overview"></a>

If you run into needs like these during development:

- you want to save some `BlockState` properties into JSON, packets, or an `ItemStack`
- you want to test whether a block state satisfies a set of property constraints
- you want to rebuild or modify a `BlockState` from string-keyed properties

then `BlockProperties` is the helper Croparia IF provides for exactly that kind of work.

It is best understood as:

- a serializable subset of block-state properties

You can extract it from a `BlockState`, move it through other systems, then later apply it back onto a real block state when needed.

<a id="mental-model"></a>

## Mental model

From the caller's point of view, the easiest way to read the relationship is:

- `BlockState`
  - the vanilla runtime state object
- `BlockProperties`
  - a property description that is easy to store, send, and match
- `StateHolderAccess.apply(...)`
  - the bridge that applies `BlockProperties` back onto a `BlockState`

The most common lifecycle is:

1. extract properties from one `BlockState`
2. store or transport them
3. later match or reapply them somewhere else

If you keep that main path in mind, most of the page falls into place.

<a id="extract-and-match"></a>

## Extract, apply, and match

The three most commonly used abilities are:

- `extract(BlockState state)`
- `isSubsetOf(BlockState state)`
- applying them back through `StateHolderAccess.apply(...)`

Those three actions already cover most real-world use cases.

`extract(...)` is especially nice because:

- it stores differences relative to the block's default state
- it does not blindly copy every property
- the resulting structure is usually smaller and easier to persist

Meanwhile, `isSubsetOf(...)` and `apply(...)` correspond to:

- "does this world state satisfy my property requirements?"
- "rebuild or update a state using these saved requirements"

In practice, you can think of `BlockProperties` as:

- a storage format for partial block state
- a matching condition for block state
- a reconstruction parameter set for block state

<a id="example-flow"></a>

## A typical workflow

The most common usage path looks something like this:

```java
BlockState state = level.getBlockState(pos);
BlockProperties properties = BlockProperties.extract(state);

// save, send, or attach properties

BlockState restored = StateHolderAccess.apply(state.getBlock().defaultBlockState(), properties);
```

If your goal is not to rebuild a state but only to test it, then:

```java
boolean matches = properties.isSubsetOf(otherState);
```

That is exactly why `BlockProperties` shows up so often in recipes, display data, and cross-system transfer.

<a id="serialization"></a>

## Why not just use `Map<String, String>`

Of course, you *could* store all of this in a plain `Map<String, String>`.

But the value of `BlockProperties` is that it already unifies the pieces that matter in actual development:

- JSON serialization
- network transport
- attaching the data to an `ItemStack` as a Data Component
- tooltip display
- recipe or structure matching
- rebuilding state through `StateHolderAccess.apply(...)`

So you are not using "just a map." You are using a property format that the rest of Croparia IF already understands.

<a id="where-used"></a>

## Where you will encounter it

Common places include:

- `BlockInput` and `BlockOutput` in the [Recipe API](../recipe/index.md#overview)
- display stacks that need to remember block-state details
- systems that need to persist `BlockState` data across boundaries
- code that later re-applies those properties back onto real world state

So if you are building a persistent data structure around block state, it is usually better to reuse this type than to invent another parallel format.

<a id="state-holder-mixin"></a>

## What `StateHolderMixin` contributes here

These abilities are possible because Croparia IF uses `StateHolderMixin` to attach the `StateHolderAccess` interface onto vanilla `StateHolder`.

From the user's point of view, you do not need to memorize the mixin details. The important part is:

- Croparia IF provides an extra bridge for reading and writing vanilla state by string property names

That bridge mainly includes:

- `cif$getValue(String key)`
- `cif$setValue(String key, String value)`
- `cif$getProperties()`
- `StateHolderAccess.apply(...)`

So `BlockProperties` does not "magically know how to change block state." It works because this access layer connects it back into vanilla's state system.

<a id="tips"></a>

## Tips

- When you need to describe part of a block state, prefer `BlockProperties`.
- When you need to apply saved properties back to a real `BlockState`, go through `StateHolderAccess.apply(...)`.
- If you only need to inspect a `BlockState` temporarily inside one function, vanilla state access is often enough.
- If one system needs both persistence and matching or re-application, `BlockProperties` is much more stable than a naked `Map<String, String>`.

