---
title: REI Integration
desc: Explanation of how the Croparia IF Recipe API integrates with Roughly Enough Items, including the collaboration between ReiCategory, ReiDisplay, and TypedSerializer.
keywords:
  - Croparia IF
  - Recipe API
  - REI
  - Roughly Enough Items
  - ReiCategory
  - ReiDisplay
  - TypedSerializer
  - DisplayableRecipe
  - developer docs
modVersions:
  - 1.1.0a
navOrder: 30
---

# REI Integration

<a id="overview"></a>

Croparia IF approaches REI in almost the same spirit as JEI: the Recipe API provides a shared recipe abstraction, and the compatibility layer maps that abstraction onto REI's category and display system.

The main difference is that REI introduces `ReiDisplay<R>` explicitly as a dedicated display object.

<a id="mental-model"></a>

## Mental model

The key REI-side objects are:

- `ReiClient`
  - the REI client plugin entrypoint
- `ReiCategory<R>`
  - the recipe category
- `ReiDisplay<R>`
  - the concrete display wrapper
- `TypedSerializer<R>`
  - provider of type information, workstations, and recipe queries

You can read the relationship like this:

- `DisplayableRecipe` provides the basic display data
- `TypedSerializer` provides type identity and query access
- `ReiCategory` describes how a family of recipes should look
- `ReiDisplay` wraps one actual recipe instance into the form REI expects

<a id="rei-category"></a>

## `ReiCategory`

Croparia IF's `ReiCategory<R>` base class implements `DisplayCategory<ReiDisplay<R>>` and already takes care of:

- generating the `CategoryIdentifier` from `TypedSerializer.getId()`
- default title translation
- default icon resolution
- building workstation entries from `TypedSerializer.getStations()`

So most concrete categories only need to:

1. extend `ReiCategory<R>`
2. return the correct `TypedSerializer<R>`
3. implement layout and drawing logic

Just like on the JEI side, if the workstation list is empty, the default icon logic is no longer enough and should be overridden.

<a id="rei-display"></a>

## `ReiDisplay`

Unlike JEI, REI wraps each recipe inside `ReiDisplay<R>`.

Its main job is to:

- hold the real recipe instance or `RecipeHolder`
- associate it with the correct `ReiCategory`
- expose the category identifier and display content to REI

So `ReiCategory` is mainly "how does this family render?", while `ReiDisplay` is "how is this concrete recipe instance represented?"

That separation fits REI's own API model quite well and keeps display-object management clearer.

<a id="typed-serializer"></a>

## The role of `TypedSerializer` inside REI

Just like with JEI, REI integration relies heavily on `TypedSerializer`. It mainly provides:

- the category ID
- the workstation list
- all `RecipeHolder` values for the current recipe type

When displays are registered, `ReiClient` will typically call:

- `category.getRecipeType().findHolders()`

and then wrap each holder into `ReiDisplay<R>`.

So if `TypedSerializer` is not configured correctly, REI problems usually follow right behind it.

<a id="registration"></a>

## Registration flow

Croparia IF's REI registration flow can be summarized like this:

1. maintain a list of `ReiCategory<?>` instances in `ReiClient`
2. register categories and workstations through `registerCategories(...)`
3. register displays for every category through `registerDisplays(...)`

Compared with JEI, REI adds an extra display wrapper layer, but the overall pattern is still "start from `TypedSerializer`, then map runtime recipes into the display system."

<a id="jei-vs-rei"></a>

## Difference from JEI

If you already read [JEI integration](jei.md#overview), the main REI-side distinction is:

- JEI works more directly with categories and recipe types
- REI makes the display object explicit

But in Croparia IF's design, both sides still share the same core data sources:

- `DisplayableRecipe`
- `TypedSerializer`
- the preset input and output types

That means most recipe-side design work does **not** need to be duplicated separately for JEI and REI.

<a id="tips"></a>

## Tips

- Keep type and workstation information inside `TypedSerializer` instead of scattering it across REI-specific classes.
- Before debugging display or layout issues, first make sure `findHolders()` is returning the correct runtime recipes.
- If JEI and REI begin to drift too far apart, the first thing to inspect is whether `DisplayableRecipe` is exposing a consistent display model.
- Complex UIs may still justify separate JEI and REI layout code, but try not to let them evolve into different data models.

