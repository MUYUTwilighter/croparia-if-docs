---
title: Developers
desc: Croparia IF 1.1.0a developer entry point, covering core modules, shared APIs, and content maintenance references.
navOrder: 40
---

# Developer Docs

<a id="overview"></a>

These pages are for readers who want to extend, integrate with, or maintain `Croparia IF`.

You will usually come here in three situations:

- you want to understand how a specific core module works;
- you want to reuse one of the mod’s shared APIs;
- you want to continue maintaining built-in content, such as built-in crops.

<a id="how-to-read"></a>

## Where to start

If this is your first time here, these three entry points are usually the most helpful:

- [Core Modules](core/index.md#overview)
  - Start here if you want to understand how the Infusor, Ritual Stand, Crop Transmuter, and Greenhouse fit together.
- [Network API](network.md#overview)
  - Best if you want to inspect menu interactions, recipe syncing, and packet registration.
- [Repo API](repo/index.md#overview)
  - Best if you want to work with storage, automation I/O, and platform capability bridges.

If you already know what the modules do and mainly want reusable building blocks, jump straight into:

- [Runtime Data Generation System](generator/index.md#overview)
- [Recipe API](recipe/index.md#overview)
- [Codec API](codec/index.md#overview)
- [Other Common APIs](other/index.md#overview)

<a id="sections"></a>

## Current topics

### Core Modules

- [Core Modules Overview](core/index.md#overview)
- [Crop Transmuter](core/crop-transmuter.md#overview)
- [Greenhouse](core/greenhouse.md#overview)
- [Infusor](core/infusor.md#overview)
- [Ritual Stand](core/ritual_stand.md#overview)
- [FakePlayer](core/fake-player.md#overview)

This group is most useful for questions like:

- where the entry class for a specific module lives;
- how it connects to menus, networking, recipes, and storage;
- which layer you should inspect first when changing behavior.

### Shared APIs

- [Repo API](repo/index.md#overview)
- [Runtime Data Generation System](generator/index.md#overview)
- [Recipe API](recipe/index.md#overview)
- [Codec API](codec/index.md#overview)
- [Network API](network.md#overview)
- [Other Common APIs](other/index.md#overview)

This group is most useful for questions like:

- which reusable capabilities the mod already exposes;
- which layer you should reuse instead of copying one concrete module implementation.

### Content Maintenance References

- [Adding Built-in Crops](crop.md#overview)

These pages are more maintenance-oriented. For example, `crop` focuses on:

- how Croparia IF itself adds built-in `Crop` and `Melon` content;
- where to start if you need to continue maintaining that built-in content.

<a id="next"></a>

## Suggested next step

- To understand how the mod runs as a whole, start with [Core Modules](core/index.md#overview)
- To work with storage, automation, or platform item capabilities, start with [Repo API](repo/index.md#overview)
- To work with runtime data generation, start with [Runtime Data Generation System](generator/index.md#overview)
- To troubleshoot UI interactions or client syncing, start with [Network API](network.md#overview)
