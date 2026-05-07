---
title: ItemPlaceable
desc: Explains Croparia IF's ItemPlaceable interface and how it unifies the behavior of placing an item into the world as an ItemEntity above a target block.
keywords:
  - Croparia IF
  - ItemPlaceable
  - ItemEntity
  - place item
  - Dropper
  - Dispenser
  - ElementalPotion
  - Infusor
  - Ritual Stand
  - RitualStand
  - DropsCache
  - developer docs
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 40
---

# ItemPlaceable

<a id="overview"></a>

`ItemPlaceable` is a very small interface, but it solves one very specific problem:

- some blocks need to "place an item into the world" rather than simply eject a normal dropped stack from a container

Croparia IF uses it to unify the act of turning an `ItemStack` into an `ItemEntity` at a target position, and then hooks that behavior into several existing interaction chains.

<a id="core-idea"></a>

## Core idea

`ItemPlaceable` only defines one default method:

- `placeItem(Level world, BlockPos pos, ItemStack stack, @Nullable Entity owner)`

Its behavior is roughly:

- if running on the client, do nothing
- if the target position is powered by redstone, place the whole stack at once
- otherwise place only one item
- create the matching `ItemEntity`
- record the thrower if an owner exists
- add the entity to the world

This gives "placing an item into the world" one shared convention instead of forcing each block to rewrite the same logic separately.

There is also one important boundary to keep in mind:

- `ItemPlaceable` does not directly modify block state
- its job is only to place an item in a controlled way above the target block
- the real follow-up effect is usually handled later by that block's own `stepOn(...)`, `useItemOn(...)`, or other interaction logic

So `ItemPlaceable` is best read as a common entry for safely delivering an item into a block's interaction range.

<a id="where-used"></a>

## Where it is used

Typical use sites in the source include:

- [Infusor](../core/infusor.md#overview)
- [Ritual Stand](../core/ritual_stand.md#overview)
- `ElementalPotion` when interacting with certain target blocks
- special handling in `DropperBlockMixin`

In other words, `ItemPlaceable` expresses:

- "this block knows how to receive an item as something placed into the world"

It adds more meaning than a plain drop, and it is far more consistent than hand-writing every block's right-click, dropper, and dispenser flow separately.

<a id="integration-chain"></a>

## Real integration chain

`ItemPlaceable` is already wired into several existing mechanisms in the source.

### `DropperBlockMixin`

`DropperBlockMixin` checks the block in front of the dropper:

- if that block implements `ItemPlaceable`
- it no longer uses vanilla's normal spit-out path
- and instead calls `placeItem(...)`

That means:

- as soon as your block implements `ItemPlaceable`
- it can receive dropper output directly
- without needing a second special-case dropper integration

### `ElementalPotion`

`ElementalPotion` registers its own dispenser behavior.

Its logic goes in this order:

1. if the target is an `Infusor`, try `tryInfuse(...)` first
2. if infusion fails, fall back to `Infusor.placeItem(...)`
3. if the target implements `ItemPlaceable`, call `placeItem(...)` directly
4. otherwise fall back to the vanilla default dispenser behavior

So `ItemPlaceable` is not just an interface for right-click paths. It also acts as the marker meaning "this block can receive an item that was launched at it."

### `Infusor` and `Ritual Stand`

Both `Infusor` and `Ritual Stand` implement `ItemPlaceable`, but their real recipe logic does not happen inside `placeItem(...)`.

Their actual flow is closer to:

1. `useItemOn(...)`, droppers, or dispensers place an item at the block center
2. the world spawns an `ItemEntity`
3. the block detects that entity in `stepOn(...)`
4. only then do `DropsCache`, recipe matching, or structure matching take over

So `ItemPlaceable` handles "deliver the item to the correct location," not "finish the recipe immediately."

<a id="when-to-use"></a>

## When to use it

Good cases for implementing `ItemPlaceable`:

- the block needs to accept items delivered as world entities on top of itself
- you want existing logic such as `DropperBlockMixin` or `ElementalPotion` to detect it automatically
- the real processing fits better in `stepOn(...)`, entity detection, or recipe matching
- you want to reuse Croparia IF's existing redstone-sensitive placement behavior

If your block does not need this kind of "placed item entity" semantics at all, then implementing it just for consistency is unnecessary.

<a id="tips"></a>

## Tips

- When several blocks all need to receive ejected items, unify that behavior through `ItemPlaceable` instead of writing separate right-click, dropper, and dispenser logic every time.
- If you override the default implementation, first decide whether callers care about the high-level meaning "this block can receive placed items," or about the current concrete behavior of "full stack with redstone, single item otherwise."
- If your real system logic starts only after the drop enters the world, keep the heavy logic in the block's own entity-detection layer and let `ItemPlaceable` remain a lightweight entry.
- This interface is more of a world-interaction contract than a direct block-state placement helper; implementations are easier to maintain when that meaning stays obvious.

