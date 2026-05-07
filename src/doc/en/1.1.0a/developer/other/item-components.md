---
title: Custom Item Components
desc: Explains Croparia IF's custom Data Components, including registration, TooltipProvider integration, and the practical roles of Text, TargetPos, and BlockProperties.
keywords:
  - Croparia IF
  - developer docs
  - Data Components
  - CropariaComponents
  - Text
  - TargetPos
  - BlockProperties
  - TooltipProvider
  - 1.1.0a
modVersions:
  - 1.1.0a
navOrder: 50
---

# Custom Item Components

<a id="overview"></a>

Croparia IF registers a small set of its own components on top of vanilla `Data Components`, so items can carry more explicit runtime meaning.

This topic fits better under `other` than under one specific core module, because it is not a local implementation detail. It is a cross-cutting capability that several systems may reuse.

If you want to understand:

- how the mod's own components are registered
- why certain items automatically show extra tooltip lines
- what `TargetPos`, `Text`, and `BlockProperties` are each good for

this page is the right entry.

<a id="registration"></a>

## Registration entrypoint

The shared registration entry lives in `CropariaComponents`.

The current source registers three components:

- `TARGET_POS`
- `BLOCK_PROPERTIES`
- `TEXT`

They all share a few traits:

- each one is registered as a vanilla `DataComponentType`
- each one has a persistent codec
- if client sync is required, that is declared explicitly through `networkSynchronized(...)`

So Croparia IF lets the vanilla component system own both:

- what the component is
- how it travels on item stacks

instead of building another custom NBT wrapper layer.

<a id="tooltip-chain"></a>

## How tooltip integration works

The easiest place for developers to notice these components is in item tooltips.

That path mainly comes from two pieces:

- the component type implements `TooltipProvider`
- `ItemStackMixin` iterates `CropariaComponents.forEach(...)` during tooltip construction

So Croparia IF does not hand-write tooltip assembly in every item class. Instead it:

- lets each component describe how it should render itself
- then plugs all registered components into the shared `ItemStack` tooltip flow through a mixin

The advantages are straightforward:

- display logic stays attached to the component
- items that use that component do not need to duplicate UI assembly code

<a id="text"></a>

## `Text`

`Text` is the simplest custom component in the group.

It essentially wraps one `MutableComponent` and implements `TooltipProvider`. Its responsibility is very narrow:

- attach one text payload to an item
- display that text directly in the tooltip

This type is a good fit for:

- one extra explanation line
- temporary hint text
- readable information that should travel with the item and also appear in the tooltip

If all you need is "attach one human-readable text line to the stack," `Text` is the lightest option in the group.

<a id="target-pos"></a>

## `TargetPos`

`TargetPos` represents a target location bound to both a dimension and coordinates.

Its main stored data is:

- the dimension `Identifier`
- the `BlockPos`

Besides tooltip display, it also provides:

- `getLevel(server)`
- `teleport(entity, server)`

So this is not merely a coordinate note. It is a position component with clear runtime behavior semantics.

If you need an item to remember:

- a bound point
- a teleport target
- a cross-dimension position reference

then `TargetPos` is the pattern worth reusing directly.

<a id="block-properties"></a>

## `BlockProperties`

`BlockProperties` represents a string-keyed mapping of block-state properties, and it is also a `TooltipProvider`.

Inside Croparia IF, it is not just "store one map." It directly connects with:

- [Reading and modifying block properties](block-property.md#overview)

Its main abilities include:

- extracting properties from a `BlockState`
- testing whether it is a subset of another `BlockState`
- listing the stored properties in a tooltip

So if you need one item to carry a portable description of a block state, `BlockProperties` is far better than stuffing an ad hoc string into the stack.

<a id="network-sync"></a>

## Which components need network sync

From the registration style in `CropariaComponents`, you can see:

- `TARGET_POS`
  - explicitly declares `networkSynchronized(TargetPos.TYPE.streamCodec())`
- `BLOCK_PROPERTIES`
  - carries network sync through `BlockProperties.TYPE`
- `TEXT`
  - uses `CodecUtil.toStream(Text.CODEC)` to build its network codec

That reflects a very clear design rule in Croparia IF:

- if the client also needs to read the component correctly
- then network sync should be part of the component type definition itself

So when adding new components, it is worth deciding early:

- is this only a server-side semantic
- or does the client also need it for display, rendering, or interaction?

<a id="when-to-use"></a>

## When a custom component is the right fit

These situations usually justify a component:

- the data naturally belongs to an `ItemStack`
- it needs to survive serialization, copying, and transport with that item
- it may be read directly by the tooltip or client display layer
- it should own its own codec and display logic

If the data is only a temporary runtime variable inside one system, or does not really belong on items at all, then making a full `DataComponentType` may be unnecessary.

<a id="tips"></a>

## Tips

- When designing a new component, decide first whether it is just a raw value or an item-attached object with real display or behavior semantics.
- If the component should appear in tooltips, prefer implementing `TooltipProvider` on the component itself instead of scattering tooltip code across item classes.
- If the client needs to read the component, design network synchronization at registration time instead of adding it later as a patch.
- If the component fundamentally describes block state or target position, start from `BlockProperties` or `TargetPos` instead of inventing another near-duplicate structure.

