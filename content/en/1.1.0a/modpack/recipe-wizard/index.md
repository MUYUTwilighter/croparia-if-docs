---
title: Recipe Wizard
desc: Introduces the basic use of Recipe Wizard in Croparia IF 1.1.0a, including in-game recipe generation and sneak-debug actions.
navOrder: 50
---

# Recipe Wizard

The Recipe Wizard is a utility item added by Croparia IF so that modpack authors can quickly create recipes and other data directly in-game. It also includes a few debugging actions.

## Usage: generate recipes

Right-click a target block to trigger a recipe generation attempt. If required inputs are missing, the item will show the corresponding prompt.

Currently supported targets and parameter sources:

- [Infusor](../../general/blocks-and-items/workstations.md#croparia:infusor): Elemental Infuse
  - item placed on the Infusor: input item
  - item held in the offhand: output item
  - Infusor infusion state: element type
- [Elemental Stone](../../general/blocks-and-items/workstations.md#croparia:elemental_stone): Elemental Soak
  - infusion state of the Infusor above the Elemental Stone: element type
  - blocks around the Elemental Stone: input block
  - block below the Elemental Stone: output block
- [Ritual Stand](../../general/blocks-and-items/workstations.md#croparia:ritual_stand): Ritual
  - blocks occupying the ritual structure’s input positions: input blocks
  - item on the Ritual Stand: input item
  - item held in the offhand: output item

**Note**: the Recipe Wizard can be customized. See [Creating Custom Recipe Wizard Generators](custom-usage.md).

## Usage: debug actions

Sneak-right-clicking a target block with the Recipe Wizard can trigger additional behaviors.

- [Infusor](../../general/blocks-and-items/workstations.md#croparia:infusor): toggle the Infusor’s infusion state
- [Elemental Stone](../../general/blocks-and-items/workstations.md#croparia:elemental_stone): create an [Infusor](../../general/blocks-and-items/workstations.md#croparia:infusor) above the Elemental Stone
- [Ritual Stand](../../general/blocks-and-items/workstations.md#croparia:ritual_stand): generate the corresponding ritual structure centered on the Ritual Stand

