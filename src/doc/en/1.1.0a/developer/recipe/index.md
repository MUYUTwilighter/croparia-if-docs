---
title: Recipe API
desc: Overview of the Recipe API for Croparia IF downstream developers, covering DisplayableRecipe, TypedSerializer, preset input and output structures, and JEI or REI integration.
keywords:
  - Croparia IF
  - Recipe API
  - DisplayableRecipe
  - TypedSerializer
  - ItemInput
  - ItemOutput
  - BlockInput
  - BlockOutput
  - JEI
  - REI
  - developer docs
modVersions:
  - 1.1.0a
navOrder: 40
---

# Recipe API

<a id="overview"></a>

Croparia IF's Recipe API is built around two goals:

- use one shared abstraction to describe "displayable recipes"
- reduce repeated glue code between JEI, REI, and recipe input or output models

It does not replace vanilla `Recipe`, `RecipeSerializer`, or `RecipeType`. Instead, it adds a layer on top that is easier to reuse across several custom recipe systems inside the mod.

<a id="mental-model"></a>

## Mental model

It helps to remember these roles first:

- `DisplayableRecipe`
  - a recipe that is still a vanilla recipe, but also knows how to expose display data
- `TypedSerializer`
  - one object that combines `RecipeType` and `RecipeSerializer`, plus query and workstation metadata
- `ItemInput` / `ItemOutput`
  - shared structures for item-side recipe I/O
- `BlockInput` / `BlockOutput`
  - shared structures for block-side recipe I/O

In other words:

- `DisplayableRecipe` answers "what does the recipe object look like?"
- `TypedSerializer` answers "how is this recipe type registered, queried, and tied to workstations?"
- the preset entry types answer "how do we model complex inputs and outputs in a stable way?"

<a id="displayable-recipe"></a>

## `DisplayableRecipe`

`DisplayableRecipe<C extends RecipeInput>` is the core interface of the Recipe API. It extends vanilla `Recipe<C>` and additionally requires the recipe to provide several pieces of display information:

- `craftingStation()`
  - the workstation associated with this recipe
- `getTypedSerializer()`
  - the `TypedSerializer` for the current recipe type
- `getInputs()`
  - input entries used for display
- `getOutputs()`
  - output entries used for display

Its main value is that a recipe object no longer only answers "can I match?" and "what do I craft?" It can also expose its display model directly to JEI and REI.

Compared with vanilla `Recipe`, Croparia IF puts much more emphasis on the idea that a recipe class should know how it wants to be shown.

<a id="typed-serializer"></a>

## `TypedSerializer`

`TypedSerializer<R>` implements both:

- `RecipeType<R>`
- `RecipeSerializer<R>`

That is where the name `Typed` comes from. It merges type identity and serialization into one runtime object, and it also stores:

- the recipe type ID
- the recipe class
- the `MapCodec`
- the `StreamCodec`
- the list of workstations

Its most practical methods are:

- `find()`
  - query all recipes of this type
- `findHolders()`
  - query all `RecipeHolder` values of this type
- `find(input, level)`
  - find a matching recipe for the given input and world
- `getStations()`
  - get the workstations for JEI and REI display

Because of that, `TypedSerializer` is not just a registration helper. It is the runtime center of the Recipe API.

<a id="when-to-use"></a>

## When to use the Recipe API

Typical use cases:

- you want to add a new Croparia IF-style recipe type
- you want one recipe class to work naturally with both the vanilla recipe system and JEI or REI
- you want to reuse Croparia IF's existing input and output structures instead of hand-writing new codecs every time

If your use case is only a tiny internal structure that never needs JEI or REI integration, this API may feel heavier than necessary.

<a id="navigation"></a>

## Navigation

- [Preset input and output types](entries.md#overview)
- [JEI integration](jei.md#overview)
- [REI integration](rei.md#overview)

