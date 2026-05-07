---
title: Infusor
desc: Explains the Infusor module, including block state, elemental infusion, dropped-item recipes, and its integration with ItemPlaceable, so developers can understand its full workflow.
keywords:
  - Croparia IF
  - developer docs
  - Infusor
  - ElementalPotion
  - InfusorRecipe
  - DropsCache
  - ItemPlaceable
  - 1.1.0a
navOrder: 30
---

# Infusor

<a id="overview"></a>

The Infusor is Croparia IF's most typical example of a "block-state-driven + dropped-item recipe" module.

Compared with the Greenhouse, it emphasizes recipe processing much more. Compared with the Crop Transmuter, it depends far less on GUI flow. It is especially useful for understanding:

- how a block state participates in recipe matching
- why dropped items need to work together with `DropsCache`
- how `ItemPlaceable` becomes meaningful inside a real module

<a id="module-role"></a>

## Module role

The Infusor really has two layers of responsibility:

- switch itself into a specific elemental state through Elemental Potions
- once it has an element, treat dropped items on top of it as recipe input for `InfusorRecipe`

So this is not a plain "fixed block + fixed recipes" relationship. Instead:

- the block state determines the current element
- that current element then becomes part of later recipe matching

<a id="core-classes"></a>

## Core classes

- `Infusor`
  - the block itself, and also an `ItemPlaceable`
- `ElementalPotion`
  - can infuse or defuse an `Infusor` directly
- `InfusorRecipe`
  - the actual recipe type
- `InfusorContainer`
  - the context container used during recipe matching
- `DropsCache`
  - collects and caches dropped items near the block

This group does not need a dedicated block entity, because its runtime state is simple enough to live entirely in the block state.

<a id="block-state"></a>

## Block state

The most important state field is:

- `ELEMENT`

It is an `EnumProperty<Element>` whose default value is `Element.EMPTY`.

That means:

- when the block is in the `EMPTY` state, it does not participate in actual infusion recipes
- once it holds a specific element, items dropped on top of it can enter recipe matching

So the first thing to accept when reading this module is:

- the Infusor's recipe conditions do not come only from the input items
- they also come from the current state of the block itself

<a id="player-flow"></a>

## Player interaction flow

`useItemOn(...)` covers the three main player interactions for this module.

### Elemental infusion

If the player is holding an `ElementalPotion`, the Infusor first tries `tryInfuse(...)`.

On success it will:

- switch the block state to the corresponding element
- play the infusion sound
- consume the potion
- return the empty bottle or other remainder

### Defusion

If the block already has an element, and the held item matches the `crafting remainder` of that element's potion, the flow goes through `tryDefuse(...)`.

On success it will:

- reset the block state back to `Element.EMPTY`
- consume the held item
- return the elemental potion

### Dropping an item onto the block

If the item is neither the recipe generator nor part of the elemental interactions above, the block calls `placeItem(...)` to drop the item at its center.

This is important because it connects the Infusor directly into the unified [ItemPlaceable](../other/item-placeable.md#integration-chain) item placement path.

<a id="recipe-flow"></a>

## Recipe processing flow

The real recipe logic does not happen in `useItemOn(...)`. It happens in `stepOn(...)`.

When an `ItemEntity` steps on the block, `Infusor.stepOn(...)` will:

1. verify that the world is server-side
2. verify that the feature is enabled in config
3. read the current block element
4. pass the dropped items plus the element into `tryCraft(...)`

`tryCraft(...)` then continues:

1. collect nearby drops through `DropsCache.queryStacks(...)`
2. build an `InfusorContainer`
3. look up a matching recipe with `Recipes.INFUSOR.find(...)`
4. if one matches, execute `onCrafting(...)`

`onCrafting(...)` will:

- assemble the recipe result
- export it through `CifUtil.exportItem(...)`
- reset the block state back to default
- play the crafting sound

The key design point is:

- players and dispensers only deliver items into the world
- the actual recipe match happens after those items enter the world as dropped entities

<a id="drops-cache"></a>

## Why it depends on `DropsCache`

At first glance, the Infusor might look like it only needs the one `ItemEntity` currently touching the block. But the implementation does not work that way. It uses `DropsCache` to collect nearby drops into one matching context.

The reason is straightforward:

- an infusion recipe may require more than one dropped item
- several dropped items may need to participate in the same tick
- if each entity handled itself independently, the match could become duplicated or lose context

So `DropsCache` acts as the temporary layer that turns "nearby dropped entities in the world" into "the input set for one recipe evaluation."

<a id="item-placeable"></a>

## Relationship with `ItemPlaceable`

The value of implementing `ItemPlaceable` here is not just to save a few lines of item entity spawning code. It connects the Infusor into an entire interaction chain:

- players can right-click to place items directly onto the block
- the dispenser behavior of `ElementalPotion` falls back to `Infusor.placeItem(...)` when no infusion happens
- `DropperBlockMixin` can also redirect dropper output into it

That means the module has one unified input story:

- whether the item comes from a player, a dropper, or a dispenser
- it is eventually turned into an `ItemEntity` dropped on the block
- then `stepOn(...)` and the recipe layer process it in one consistent path

This is one of the clearest real uses of `ItemPlaceable` in the codebase.

<a id="extension"></a>

## Extension notes

- If you want to change how elemental state switching works, start with `tryInfuse(...)` and `tryDefuse(...)`.
- If you want to change recipe matching semantics, inspect `InfusorContainer` and `InfusorRecipe` before touching the player interaction layer.
- If you want to study how to build a dropped-item-driven recipe machine, this module is easier to enter than the Ritual Stand.
- If you want to support new delivery paths, try to preserve the main chain of `ItemPlaceable -> ItemEntity -> stepOn(...)`.

