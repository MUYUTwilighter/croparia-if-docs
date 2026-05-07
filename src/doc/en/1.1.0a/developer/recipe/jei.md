---
title: JEI Integration
desc: Explanation of how the Croparia IF Recipe API integrates with Just Enough Items, including the roles of JeiCategory, TypedSerializer, and workstation display.
keywords:
  - Croparia IF
  - Recipe API
  - JEI
  - Just Enough Items
  - JeiCategory
  - TypedSerializer
  - DisplayableRecipe
  - recipe display
  - developer docs
modVersions:
  - 1.1.0a
navOrder: 20
---

# JEI Integration

<a id="overview"></a>

Croparia IF's JEI integration is built on top of the Recipe API. The core idea is not "write a completely separate JEI layer for every recipe type," but instead:

- let recipes implement `DisplayableRecipe`
- keep type-level metadata inside `TypedSerializer`
- let `JeiCategory` read those pieces and handle registration and display

That keeps the JEI-facing layer fairly thin.

<a id="mental-model"></a>

## Mental model

The most important JEI-side objects are:

- `JeiClient`
  - the JEI plugin entrypoint
- `JeiCategory<R>`
  - the JEI category for one recipe family
- `TypedSerializer<R>`
  - provider of type ID, recipe class, workstations, and runtime recipe queries

Their relationship is:

- `DisplayableRecipe` exposes recipe-side display data
- `TypedSerializer` defines how one recipe family is identified and queried
- `JeiCategory` defines how that family appears inside JEI
- `JeiClient` registers all categories and recipes into JEI itself

<a id="jei-category"></a>

## `JeiCategory`

Croparia IF's `JeiCategory<R>` is an abstract base class that implements `IRecipeCategory<R>`.

It already handles several common tasks for you:

- generating a `RecipeType<R>` from `TypedSerializer`
- generating a default translated title from the recipe type ID
- deriving the category icon from `TypedSerializer.getStations()`

So a concrete recipe family usually only needs to:

1. extend `JeiCategory<R>`
2. return its `TypedSerializer`
3. provide the actual layout logic

That makes "one recipe family, one category class" a very natural pattern.

<a id="typed-serializer"></a>

## The role of `TypedSerializer` inside JEI

`TypedSerializer` is the real center of JEI integration. `JeiCategory` relies on it for:

- the category ID
- the recipe class type
- the workstation icons
- the runtime list of recipes for this type

Two points matter especially:

- `getStations()`
  - used to register recipe catalysts and derive the default icon
- `find()`
  - used to register every recipe of this type into JEI

So if your `TypedSerializer` is well-defined, the JEI side usually needs very little extra glue.

<a id="registration"></a>

## Registration flow

Croparia IF's JEI registration flow can be summarized in three steps:

1. keep a list of `JeiCategory<?>` instances in `JeiClient`
2. register categories through `registerCategories(...)`
3. register recipes and recipe catalysts through `registerRecipes(...)` and `registerRecipeCatalysts(...)`

In other words, JEI does not understand your recipe type by itself. It only consumes the information already prepared by the category and the typed serializer.

That is also why the Recipe API encourages recipes and type objects to own their own display data.

<a id="when-to-customize"></a>

## When more customization is needed

In the basic case, `JeiCategory` already handles:

- title
- icon
- type identity

You usually only need extra custom logic for:

- layout
- interaction widgets
- special rendering elements

If your recipe UI is unusual, such as:

- multi-page inputs
- structure-like displays
- dynamic state switching

then the concrete category will need to add more JEI-side UI behavior.

<a id="tips"></a>

## Tips

- Design the recipe class and its `TypedSerializer` first, then add JEI support. The category becomes much lighter that way.
- If `getStations()` is empty, make sure to override the icon logic, because the default base implementation will throw.
- The default title relies on the translation key `gui.<namespace>.<path>.title`, so stable naming helps.
- If a JEI category starts carrying too much recipe-side business logic, it usually means that data belongs earlier in `DisplayableRecipe` or `TypedSerializer`.

If you also want REI support, continue with [REI integration](rei.md#overview). The overall design is similar, even though the platform APIs differ.

