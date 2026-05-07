---
title: Network
desc: Introduces Croparia IF’s networking abstraction through NetworkHandler and NetworkHandlerType, plus the two real data flows of Crop Transmuter menu interaction and recipe synchronization.
keywords:
  - Croparia IF
  - network
  - NetworkHandler
  - NetworkHandlerType
  - CropTransmuter
  - S2CSyncRecipeStart
  - S2CSyncRecipeChunk
  - S2CSyncRecipeEnd
  - Architectury
  - developer docs
  - 1.1.0a
navOrder: 60
---

# Network

<a id="overview"></a>

Croparia IF does not build a heavy networking framework of its own. Instead, it adds a lighter unifying layer on top of Architectury’s `NetworkManager`:

- `NetworkHandler`
- `NetworkHandlerType`

The goal of that layer is straightforward:

- let a packet carry its type information, codec, direction, and handling logic in one place
- simplify cross-platform registration
- keep sending code as uniform as possible

If you only want a quick understanding of the network flow inside the mod, keep this in mind:

- `NetworkHandler` means “one sendable, handleable packet”
- `NetworkHandlerType` means “the registration record for that packet”

<a id="mental-model"></a>

## Mental model

Croparia IF’s networking layer can be understood as three levels:

1. `NetworkHandler`
2. `NetworkHandlerType`
3. `NetworkHandlers`

Their responsibilities are:

- `NetworkHandler`
  - the concrete packet object
  - also implements `CustomPacketPayload`
  - provides its own type and implements `handle(...)`
- `NetworkHandlerType`
  - describes whether this packet is `C2S` or `S2C`
  - holds the `CustomPacketPayload.Type`
  - holds the `StreamCodec`
  - can optionally carry a `PacketTransformer`
- `NetworkHandlers`
  - the central registration entrypoint
  - wires every packet type into Architectury’s send/receive system

The point of this structure is not complexity. It is that every packet ends up looking the same:

- one record or object as payload
- one `TYPE` constant as registration metadata
- one `handle(...)` method as the receive-side logic

<a id="network-handler"></a>

## `NetworkHandler`

`NetworkHandler` is Croparia IF’s minimal abstraction for one packet.

It mainly provides three things:

- `type()`
  - by default it pulls the actual payload type from `handlerType()`
- `send()`
  - automatically decides whether to send to the server or broadcast to clients according to the packet side
- `handle(NetworkManager.PacketContext context)`
  - the business-logic entrypoint after the packet is received

The most important detail here is that send-side behavior is already constrained by the declared direction.

- If `handlerType().side()` is `C2S`
  - `send()` will try to send to the server
- If `handlerType().side()` is `S2C`
  - `send()` will broadcast, or use `send(ServerPlayer)` for a specific player

This means callers usually do not need a second branch just to decide “is this a client packet”. The packet type has already declared its side.

<a id="network-handler-type"></a>

## `NetworkHandlerType`

`NetworkHandlerType` is the registration descriptor for a packet.

It packages:

- the packet `Identifier`
- the send/receive direction `NetworkManager.Side`
- the `StreamCodec`
- an optional `PacketTransformer`

The most common creation helpers in the source are:

- `NetworkHandlerType.ofC2S(...)`
- `NetworkHandlerType.ofS2C(...)`

The easiest way to think about it is as the packet’s registration card:

- `NetworkHandler` is the actual payload
- `NetworkHandlerType` tells the system how to identify it, how to encode and decode it, and which side it belongs to

`ofS2C(...)` also supports a `PacketTransformer`, which matters for large synchronized payloads. The recipe sync flow later on is the clearest example.

<a id="registration"></a>

## Registration flow

The unified registration entrypoint is `NetworkHandlers`.

Its job is:

- call `register(...)` once for each `NetworkHandlerType`
- choose the correct Architectury registration path from the packet side
- for `S2C`, handle both the client receive registration and the server-side payload declaration

The main benefit for developers is:

- business packets do not need separate Fabric / Forge / NeoForge registration logic
- most of the time you only need to care about the `TYPE` constant and `handle(...)`

<a id="c2s-flow"></a>

## Typical C2S flow: `CropTransmuter`

The clearest `C2S` example in the current source is the `CropTransmuter` menu screen.

There are two packets involved:

- `CropTransmuterSelectPacket`
- `CropTransmuterRedstoneModePacket`

Both are sent by client-side UI interactions in [CropTransmuterScreen](core/crop-transmuter.md#network-and-ui), then handled by the server to update the corresponding block entity.

### Selecting an output

`CropTransmuterSelectPacket` sends “which candidate output the player selected in the GUI” back to the server.

Its payload only contains:

- `BlockPos pos`
- `int selectedIndex`

On the server, handling proceeds through a series of checks:

1. Is the sender a `ServerPlayer`?
2. Is the current open menu really a `CropTransmuterMenu`?
3. Does the menu position match the position inside the packet?
4. Is the block entity at that position actually a `CropTransmuterBlockEntity`?
5. Does valid input material currently exist?
6. Is `selectedIndex` inside the valid range?

Only then does it call `transmuter.setSelectedIndex(...)`.

This is a very good reference flow because it captures Croparia IF’s default `C2S` attitude:

- the client only sends the minimum state it must send
- the server always re-validates the real context
- GUI state from the client is never trusted on its own

### Toggling redstone mode

`CropTransmuterRedstoneModePacket` is simpler and only carries the target block position.

On the server, it:

1. checks whether the current menu and position still match
2. finds the corresponding `CropTransmuterBlockEntity`
3. calls `toggleRedstoneMode()`
4. then uses `menu.broadcastChanges()` so the menu state flows back to the client

That makes the packet’s responsibility very narrow:

- it only means “the user requested a mode toggle”
- the real state change is still performed by the server

<a id="s2c-flow"></a>

## Typical S2C flow: recipe sync

The other flow worth studying is the three-stage `S2C` recipe synchronization used by `SyncedRecipeCache`:

- `S2CSyncRecipeStart`
- `S2CSyncRecipeChunk`
- `S2CSyncRecipeEnd`

Together they serve one goal:

- send a snapshot of recipe types marked as “needs client sync” to the client

### Why three stages

Synchronization is not done in one oversized packet. It is split into three phases:

1. `Start`
   - tells the client which `syncId` this sync round uses, and which recipe types are included
2. `Chunk`
   - sends the actual recipe data by type and by chunk
3. `End`
   - tells the client that the sync round is complete and the new snapshot can be committed

The benefits are:

- the client can clearly distinguish one complete sync round from another
- large recipe sets do not have to fit into one oversized packet
- the server can send data in chunks grouped by type and size

### `SplitPacketTransformer`

When `S2CSyncRecipeChunk` registers its `TYPE`, it also carries a `SplitPacketTransformer`.

That means recipe sync is not only chunked at the logic level. The network layer also explicitly declares that large payloads need transport-level splitting. For developers, this is a very practical pattern:

- if one `S2C` payload will naturally grow large, do not rely only on “sending a bit less”
- you can follow this pattern and attach a transformer at the `NetworkHandlerType` level

### How the client applies it

The client-side landing point is `SyncedRecipeCache`:

- `beginClientSync(...)`
  - creates the state for the current sync round
- `acceptChunk(...)`
  - stores each incoming chunk temporarily
- `endClientSync(...)`
  - merges all chunks into the new live snapshot
  - then triggers `CompatRecipeRefresh.onRecipesUpdated(...)`

The key idea here is not “process each packet immediately”. It is:

- first assemble a complete snapshot on the client
- then refresh recipe visibility as one step

<a id="queue-and-validation"></a>

## Two common habits inside `handle(...)`

These packets share two very stable implementation habits.

### `context.queue(...)`

Business logic is usually wrapped in `context.queue(...)`.

That means Croparia IF prefers to move real state changes back onto the correct thread context, instead of mutating world state or client caches directly inside the raw network callback thread.

If you add a new packet, you should usually follow the same pattern.

### Validate first, mutate second

Whether it is `CropTransmuter` or recipe sync, the logic does not just “change state on receipt”.

Typical checks include:

- whether the current player exists
- whether the current open menu still matches
- whether the block position still matches
- whether the block entity type still matches
- whether indices, materials, or chunk numbers are still valid

This is one of the most reusable lessons in the networking layer:

- keep packets small
- keep trust on the receiving side

<a id="when-to-follow"></a>

## When to follow this pattern

The current networking design is a good fit when:

- you are adding a small GUI interaction that needs to send button clicks or selections back to the server
- you need to synchronize a read-only snapshot to the client and expect the payload to grow large
- you are already using `StreamCodec` and want the packet definition and registration style to stay uniform
- you want one layer above Architectury that still feels close to the mod’s business logic

If your use case is extremely local and one-off, you do not have to abstract everything into more layers. But as soon as it enters Croparia IF’s shared API surface, following `NetworkHandler` / `NetworkHandlerType` is usually the safer choice.

<a id="tips"></a>

## Recommendations

- For new packets, prefer the pattern “one payload object + one `TYPE` constant + one `handle(...)`”, because it matches the existing code style best.
- `C2S` packets should only send the minimum necessary information. Do not trust large amounts of client-provided state.
- When packets touch menus or block entities, always re-validate position, menu binding, and entity type on the server.
- If an `S2C` payload may become large, prefer staged and chunked syncing like the recipe sync flow.
- If a system ultimately works around a client snapshot, prefer “buffer first, commit once” over refreshing visible state on every incoming packet.
