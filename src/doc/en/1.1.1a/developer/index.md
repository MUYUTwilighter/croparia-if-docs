---
title: Developers
desc: Croparia IF 1.1.1a developer entry point, covering core modules, shared APIs, Maven publishing, and content maintenance references.
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
- [Network API](network.md#overview)
- [Repo API](repo/index.md#overview)

If you mainly want reusable building blocks, jump straight into:

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

This group is most useful when you want to answer questions like:

- where a module actually starts in code;
- how blocks, block entities, menus, screens, recipes, and networking are connected;
- which layer you should inspect first when adjusting module behavior.

### Shared APIs

- [Maven Repository](maven.md#overview)
- [Repo API](repo/index.md#overview)
- [Runtime Data Generation System](generator/index.md#overview)
- [Recipe API](recipe/index.md#overview)
- [Codec API](codec/index.md#overview)
- [Network API](network.md#overview)
- [Other Common APIs](other/index.md#overview)

This group is most useful when you want to answer questions like:

- which reusable capabilities the mod already exposes;
- which layer is worth reusing instead of copying one concrete module implementation;
- how to attach Croparia IF to your own development environment.

### Content Maintenance References

- [Adding Built-in Crops](crop.md#overview)

These pages are more maintenance-oriented. For example, `crop` focuses on:

- how Croparia IF itself adds built-in `Crop` and `Melon` content;
- where to start if you need to continue maintaining that built-in content.

<a id="next"></a>

## Suggested next step

- To understand how the mod runs as a whole, start with [Core Modules](core/index.md#overview)
- To add Croparia IF as a development dependency in your own project, start with [Maven Repository](maven.md#overview)
- To work with storage, automation, or platform item capabilities, start with [Repo API](repo/index.md#overview)
- To work with runtime data generation, start with [Runtime Data Generation System](generator/index.md#overview)
- To troubleshoot UI interactions or client syncing, start with [Network API](network.md#overview)
