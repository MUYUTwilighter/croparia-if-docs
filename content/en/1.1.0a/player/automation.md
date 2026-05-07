---
title: Automation Ideas
desc: Player-facing automation notes for Croparia IF 1.1.0a, covering the Greenhouse, Botany Pots, redstone setups, and logistics-friendly interactions.
navOrder: 2
---

# Automation Examples

Croparia IF does not ship with full large-scale automation infrastructure by itself, such as pipes or autocrafters. However, some of its core blocks are designed to work with automation interfaces. This page collects a few practical ideas.

## Farming

### 1. Greenhouse

Croparia IF includes a built-in **Greenhouse** that can harvest both single-block crops and melon-style crops when placed on top of them.

<div class="doc-center">
<GameItemCard id='croparia:greenhouse'></GameItemCard>
</div>

The Greenhouse supports logistics interaction, so you can connect it to pipes from other mods for item collection.

![Greenhouse logistics interaction](/assets/greenhouse-transport.webp)

### 2. Botany Pots

Croparia IF also includes built-in compatibility with [Botany Pots](https://modrinth.com/mod/botany-pots).

![Botany Pots](/assets/botany-pots.webp)

## Elemental Infuse and Rituals

The [Infusor](../general/blocks-and-items/workstations.md#croparia:infusor) and [Ritual Stand](../general/blocks-and-items/workstations.md#croparia:ritual_stand) can interact with certain redstone devices and storage blocks. With those interactions, the Infusor can already be used for batch processing.

Here is one example setup for automating Elemental Infuse:

<RowGallery>
<img src='/assets/infusor-auto-1.webp' alt="Automated Elemental Infuse" />
<img src='/assets/infusor-auto-2.webp' alt="Automated Elemental Infuse top view" />
</RowGallery>

As shown above:

- a dispenser next to the Infusor holds [Elemental Potions](../general/concepts/element.md#potion) and fills the Infusor when activated;
- a dropper next to it holds [Croparia](../general/blocks-and-items/croparia.md#croparia:croparia) and places the input item onto the Infusor when triggered;
- a chest below the Infusor receives output items and empty Glass Bottles automatically.

This example uses the pipes and filtering tools from [Modern Dynamics](https://modrinth.com/mod/modern-dynamics) to keep the setup simple, but the same idea can also be implemented with hopper filters or similar transport solutions in other modpacks.

The trickiest part is making the dropper fire the correct number of times. In this layout, repeater delay is used to trigger the dropper twice. In some packs, you may have access to other blocks or gadgets that make this easier.

