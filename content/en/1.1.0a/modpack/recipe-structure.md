---
title: Recipes and Structures
desc: Introduces the data formats, field meanings, and writing examples for Infusor, Ritual, Soak, and Ritual Structure in Croparia IF 1.1.0a.
keywords:
  - Croparia IF
  - 1.1.0a
  - modpack
  - recipes
  - structures
  - infusor
  - ritual
  - soak
  - ritual_structure
  - ritual structure
navOrder: 30
---

# Recipes and Structures

At the moment, the four core data types most relevant to Croparia IF modpack authors are:

- `croparia:infusor`
- `croparia:ritual`
- `croparia:soak`
- `croparia:ritual_structure`

This page explains how these recipes and structures are written. If you need to generate data in bulk, continue with the [Runtime Data Generation System](./generator/index.md) and [Create a Data Generator](./generator/create-generator.md).

<a id="entry-shapes"></a>

## Shared Input and Output Forms

These recipe types heavily reuse `ItemInput`, `ItemOutput`, `BlockInput`, and `BlockOutput`. In most cases they support both a shorthand form and an object form.

<a id="item-input"></a>

### Item Input `ItemInput`

Shorthand:

- Item ID string: `"minecraft:comparator"`
- Tag string: `"#croparia:seed_ingredient"`

Object form:

```json
{
  "id": "minecraft:comparator",
  "amount": 1,
  "components": {}
}
```

- `id: string` matches one specific item ID
- `tag: string` matches an item tag
- `components: Map<String, T>` optional item components
- `amount: number` optional item count, defaults to 1

`id` and `tag` cannot be specified at the same time.

<a id="item-output"></a>

### Item Output `ItemOutput`

Shorthand:

- Item ID string: `"croparia:croparia"`

Object form:

```json
{
  "id": "croparia:croparia",
  "amount": 1,
  "components": {}
}
```

- `id: string` matches one specific item ID
- `components: Map<String, T>` optional item components
- `amount: number` optional item count, defaults to 1

<a id="block-input"></a>

### Block Input `BlockInput`

Shorthand:

- Block ID string: `"minecraft:sculk"`
- Tag string: `"#croparia:ritual_stands"`

Object form:

```json
{
  "id": "croparia:block_crop_coal",
  "properties": {
    "age": "7"
  }
}
```

- `id: string` matches one specific block ID
- `tag: string` matches a block tag
- `properties: Map<String, string>` optional state restrictions

`id` and `tag` cannot be specified at the same time.

<a id="block-output"></a>

### Block Output `BlockOutput`

Shorthand:

- Block ID string: `"minecraft:end_stone"`

Object form:

```json
{
  "id": "minecraft:oak_log",
  "properties": {
    "axis": "y"
  }
}
```

- `id: string` matches one specific block ID
- `properties: Map<String, string>` optional output block states

<a id="infusor"></a>

## Infusor Recipe `croparia:infusor`

- `element: string` requires the Infusor to currently contain that element and cannot be `empty`
- `ingredient: [ItemInput](#item-input)` the item input to drop onto or place into the Infusor
- `result: [ItemOutput](#item-output)` the item output produced on success

Example:

```json
{
  "type": "croparia:infusor",
  "element": "elemental",
  "ingredient": {
    "tag": "croparia:seed_ingredient",
    "amount": 4
  },
  "result": {
    "id": "croparia:croparia",
    "amount": 1
  }
}
```

<a id="ritual"></a>

## Ritual Recipe `croparia:ritual`

- `ritual: string` required tier or tag of the center Ritual Stand
- `block: [BlockInput](#block-input)` input block that must be placed at the `$` positions in the structure
- `ingredient: [ItemInput](#item-input)` input item to drop onto or place into the Ritual Stand
- `result: [ItemOutput](#item-output)` output item produced when the recipe succeeds

Minimal example:

```json
{
  "type": "croparia:ritual",
  "ritual": "#croparia:ritual_stands",
  "ingredient": "minecraft:comparator",
  "block": "minecraft:sculk",
  "result": "minecraft:sculk_sensor"
}
```

Two details matter here:

- `ritual` does not describe the whole structure; it only describes the center Ritual Stand itself
- The actual multiblock shape is defined by the [Ritual Structure](#ritual-structure)

In other words, a `RitualRecipe` can only work when the corresponding `RitualStructure` also validates successfully.

<a id="soak"></a>

## Elemental Soak Recipe `croparia:soak`

- `element: string` current element of the Infusor above, and it cannot be `empty`
- `probability: [number](./generator/placeholder.md#number)` success chance of this soak attempt, as a decimal from 0 to 1
- `input: [BlockInput](#block-input)` input block being soaked
- `output: [BlockOutput](#block-output)` output block to turn into on success

Example:

```json
{
  "type": "croparia:soak",
  "element": "air",
  "input": "minecraft:stone",
  "output": "minecraft:end_stone",
  "probability": 1.0
}
```

The real number of attempts is also affected by the `soakAttempts` configuration entry, so you may want to tune it together with [Configuration and Commands](./configuration-command.md#config-file).

<a id="ritual-structure"></a>

## Ritual Structure `croparia:ritual_structure`

`RitualStructure` is not a recipe. It is the multiblock structure definition used by Ritual Stands. Its fields are:

- `ritual: string` indicates which center Ritual Stand type this structure belongs to
- `keys: Map<String, BlockInput>` defines what each character in `pattern` means
- `pattern: string[][]` a 3D character structure that must contain at least one `*` and one `$`

Reserved characters in `keys` cannot be mapped directly:

- `*`: the center Ritual Stand position, which must match the current `ritual`
- `$`: input block positions; when the ritual runs, those blocks are checked and destroyed on success
- `.`: means air only
- ` `: means any block

`pattern` is structured as follows:

- Outermost layer: list of layers from bottom to top
- Inside each layer: a two-dimensional row-based character pattern
- Each character: the block requirement at that position

Built-in example:

```json
{
  "type": "croparia:ritual_structure",
  "ritual": "croparia:ritual_stand",
  "keys": {
    "A": "minecraft:andesite",
    "D": "minecraft:diorite",
    "I": {
      "id": "croparia:block_crop_coal",
      "properties": {
        "age": "7"
      }
    }
  },
  "pattern": [
    [
      "         ",
      "    $    ",
      "   $ $   ",
      "    $    ",
      "         "
    ],
    [
      "   D D   ",
      "D  I I  D",
      " G  *  G ",
      "D  I I  D",
      "   D D   "
    ]
  ]
}
```
