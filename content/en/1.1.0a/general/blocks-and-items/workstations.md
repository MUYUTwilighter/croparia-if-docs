---
title: Workstations
desc: Introduces the main workstation blocks in Croparia IF 1.1.0a, including the Greenhouse, Infusor, Elemental Stone, Crop Transmuter, and Ritual Stand.
navOrder: 20
---

# Workstations

<a id='croparia:greenhouse'></a>

## Greenhouse

<div class="doc-center">
<GameItemCard id='croparia:greenhouse'></GameItemCard>
</div>

Provides light level 8, opens a 3x3 storage when right-clicked, and supports storage interaction.

The Greenhouse should be placed on top of one-block-high crops. After it detects a block update, it performs one automatic harvest. Each harvest automatically **consumes 1 seed**. Harvested items are stored inside the Greenhouse inventory.

It can also harvest vine crops such as pumpkins and melons automatically, but those crops still need one adjacent block of free growth space.

### Recipe

<div class="doc-center">
<RecipeDisplay id="croparia:crafting/greenhouse"></RecipeDisplay>
</div>

<a id='croparia:infusor'></a>

## Infusor

<div class="doc-center">
<GameItemCard id='croparia:infusor'></GameItemCard>
</div>

A workstation that crafts items by applying an element to the item placed on top of it.

Right-click an empty Infusor with any [Elemental Potion](../concepts/element.md#potion) to infuse it. Right-click an infused Infusor with an empty bottle to extract the element again. A dispenser facing the Infusor can also perform those interactions when activated.

Right-click the Infusor with an item in hand to place one item on it. If the Infusor is weakly powered, it will place a full stack instead. A dropper facing the Infusor can also place one item onto it when triggered.

When crafting is triggered, the Infusor tries to insert the result into the player who provided the item, then into the container block below it. If neither target is available, it spawns the result as a dropped item above itself.

### Recipe

<div class="doc-center">
<RecipeDisplay id="croparia:crafting/infusor"></RecipeDisplay>
</div>

### Usage

Use an [Elemental Potion](../concepts/element.md#potion) on the Infusor to infuse it, then drop an item onto it to trigger the recipe.

You can inspect recipes through your item browser. For example:

<div class="doc-center">
<RecipeDisplay id="croparia:infusor/croparia"></RecipeDisplay>
</div>

### Debug

While sneaking, use the [Recipe Wizard](./others.md#croparia:recipe_wizard) on the Infusor to cycle its infused element state.

<a id='croparia:elemental_stone'></a>

## Elemental Stone

<div class="doc-center">
<GameItemCard id='croparia:elemental_stone'></GameItemCard>
</div>

A craftable decorative block. It can be combined with the [Infusor](#croparia:infusor) to perform Elemental Soak.

### Recipe

<div class="doc-center">
<RecipeDisplay id="croparia:infusor/elemental_stone"></RecipeDisplay>
</div>

### Usage (Elemental Soak)

Place an [Infusor](#croparia:infusor) above the Elemental Stone and infuse it with an element. Elemental Soak then affects blocks in the 3 x 3 area on the same horizontal layer centered on the Elemental Stone.

You can inspect recipes through your item browser. For example:

<div class="doc-center">
<RecipeDisplay id="croparia:soak/soul_sand"></RecipeDisplay>
</div>

### Debug

While sneaking, use the [Recipe Wizard](./others.md#croparia:recipe_wizard) on the Elemental Stone to spawn an [Infusor](#croparia:infusor) above it.

<a id='croparia:crop_transmuter'></a>

## Crop Transmuter

<div class="doc-center">
<GameItemCard id='croparia:crop_transmuter'></GameItemCard>
</div>

The Crop Transmuter converts crop fruits into **specific material items**. It has block-entity storage and opens its GUI when right-clicked.

### Recipe

<div class="doc-center">
<RecipeDisplay id="croparia:crafting/crop_transmuter"></RecipeDisplay>
</div>

### Usage

![Crop Transmuter GUI](/assets/crop_transmuter_example.webp)

Right-click to open the GUI. Put crop fruit into the left slot, choose the desired output material in the middle, and collect the result from the right output slot. Conversion speed is one operation per game tick.

The `R+` indicator in the top-right means it only works **when powered by redstone**. Clicking it switches the mode to only work **when not powered** (`R-`).

<a id='croparia:ritual_stand'></a>

## Ritual Stand

<RowGallery>
<GameItemCard id='croparia:ritual_stand'></GameItemCard>
<GameItemCard id='croparia:ritual_stand_2'></GameItemCard>
<GameItemCard id='croparia:ritual_stand_3'></GameItemCard>
</RowGallery>

The Ritual Stand is the core block of **Rituals**. After building a ritual structure, placing the correct input blocks, and dropping the input item onto the stand, you trigger a ritual. Rituals can craft new items, enchant existing ones, or summon mobs.

Right-click the Ritual Stand with an item in hand to place one item on it. If the stand is weakly powered, it places a full stack instead. A dropper facing the stand can also place one item onto it when triggered.

### Recipe

<RowGallery>
<RecipeDisplay id="croparia:crafting/ritual_stand"></RecipeDisplay>
<RecipeDisplay id="croparia:crafting/ritual_stand_2"></RecipeDisplay>
<RecipeDisplay id="croparia:crafting/ritual_stand_3"></RecipeDisplay>
</RowGallery>

### Usage

First, build the ritual structure that matches the Ritual Stand tier. Higher-tier ritual structures can also be used for lower-tier rituals. You can inspect them in your item browser:

<RowGallery>
<RecipeDisplay id="croparia:ritual_stand"></RecipeDisplay>
<RecipeDisplay id="croparia:ritual_stand_2"></RecipeDisplay>
<RecipeDisplay id="croparia:ritual_stand_3"></RecipeDisplay>
</RowGallery>

In the structure preview above, `Input Block` marks the positions where ritual input blocks must be placed. Once the correct blocks are placed and the input item is dropped onto the Ritual Stand, the ritual is triggered.

If the result is an Enchanted Book, the ritual applies enchantments to the input item. The book’s enchantments and levels indicate the available enchantments and their maximum levels, while the book count indicates how many levels are added per ritual.

If the result is a Spawn Egg, the ritual summons the corresponding mob.

### Debug

While sneaking, use the [Recipe Wizard](./others.md#croparia:recipe_wizard) on the Ritual Stand to generate the corresponding ritual structure centered on it.

