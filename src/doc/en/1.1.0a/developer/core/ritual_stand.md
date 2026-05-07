---
title: Ritual Stand
desc: Explains how the Ritual Stand module organizes its runtime flow around dropped items, structure validation, and ritual recipes, including its relationship with DropsCache, structure containers, and FakePlayer.
keywords:
  - Croparia IF
  - developer docs
  - RitualStand
  - RitualContainer
  - RitualStructureContainer
  - DropsCache
  - FakePlayer
  - 1.1.0a
navOrder: 40
---

# Ritual Stand

<a id="overview"></a>

Like the Infusor, the Ritual Stand is a dropped-item-driven module. It is more complex, though, because it cares not only about "what items were dropped here," but also:

- the current state of the Ritual Stand block
- whether the surrounding structure is valid
- whether a legal ritual recipe exists under that structure

So if the Infusor is "state + dropped-item recipes," the Ritual Stand is closer to "state + structure + dropped-item recipes."

<a id="module-role"></a>

## Module role

Its core responsibilities are:

- accept items placed onto the Ritual Stand
- validate the surrounding ritual structure
- combine structure results and dropped items to match `RitualRecipe`
- export the result and give feedback when successful

So the center of this module is not inventory or UI. It is the way matching context is assembled.

<a id="core-classes"></a>

## Core classes

- `RitualStand`
  - the block itself, and also an `ItemPlaceable`
- `RitualStructureContainer`
  - the container used for structure-recipe matching
- `RitualContainer`
  - the container used for ritual-recipe matching
- `DropsCache`
  - collects the dropped items participating in the ritual
- `FakePlayer`
  - simulates player-style item use for special ritual results

There is no dedicated block entity here either, because the runtime core state lives in "current world state + current dropped items + current matched structure," not in a persistent inventory.

<a id="entry-flow"></a>

## Entry flow

When the player right-clicks the block with an item, `RitualStand.useItemOn(...)` will:

- block direct placement from the recipe generator
- call `placeItem(...)` on the main-hand item

As with the [Infusor](infusor.md#item-placeable), this layer only places items into the world.

The real ritual logic starts in `stepOn(...)`:

1. run only on the server
2. verify that the feature is enabled
3. throttle through `DropsCache.isQueried(...)`
4. begin structure and recipe matching

The presence of `CRAFT_INTERVAL` tells you something important about the design:

- dropped items at the same location are expected to trigger repeated collisions in a short time
- throttling is necessary to avoid processing one input set over and over

<a id="matching-flow"></a>

## Matching flow

This is the most important part of the module to understand.

### Step 1: structure matching

The implementation first runs:

- `Recipes.RITUAL_STRUCTURE.find(new RitualStructureContainer(level.getBlockState(pos)), level)`

That means structure matching first looks only at the current Ritual Stand state and the surrounding world.

If a structure definition is found, the code then continues with:

- `structure.validate(pos, level)`

That second step is what really decides whether the structure at the current position is valid.

### Step 2: ritual recipe matching

Only after structure validation succeeds does the code construct:

- `RitualContainer.of(level.getBlockState(pos), DropsCache.queryStacks(world, pos), matched)`

Then it performs:

- `Recipes.RITUAL.find(matcher, level)`

So the matching context for `RitualRecipe` contains at least three categories of data:

- the current Ritual Stand block state
- the current set of dropped items
- the structure result that already matched successfully

This is the main reason the Ritual Stand is more complex than the Infusor.

<a id="result-flow"></a>

## Result handling

When a ritual succeeds, the default flow is:

1. build the result with `ritual.assemble(...)`
2. export it through `CifUtil.exportItem(...)`
3. play the ritual completion sound

There is also one important special branch:

- if the result item is a `SpawnEggItem`
- then the module uses [FakePlayer](fake-player.md#overview) through `useAllItemsOn(...)`

That means some ritual results are not treated as "drop this item and stop." Instead, they continue into "use this item the way a player would use it."

So if you are trying to understand why certain ritual results behave more like actions than plain item output, this is the branch to inspect first.

<a id="feedback"></a>

## Player feedback

`RitualStand` also gives fairly complete feedback on failure paths:

- structure missing
  - `overlay.croparia.ritual.404`
- structure invalid
  - `overlay.croparia.ritual.bad`
- structure valid, but no ritual recipe matched
  - `overlay.croparia.ritual.rejected`

These overlays are sent through `tryTell(...)` to nearby players related to the dropped items.

That is worth noticing from a design perspective, because it shows that:

- the Ritual Stand treats "why this failed" as part of module behavior
- not all modules are designed only around their success path

<a id="drops-cache"></a>

## Why it also depends on `DropsCache`

The Ritual Stand uses `DropsCache` just like the Infusor, but the dependency is even more important here.

In this module, `DropsCache` is not only about avoiding repeated reads. It is also what makes "the input set for this ritual attempt" stable. Without that, deterministic ritual matching after structure validation would be much harder.

If you want to build any system driven by "dropped items + world structure," some form of caching plus throttling is almost always necessary.

<a id="extension"></a>

## Extension notes

- When extending ritual logic, first separate whether you are changing structure matching or recipe matching.
- If you want more special result behaviors, look at the `SpawnEggItem` branch first and ask whether it can become a more general execution layer.
- If you build a similar module, keep structure validation and recipe matching as two distinct phases instead of merging them into one test.
- If you are debugging a ritual that does not work, follow this order: does the structure definition exist, does the structure validate, do the dropped items enter `DropsCache`, and does the ritual recipe match?

