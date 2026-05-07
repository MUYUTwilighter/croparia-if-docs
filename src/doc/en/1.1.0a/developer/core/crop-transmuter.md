---
title: Crop Transmuter
desc: Explains the Crop Transmuter module, including its block, block entity, menu, screen, and network interactions, to help developers understand material lookup, candidate selection, and redstone-controlled processing.
keywords:
  - Croparia IF
  - developer docs
  - CropTransmuter
  - CropTransmuterBlockEntity
  - CropTransmuterMenu
  - CropTransmuterScreen
  - CropTransmuterSelectPacket
  - RepoProxy
modVersions:
  - 1.1.0a
navOrder: 10
---

# Crop Transmuter

<a id="overview"></a>

The Crop Transmuter is one of the best modules in Croparia IF for reading architecture, because it touches several layers at once:

- block and block state logic
- block entity persistence
- menu and screen flow
- `C2S` network interaction
- automation input and output

If you want to see how a "complete machine module" is split apart, this page is usually more helpful than reading the APIs in isolation.

<a id="module-role"></a>

## Module role

Its job can be summarized in one sentence:

- read the `Material` of the input fruit
- expand that `Material` into several candidate outputs
- let the player or the current UI state decide which candidate is selected
- convert inputs into outputs one by one when the redstone condition is satisfied

So this is not a machine that runs against one fixed recipe table. It is a machine where the input defines a candidate set, and the saved state determines the actual result.

<a id="core-classes"></a>

## Core classes

- `CropTransmuter`
  - the block itself
  - opens the menu, maintains the `POWERED` state, and registers automation proxies
- `CropTransmuterBlockEntity`
  - the real runtime state center
  - stores inventory, selected index, and redstone mode
- `CropTransmuterMenu`
  - the server-side menu
  - defines slots and synchronizes basic data
- `CropTransmuterScreen`
  - the client-side screen
  - renders the candidate panel, pagination, buttons, and click actions
- [CropTransmuterSelectPacket](../network.md#c2s-flow)
  - syncs the selected candidate from client to server
- [CropTransmuterRedstoneModePacket](../network.md#c2s-flow)
  - toggles redstone mode

<a id="state-and-data"></a>

## State and data

`CropTransmuterBlockEntity` only stores a few important pieces of state, but each one has a very clear role:

- `inventory`
  - two slots
  - `INPUT_SLOT` holds the input fruit
  - `OUTPUT_SLOT` holds the transmuted result
- `selectedIndex`
  - the index of the currently selected candidate
- `positiveRedstone`
  - whether the machine works with redstone on or with redstone off

What ultimately decides the output is not the menu itself, but:

- the `Material` associated with the input item
- the persisted `selectedIndex`

So the user's choice eventually becomes block entity state, not just temporary client UI state.

<a id="processing-flow"></a>

## Processing flow

### 1. Open the menu

When the player right-clicks the block, `CropTransmuter.useItemOn(...)` calls `MenuRegistry.openExtendedMenu(...)` on the server.

An extended menu is used instead of a plain menu because the client also needs the block position, and both `C2S` packets validate against that position later.

### 2. Read the input material

`CropTransmuterBlockEntity.readInputMaterial()` checks the input slot:

- if the item is an `AbstractFruit<?>`
- then it reads the associated `Material` through `fruit.getCrop().getMaterial()`

This design matters because the machine does not need its own extra registry from crops to outputs. It simply reuses the material semantics already present in crop definitions.

### 3. Show candidates on the client

`CropTransmuterScreen` does not fetch a separate candidate list over the network. Instead, it reads the current material through the menu and block entity, then renders candidate items with `Material.asItems()`.

So:

- the candidate set comes from the input material
- the selected entry comes from `selectedIndex`
- the screen only visualizes those two things

### 4. Client sends a selection

When the player clicks one of the candidates, the client sends `CropTransmuterSelectPacket`.

The server does not blindly trust that value. It re-checks:

- whether the current menu is really this machine's menu
- whether the block position matches
- whether an input material still exists
- whether the received index is still valid

Only then does it call `setSelectedIndex(...)`.

### 5. Redstone-driven processing

The real processing happens in `CropTransmuterBlockEntity.serverTick(...)`.

Each tick it does two things:

- align the block state's `POWERED` property with the real redstone input
- decide whether the machine should work now based on `powered != isPositiveRedstone()`

Once that condition is satisfied, it moves into `tryProcess(...)`.

### 6. Produce the output

The flow inside `tryProcess(...)` is fairly direct:

1. read the input slot
2. resolve the current `Material`
3. get the candidate list from `Material.asItems()`
4. choose the current target with `selectedIndex`
5. try to insert the result into the output slot
6. consume one input if insertion succeeds

There is no extra recipe matching layer here, because the main rule of the machine is already encoded by `Material`.

<a id="automation"></a>

## Automation integration

`CropTransmuter` exposes its item automation through `ProxyProvider.registerItem(...)` during construction.

The actual IO restrictions are defined inside `CropTransmuterBlockEntity`:

- the input side uses `repo.asAcceptOnly().asLocked(OUTPUT_SLOT)`
- the output side uses `repo.asConsumeOnly().asLocked(INPUT_SLOT)`

Those views are then wrapped into two `RepoProxy<ItemSpec>` instances:

- the top and sides get the input proxy
- the bottom gets the output proxy

This is worth studying because it keeps automation rules in the storage layer instead of scattering them through the machine logic. For more background, see the [Repo API](../repo/index.md).

<a id="network-and-ui"></a>

## Division of menu, screen, and network responsibilities

One of the most useful things to notice while developing around this module is that menu, screen, and network each stay in their own lane:

- `Menu`
  - provides container slots and basic synchronized data
- `Screen`
  - renders the candidate panel and local interactions
- `Network`
  - only transfers "what the user selected" and "what the user wants to toggle"
- `BlockEntity`
  - stores the final trusted state

So if you want to modify this module, you can usually locate the right layer like this:

- change candidate logic: look at `readInputMaterial()` and `Material.asItems()`
- change redstone behavior: look at `serverTick()` and `positiveRedstone`
- change UI presentation: look at `CropTransmuterScreen`
- change automation behavior: look at `visitItem(...)` and `RepoProxy`

<a id="extension"></a>

## Extension notes

- If you want to build another machine where the input determines a candidate set, this module is one of the best templates to copy conceptually.
- If you want to change how the candidate list is produced, replace the "input to candidate list" step first instead of touching the menu or network layer.
- If you want to add more configurable state, store it on the block entity first and let the menu and screen read from there, rather than keeping it only on the client.
- If you want to support automation well, design your IO boundaries at the `Repo` or `RepoProxy` layer first.

