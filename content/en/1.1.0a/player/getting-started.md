---
title: Getting Started
desc: Quick start guide for Croparia IF 1.1.0a players, covering installation, Elematilius Ore, the Infusor, Croparia upgrades, and the early gameplay route.
navOrder: 1
---

# Getting Started

This page helps you install the mod and get through your first steps with it.

## Installation

1. Confirm the Minecraft version and mod loader you want to use. Supported combinations are listed in the [General docs](../general/index.md).
2. Download and install **Croparia IF**, [**Architectury API**](https://modrinth.com/mod/architectury-api/versions), and [**Fabric API**](https://modrinth.com/mod/fabric-api/versions) if you are using Fabric. You can get them from [CurseForge](https://www.curseforge.com/minecraft/mc-mods/croparia-if), [Modrinth](https://modrinth.com/mod/croparia-if), or a launcher with built-in mod downloads.
3. If you downloaded the files manually, put the `.jar` files into `[game directory]/mods` or `[game directory]/versions/[instance name]/mods` when version isolation is enabled.
4. Launch the game and enter a world.

- **Note 1**: installing an item browser such as [REI](https://modrinth.com/mod/rei/versions) or [JEI](https://modrinth.com/mod/jei/versions) is highly recommended.
- **Note 2**: this mod adds overworld ores that are essential to progression. If you join an older save that did not previously have the mod installed, you will need newly generated chunks to obtain them.

## First steps in gameplay

Croparia IF adds many new concepts and mechanics, so using [REI](https://modrinth.com/mod/rei/versions), [JEI](https://modrinth.com/mod/jei/versions), or another item browser is strongly recommended.

The mod also integrates with vanilla advancements, so following the advancement flow is a perfectly reasonable way to learn it.

### 1. Mine Elemental Gems

First, head underground and mine [Elematilius Ore](../general/blocks-and-items/others.md#elematilius_ore).

You can find it at `Y <= 80`, and in theory it becomes more common the lower you go.

<RowGallery>
<GameItemCard id="croparia:elematilius_ore"></GameItemCard>
<GameItemCard id="croparia:deepslate_elematilius_ore"></GameItemCard>
</RowGallery>

![Elematilius Ore in a cave](/assets/elematilius_in_cave.webp)

Mining it gives you [Elemental Gems](../general/concepts/element.md#gems). Around 10 to 20 is enough for an initial start.

<RowGallery>
<GameItemCard id="croparia:gem_elemental"></GameItemCard>
</RowGallery>

### 2. Craft Croparia

Back on the surface, you can begin preparing your first fruit crop seeds.

Fruit seeds use **Croparia** as their core ingredient. Start with [**Croparia**](../general/blocks-and-items/croparia.md#croparia:croparia), which requires an [**Infusor**](../general/blocks-and-items/workstations.md#croparia:infusor), an [**Elemental Potion**](../general/concepts/element.md#potion) (one Elemental Gem plus one Glass Bottle), and four seeds of any kind.

<div class="doc-center">
<RecipeDisplay id="croparia:crafting/infusor"></RecipeDisplay>
</div>

Once prepared, you can craft [**Croparia**](../general/blocks-and-items/croparia.md#croparia:croparia). Its recipe is:

<div class="doc-center">
<RecipeDisplay id="croparia:infusor/croparia"></RecipeDisplay>
</div>

In the recipe display, the [Elemental Potion](../general/concepts/element.md#potion) on the left indicates the required element type. Place the [**Infusor**](../general/blocks-and-items/workstations.md#croparia:infusor), then right-click it with an **Elemental Potion** to fill it with that element.

<RowGallery>
<img src="/assets/place_infusor.webp" alt="Placing the Infusor" style={{ height: "300px" }} />
<img src="/assets/infuse_infusor.webp" alt="Infusing the Infusor with an element" style={{ height: "300px" }} />
</RowGallery>

The seeds shown above are the consumed input item. Drop them onto the **Infusor**, or use them on it directly, to trigger **Elemental Infuse** and craft [**Croparia**](../general/blocks-and-items/croparia.md#croparia:croparia). The output is placed directly into your inventory.

![Placing items on the Infusor](/assets/infusor_place_item.webp)

After that, use your item browser to inspect what **Croparia** is used for. Once you craft fruit seeds from it, you can begin farming whichever material you want.

![Planting seeds](/assets/plant_seeds.webp)

**Tip 1**: the [Elemental Gems](../general/concepts/element.md#gems) used to make **Croparia** also have their own crops. Combined with Bone Meal, they can be a good way to mass-produce more seeds.  
**Tip 2**: you can automate Elemental Infuse with various redstone tools; see [Infusor](../general/blocks-and-items/workstations.md#croparia:infusor).

### 3. Upgrade Croparia

Higher-tier **Croparia** can craft fruit seeds for rarer materials. To upgrade it, you will need a **Tier 1 Ritual**.

Rituals are multiblock structures built around the Ritual Stand. You can inspect their structure in your item browser:

<RowGallery>
<RecipeDisplay id="croparia:ritual_stand"></RecipeDisplay>
</RowGallery>

_If the ritual structure preview in your item browser feels too abstract, create a creative-mode test world, hold the [Recipe Wizard](../general/blocks-and-items/others.md#croparia:recipe_wizard), and right-click a Ritual Stand to generate the corresponding structure in place._

The “input block” entries in the structure preview mark positions where you will later place blocks. Leave those spots empty while building.

![Completed Tier 1 Ritual structure](/assets/ritual_structure-1.webp)

Now look at the recipe for crafting an **Earth Gem**, which is required for [**Croparia T2**](../general/blocks-and-items/croparia.md#croparia:croparia2):

<RowGallery>
<RecipeDisplay id="croparia:ritual/gem/earth"></RecipeDisplay>
</RowGallery>

The Ritual Stand in the middle shows the minimum ritual tier. The Dirt Block on the left is the input block, so place it in the previously marked input block position.

![Placing ritual input blocks](/assets/ritual-place-input-block.webp)

The input item above works much like the Infusor: drop it onto the Tier 1 Ritual Stand, or use it directly on the stand, to trigger the ritual.

![Dropping the ritual input item](/assets/ritual-drop-item.webp)

_If the structure is invalid, you will see “The elematilius does not respond to the ritual”. If the structure is correct but the input blocks or items are wrong, you will see “The elematilius rejects your offerings”._

Once complete, you receive an **Earth Gem**. Combine it with a Glass Bottle to make an [**Earth Potion**](../general/concepts/element.md#potion), then use that at the [Infusor](../general/blocks-and-items/workstations.md#croparia:infusor) to upgrade Croparia.

<RowGallery>
<RecipeDisplay id="croparia:infusor/croparia2"></RecipeDisplay>
</RowGallery>

- **Note 1**: once your Ritual Stand is ready, you can also craft [**Melon**](../general/concepts/crop.md#melon) crops that produce block materials. See your item browser for details.
- **Note 2**: rituals are not limited to crafting. They can also handle enchantment upgrades and mob summoning; see [Ritual Stand](../general/blocks-and-items/workstations.md#croparia:ritual_stand).

## Next steps

- The mod also adds several interesting utility items. See [Relics](../general/blocks-and-items/relic.md).
- Struggling to obtain certain materials? Take a look at [Elemental Stone](../general/blocks-and-items/workstations.md#croparia:elemental_stone).
- Ready to automate large-scale production? See [Automation Ideas](automation.md).
- If you run into trouble, check [FAQ](faq.md).

