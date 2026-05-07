---
title: Core Modules
desc: Introduces Croparia IF's core feature modules for downstream developers, focusing on the roles, data flow, and extension points of modules such as the Infusor, Ritual Stand, Crop Transmuter, and Greenhouse.
keywords:
  - Croparia IF
  - developer docs
  - core modules
  - Infusor
  - RitualStand
  - CropTransmuter
  - Greenhouse
  - 1.1.1a
navOrder: 10
---

# Core Modules

<a id="overview"></a>

This group is not about "how one shared API is designed." It is about how Croparia IF's core gameplay modules actually run in code.

If you already have a rough understanding of:

- [Repo API](../repo/index.md#overview)
- [Recipe API](../recipe/index.md#overview)
- [Network API](../network.md#overview)

then this section is the better place to answer questions like:

- where is the main entry class of one concrete module
- how are the block, block entity, menu, screen, recipe, and network pieces connected
- when changing behavior or adding compatibility, which layer should be touched first

<a id="modules"></a>

## Covered modules

- [Crop Transmuter](crop-transmuter.md#overview)
  - a complete module with block entity, menu, screen, and `C2S` interaction
- [Greenhouse](greenhouse.md#overview)
  - a module focused more on automatic processing and storage
- [Infusor](infusor.md#overview)
  - a typical "block state + dropped-item recipe" module
- [Ritual Stand](ritual_stand.md#overview)
  - a dropped-item-driven module that depends more heavily on structure validation and recipe matching
- [FakePlayer](fake-player.md#overview)
  - a small execution helper used by core modules for world interaction

<a id="how-to-read"></a>

## Suggested reading order

- If you want to study how GUI, menus, and networking work together, start with [Crop Transmuter](crop-transmuter.md#overview)
- If you want to study dropped-item-driven recipe handling, start with [Infusor](infusor.md#overview) and [Ritual Stand](ritual_stand.md#overview)
- If you want to study how block entities expose storage and automation, start with [Greenhouse](greenhouse.md#overview)

<a id="common-patterns"></a>

## Shared patterns across these modules

Even though these modules do very different things, they follow several consistent design habits:

- interaction entry points tend to stay on the block class
- persistent state tends to stay on the block entity
- shared capabilities are exposed through reusable APIs instead of being fused into one module
- complicated workflows are split into entry, state, matching, and output layers

So while reading these pages, the most useful thing to watch is usually not one method name, but:

- where each module draws its responsibility boundaries
- why it depends on one shared API
- which layer you should hook into when extending it

