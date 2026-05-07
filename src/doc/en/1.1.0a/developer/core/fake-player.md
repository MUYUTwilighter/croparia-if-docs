---
title: FakePlayer
desc: Explains how Croparia IF's FakePlayer executes item-use logic on the server side and where it fits in modules such as the Ritual Stand.
keywords:
  - Croparia IF
  - developer docs
  - FakePlayer
  - RitualStand
  - SpawnEggItem
  - useAllItemsOn
  - 1.1.0a
navOrder: 50
---

# FakePlayer

<a id="overview"></a>

`FakePlayer` is a small but very practical execution helper provided in Croparia IF's `core` layer.

The problem it solves is not "fake a complete player entity," but something much more specific:

- when a core module needs to use an item on a block the way a player would, how should that be executed safely on the server?

Its most typical current use site is the [Ritual Stand](ritual_stand.md#result-flow), which is why it fits better under `core` than under a general utilities page.

<a id="core-idea"></a>

## Core idea

`FakePlayer` extends `Player`, but its real purpose is not to participate in the normal gameplay loop. Instead, it exposes a few static entry points:

- `getPlayer(...)`
- `useItemOn(...)`
- `finishUseItem(...)`
- `useAllItemsOn(...)`

You can think of it as:

- a per-dimension cached fake player instance
- plus a helper layer for simulating player-style item use on behalf of modules

The most important thing to notice is that it simulates the semantics of "a player uses an item," not "spawn a drop" or "call one internal block method directly."

<a id="usage-flow"></a>

## Usage flow

### `getPlayer(ServerLevel)`

Returns the cached fake player instance for a dimension.

The implementation keeps a `Map<ServerLevel, FakePlayer>`, which means:

- one dimension reuses one fake player instance
- modules do not need to allocate a fresh player every time

### `useItemOn(ServerLevel, BlockPos, ItemStack)`

Moves the fake player above the target block, then:

- places the stack in the main hand
- builds a `UseOnContext`
- calls `item.useOn(context)`

This is the core simulation of "a player uses this item on that block."

### `finishUseItem(ItemStack, ServerLevel)`

Calls `item.finishUsingItem(world, fakePlayer)` and returns the remainder.

This matters because some items are not fully described by `useOn(...)` alone. End-of-use remainders and follow-up behavior are also part of the item semantics.

### `useAllItemsOn(...)`

This is the most common high-level entry.

It will:

1. try up to `MAX_USES` times
2. repeatedly call `useItemOn(...)`
3. if the result is neither `FAIL` nor `PASS`
4. continue into `finishUseItem(...)`
5. collect all remainders and return them

So this is not "use the item once." It is "keep using this stack while it behaves like a usable item."

<a id="ritual-stand"></a>

## Role inside the Ritual Stand

The Ritual Stand contains one special branch while handling ritual results:

- if the result item is a `SpawnEggItem`
- it does not simply export that egg as an ordinary dropped item
- instead it calls `FakePlayer.useAllItemsOn(...)`

That means the ritual result is treated as something that should really perform its world interaction behavior, not merely exist as an item output.

For developers, this is an important distinction because it changes how you should think about ritual results:

- some results mean "produce this item"
- some results mean "execute the action that a player would perform with this item"

`FakePlayer` is the bridge that connects the second category into the vanilla interaction chain.

<a id="behavior-boundaries"></a>

## Behavior boundaries

`FakePlayer` is not a full player substitute, and the code keeps its role intentionally narrow:

- `isSpectator()` always returns `false`
- `isCreative()` always returns `false`
- `gameMode()` is fixed to `SURVIVAL`

That tells you its goal is not to simulate all player modes. Its goal is to run the "normal survival-mode player uses an item" path as predictably as possible.

Likewise, its interaction shape is fixed:

- from above the target block
- with `Direction.UP`
- using `useOn` against that block

So if you expect complex camera behavior, different interaction faces, or full input-device emulation, that is already beyond the design boundary of this helper.

<a id="when-to-use"></a>

## When to use it

Good cases:

- your module truly needs to trigger the vanilla path of "a player uses this item on a block"
- you need the remainder after item use
- you want to reuse the existing semantics of an item instead of rewriting them yourself

Less suitable cases:

- you only want to spawn a simple output item
- you only want to call one module's internal processing method directly
- you need highly specific player-input details or multi-face interaction simulation

<a id="tips"></a>

## Tips

- If the module really cares about "what happens when a player uses this item," `FakePlayer` is usually a better fit than hand-written approximations.
- If you only care about the final result item, you may not need `FakePlayer` at all; it is most valuable for items with true use semantics.
- When connecting `FakePlayer` into a core module, treat it as a special branch the way the Ritual Stand does, not as the default path.
- If you later add more behavior-style result items, `useAllItemsOn(...)` is the right layer to abstract around before you start repeating `useOn + finishUsingItem` in each module.

