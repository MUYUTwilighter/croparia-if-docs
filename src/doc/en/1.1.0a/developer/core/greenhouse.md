---
title: Greenhouse
desc: Explains the Greenhouse module, including automatic harvesting, internal storage, and automation proxies, so developers can understand how it organizes crop-state and drop-processing logic.
keywords:
  - Croparia IF
  - developer docs
  - Greenhouse
  - GreenhouseBlockEntity
  - CropBlock
  - RepoProxy
  - auto-harvest
  - 1.1.0a
navOrder: 20
---

# Greenhouse

<a id="overview"></a>

The Greenhouse is much simpler than the Crop Transmuter, but it is a very good module for understanding a different kind of runtime design:

- no complex UI
- no dedicated network packets
- the focus is on "automatically reacting to world block states" and "storing results in an internal inventory"

If you want to study an automation-heavy module driven by world updates, this page is a better fit.

<a id="module-role"></a>

## Module role

The Greenhouse mainly does three things:

- observe the crop state below itself
- trigger growth or harvesting at the right time
- store the resulting drops in its internal inventory when possible

It does not define a new recipe system of its own. Instead, it reuses:

- the vanilla or crop block's existing drop logic
- internal inventory plus `RepoProxy`

So it is better understood as an automatic harvesting and storage module, not a recipe machine.

<a id="core-classes"></a>

## Core classes

- `Greenhouse`
  - the block itself
  - opens the container, triggers harvest timing, and registers automation proxies
- `GreenhouseBlockEntity`
  - stores a 9-slot inventory
  - performs the concrete harvesting and deposit logic

Unlike some of the other core modules, this one has no custom menu class or dedicated packets. It simply reuses `DispenserMenu` for its container UI.

<a id="inventory"></a>

## Internal inventory and automation

`GreenhouseBlockEntity` stores its contents in a 9-slot `Container`, then wraps it through:

- `new ContainerRepo<>(this)`
- `RepoProxy.item(...)`

This creates the uniform item proxy that outside automation systems can consume.

During block construction, `Greenhouse` registers that proxy with `ProxyProvider`, which means external systems can treat the Greenhouse as a normal item storage target.

If that layer is unfamiliar, the [Repo API](../repo/index.md#overview) is the best background reading.

The key implementation point here is not complicated permission control. It is the stable exposure of internal storage to outside automation.

<a id="harvest-flow"></a>

## Harvest flow

The Greenhouse does not run harvesting through a dedicated tick loop. Instead, it mainly enters through the block update chain:

- `onPlace(...)`
- `updateShape(...)`

On the server side, `updateShape(...)` will:

1. read the block state below
2. fetch the current block entity
3. call `GreenhouseBlockEntity.tryHarvest(...)`

`tryHarvest(...)` then dispatches based on the block type below:

- `CropBlock`
  - handled through `tryHarvestCrop(...)`
- `AttachedStemBlock`
  - handled through `tryHarvestMelon(...)`

So the core idea is not "simulate all plant growth in one algorithm," but:

- detect whether the block below is one of the supported plant types
- then route harvesting through the corresponding logic

<a id="crop-path"></a>

## Regular crop path

`tryHarvestCrop(...)` follows this process:

1. check whether the crop is mature
2. call `Block.getDrops(...)` to obtain drops
3. remove one seed from those drops to simulate replanting
4. try to store the remaining output in internal storage
5. if storage succeeds, set the crop below back to a mid-growth state

Two details are especially worth noticing:

- it does not destroy and replant the crop; it rewinds the age property instead
- the world state is only modified after the storage side can actually accept the output

So a large part of this module's stability comes from "confirm storage first, then commit the harvest."

<a id="melon-path"></a>

## Melon path

The giant melon path works differently:

1. find the fruit position from `AttachedStemBlock.FACING`
2. read the fruit drops
3. try to store them in the internal inventory
4. remove the fruit block if storage succeeds

There is no age rewind here, because giant melons already use a two-part structure of vine plus fruit.

So the module does not try to force a single shared harvesting algorithm:

- regular crops focus on age reset
- giant melons focus on locating and removing the actual fruit block

<a id="growth"></a>

## Growth acceleration

Besides harvesting, the Greenhouse also calls vanilla `randomTick(...)` on the `CropBlock` below during its own `randomTick(...)`.

That means the module really has two behaviors:

- help crops continue growing
- automatically harvest and store them when mature

So it is not only a container block, and not only a harvester. It is a full growth-support module.

<a id="storage"></a>

## Storage boundary

`GreenhouseBlockEntity.tryDeposit(...)` iterates through the drops and tries to accept them through `RepoProxy`.

The design intent is very clear:

- drop generation itself still belongs to the plant block
- the Greenhouse only decides whether it can absorb those drops

When extending this module, it is worth remembering that most of its flexibility lives in "harvest detection" and "storage strategy," not in how drops are generated. Drop generation still comes from the world block's existing behavior.

<a id="extension"></a>

## Extension notes

- If you want the Greenhouse to support more plant types, the first place to extend is usually the dispatch logic in `tryHarvest(...)`.
- If you want to change storage behavior, adjust `tryDeposit(...)` before changing the harvesting flow itself.
- If you need more complex automation, reuse the current `RepoProxy` exposure pattern instead of building a second ad hoc container integration.
- If you want an example of "automatic logic built around existing world block behavior," this module is a very good starting point.

