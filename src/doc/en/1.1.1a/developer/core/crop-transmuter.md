---
title: Crop Transmuter
desc: Explains the Crop Transmuter module, including block, block entity, menu, screen, and network interaction, with special attention to material lookup, candidate selection, redstone behavior, and the new Repo lock views in 1.1.1a.
keywords:
  - Croparia IF
  - developer docs
  - CropTransmuter
  - CropTransmuterBlockEntity
  - CropTransmuterMenu
  - CropTransmuterScreen
  - CropTransmuterSelectPacket
  - RepoProxy
  - 1.1.1a
navOrder: 10
---

# Crop Transmuter

<a id="overview"></a>

The Crop Transmuter is one of the best modules in Croparia IF for studying architecture, because it touches several layers at once:

- block and block-state logic
- block entity persistence
- menu and screen flow
- `C2S` networking
- automation input and output

If you want to see how a complete machine module is broken into layers, this page is usually more helpful than reading the APIs in isolation.

<a id="module-role"></a>

## Module role

Its job can be summarized in one sentence:

- read the `Material` associated with the input fruit
- expand that `Material` into a list of candidate outputs
- let the player or screen state choose one candidate
- convert the input into the chosen output when the redstone condition is satisfied

So this is not a "fixed recipe table" machine. It is a machine where the input defines a candidate set, and the stored state decides the actual result.

<a id="core-classes"></a>

## Core classes

- `CropTransmuter`
  - the block itself
  - opens the menu, maintains `POWERED`, and registers automation proxies
- `CropTransmuterBlockEntity`
  - the real runtime state center
  - stores inventory, selection index, and redstone mode
- `CropTransmuterMenu`
  - the server menu
  - defines slots and basic synchronized data
- `CropTransmuterScreen`
  - the client screen
  - renders the candidate panel, pagination, buttons, and click actions
- [CropTransmuterSelectPacket](../network.md#c2s-flow)
  - synchronizes client selection to the server
- [CropTransmuterRedstoneModePacket](../network.md#c2s-flow)
  - toggles redstone mode

<a id="state-and-data"></a>

## State and data

`CropTransmuterBlockEntity` stores only a few important pieces of state, but each one is sharply scoped:

- `inventory`
  - two slots
  - `INPUT_SLOT` stores the input fruit
  - `OUTPUT_SLOT` stores the transmuted result
- `selectedIndex`
  - the index of the current candidate output
- `positiveRedstone`
  - whether the machine runs with redstone present or absent

The final output is not decided by the menu itself, but by:

- the `Material` resolved from the input item
- the persisted `selectedIndex`

So the user's choice ultimately becomes block entity state, not just temporary client-side UI state.

<a id="processing-flow"></a>

## Processing flow

### 1. Open the menu

When the player right-clicks the block, `CropTransmuter.useItemOn(...)` calls `MenuRegistry.openExtendedMenu(...)` on the server.

An extended menu is used because the client also needs the block position, and the later `C2S` packets validate against that position.

### 2. Read the input material

`CropTransmuterBlockEntity.readInputMaterial()` checks the input slot:

- if the item is an `AbstractFruit<?>`
- it reads the corresponding `Material` through `fruit.getCrop().getMaterial()`

This is important because the machine does not need a second registry from crops to outputs. It reuses the material meaning already stored in crop definitions.

### 3. Show candidates on the client

`CropTransmuterScreen` does not fetch a separate candidate list over the network. It reads the material that is already reachable through the menu and block entity, then renders candidates via `Material.asItems()`.

So:

- the candidate set comes from the input material
- the current selection comes from `selectedIndex`
- the screen only visualizes those two pieces

### 4. Client sends a selection

When the player clicks a candidate in the panel, the client sends `CropTransmuterSelectPacket`.

The server does not trust that value directly. It re-checks:

- whether the current menu really belongs to this machine
- whether the block position still matches
- whether an input material still exists
- whether the received index is still valid

Only then does it call `setSelectedIndex(...)`.

### 5. Redstone-driven processing

The real processing happens inside `CropTransmuterBlockEntity.serverTick(...)`.

Each tick, it does two things:

- align the block state's `POWERED` property with the real redstone input
- decide whether the machine should work now through `powered != isPositiveRedstone()`

Once that condition is satisfied, it proceeds into `tryProcess(...)`.

### 6. Produce the output

The flow inside `tryProcess(...)` is fairly direct:

1. read the input slot
2. resolve the current `Material`
3. get the candidate list from `Material.asItems()`
4. pick the current target using `selectedIndex`
5. try to insert the output into the output slot
6. consume one input if insertion succeeds

There is no extra recipe matching layer here, because the central rule of the machine is already encoded by `Material`.

<a id="automation"></a>

## Automation integration

`CropTransmuter` exposes its item automation through `ProxyProvider.registerItem(...)` during construction.

The real IO restrictions are defined in `CropTransmuterBlockEntity`:

- the input side uses `repo.lockConsume(INPUT_SLOT, OUTPUT_SLOT).lockAccept(OUTPUT_SLOT).trim()`
- the output side uses `repo.lockAccept(INPUT_SLOT, OUTPUT_SLOT).lockConsume(INPUT_SLOT).trim()`

Those views are then wrapped into two separate `RepoProxy<ItemSpec>` objects:

- the top and sides get the input proxy
- the bottom gets the output proxy

In practical behavior terms:

- input view
  - refuses extraction from every slot
  - refuses insertion into the output slot
  - ultimately allows insertion only into the input slot
- output view
  - refuses insertion into every slot
  - refuses extraction from the input slot
  - ultimately allows extraction only from the output slot

This is a good example of why the new separate lock model in `1.1.1a` is useful: the automation boundary stays in the storage layer instead of being scattered through machine logic. For more background, see [Repo API](../repo/index.md) and [Build your own storage interaction](../repo/start.md).

<a id="network-and-ui"></a>

## Division of menu, screen, and network responsibilities

One of the most useful things to notice in this module is that menu, screen, and network each stay focused on one layer:

- `Menu`
  - container slots and basic synchronized data
- `Screen`
  - candidate panel and local interaction
- `Network`
  - only transfers what the user selected and what the user wants to toggle
- `BlockEntity`
  - stores the final trusted state

So if you want to modify the module, the usual entry points are:

- candidate logic: `readInputMaterial()` and `Material.asItems()`
- redstone behavior: `serverTick()` and `positiveRedstone`
- UI presentation: `CropTransmuterScreen`
- automation behavior: `visitItem(...)` and `RepoProxy`

<a id="extension"></a>

## Extension notes

- If you want another machine where input defines a candidate set, this module is one of the strongest reference templates.
- If you want to change how candidate lists are produced, replace the "input to candidates" step first instead of editing the menu or network layer.
- If you want more configurable state, store it on the block entity first and let the menu and screen read it.
- If you want automation support, design the IO boundaries at the `Repo` / `RepoProxy` layer first.

