---
title: Relics
desc: Lists the utility relic items in Croparia IF 1.1.0a, including Magic Rope, Horn of Plenty, Midas Hand, and Infinite Apple.
navOrder: 30
---

# Relics

Relics are a group of utility items with a wide range of effects.

<a id='croparia:magic_rope'></a>

## Magic Rope

<div class="doc-center">
<GameItemCard id='croparia:magic_rope'></GameItemCard>
</div>

The Magic Rope teleports the player to a stored position.

While holding it, sneak-right-click the ground to bind a position. Afterwards, right-click with the bound rope to trigger the teleport.

### Recipe

<div class="doc-center">
<RecipeDisplay id="croparia:ritual/relic/horn_plenty"></RecipeDisplay>
</div>

<a id='croparia:horn_plenty'></a>

## Horn of Plenty

<div class="doc-center">
<GameItemCard id='croparia:horn_plenty'></GameItemCard>
</div>

Holding right-click consumes experience to summon any food item. The XP cost equals the hunger value of the summoned food.

Foods that cannot be summoned are controlled by the `#croparia:horn_plenty_blacklist` tag.

### Recipe

<div class="doc-center">
<RecipeDisplay id="croparia:ritual/relic/magic_rope"></RecipeDisplay>
</div>

<a id='croparia:midas_hand'></a>

## Midas Hand

<div class="doc-center">
<GameItemCard id='croparia:midas_hand'></GameItemCard>
</div>

The Midas Hand can turn blocks into Gold Ingots, or entities into Gold Blocks.

When used on a block, it consumes 10 XP, breaks the block, creates one dropped Gold Ingot, and applies a cooldown based on the block’s hardness. Blocks that are immune are defined by the `#croparia:midas_hand_immune` tag; using the item on one of those blocks summons lightning on the player.

When used on an entity, it removes that entity and creates a Gold Block at its position. For hostile mobs, it costs twice their health in XP and adds a cooldown of 400 game ticks. For other mobs, it costs XP equal to their health and adds a cooldown of 200 game ticks. Immune entities are defined by the `#croparia:midas_hand_immune` tag; using the item on one of them summons lightning on that entity instead.

### Recipe

<div class="doc-center">
<RecipeDisplay id="croparia:ritual/relic/midas_hand"></RecipeDisplay>
</div>

<a id='croparia:infinite_apple'></a>

## Infinite Apple

<div class="doc-center">
<GameItemCard id='croparia:infinite_apple'></GameItemCard>
</div>

A food item that is never consumed. Each use grants 5 seconds of potion effects equivalent to an Enchanted Golden Apple, with a cooldown of 200 game ticks.

### Recipe

<div class="doc-center">
<RecipeDisplay id="croparia:ritual/relic/infinite_apple"></RecipeDisplay>
</div>
