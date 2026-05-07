---
title: Create Custom Recipe Wizard Generators
desc: Introduces the directories, fields, extension placeholders, and actual writing workflow of custom Recipe Wizard generators in Croparia IF 1.1.0a.
keywords:
  - Croparia IF
  - 1.1.0a
  - Recipe Wizard
  - custom recipe wizard generators
  - recipe_wizard
  - generator
  - placeholder
  - template
  - TOML
  - CDG
navOrder: 10
---

# Create Custom Recipe Wizard Generators

Customizing the Recipe Wizard essentially means adding new rules that answer: “when the player right-clicks this target block, how should a file be generated from the current in-world context?”

It is very close to the [Runtime Data Generation System](../generator/index.md):

- the target block match acts like “when to trigger”
- `path` decides where the generated file is written
- `template` decides what the file content looks like
- placeholders extract values from the current click context

The main difference from a normal [data generator](../generator/create-generator.md) is that the input here is not a static [entry set](../generator/index.md#entry-registry), but the `UseOnContext` from the player’s current right-click.

<a id="location"></a>

## Location

Recipe Wizard generator files are stored at:

```text
<filePath>/recipe_wizard/generators
```

Here, `filePath` is the custom file root from [Configuration and Commands](../configuration-command.md#config-file).

This path is hardcoded in the source. Note that the directory name is `generators`, not `generator`.

When the Recipe Wizard first reads this directory, it also exports built-in templates there as editable starting points.

<a id="format"></a>

## File Formats

`RecipeWizardGenerator.read(...)` ultimately reads files through `DgReader`, so it supports the same formats as normal generators:

- `toml`
- `json`
- `cdg`

The built-in templates currently use `toml`, and that is also the most suitable format for handwritten files.

Minimal example:

```toml
block = "croparia:infusor"
path = "example/infusor_${datetime}.json"
extensions = "croparia:infusor"
template = """
{
  "type": "croparia:infusor",
  "element": "${infusor_element}",
  "ingredient": ${item._qis},
  "result": ${off_hand._qis}
}
"""
```

<a id="fields"></a>

## Full Field List

The fields of `RecipeWizardGenerator` come from the `CODEC` in the source code:

- `enabled: boolean`
- `dependencies: Dependencies`
- `block: BlockInput`
- `path: Template`
- `extensions: ResourceLocation | ResourceLocation[]`
- `template: Template`

The sections below explain them one by one.

<a id="enabled"></a>

### `enabled`

- Type: `boolean`
- Optional, defaults to `true`

Controls whether this Recipe Wizard generator is enabled. If disabled, the file is still read, but it does not enter the list of available templates.

<a id="dependencies"></a>

### `dependencies`

- Type: dependency object
- Optional, defaults to empty

It behaves the same way as dependency checks elsewhere in the docs: the generator file only loads when its dependencies are satisfied.

If the dependencies are not satisfied, the source code skips the file directly rather than throwing an error and continuing to use it.

<a id="block"></a>

### `block`

- Type: [BlockInput](../recipe-structure.md#block-input)
- Required

Determines which target blocks this generator applies to.

The generator only triggers when the block state right-clicked by the player matches `block`.

Example:

```toml
block = "croparia:infusor"
block = "#croparia:ritual_stands"
```

<a id="path"></a>

### `path`

- Type: `Template`
- Required

The relative output path under the `recipeWizard` export directory.

For example:

```toml
path = "croparia/ritual_${datetime}.json"
```

If the configured `recipeWizard` directory is `D:/packs/croparia/recipe_wizard/output`, the final output becomes:

```text
D:/packs/croparia/recipe_wizard/output/croparia/ritual_2026-04-06_12.30.00.json
```

`path` is itself a template, so it can use any placeholders introduced later on this page.

<a id="extensions"></a>

### `extensions`

- Type: `string` or `string[]`
- Optional, defaults to an empty list

These are not plain strings. They are IDs of extension placeholder groups. The source currently registers:

- `croparia:infusor`
- `croparia:ritual`
- `croparia:soak`
- `minecraft:furnace`

The `default` group is always enabled automatically and does not need to be written manually.

If you want to use placeholders from one of these groups, you must list it in `extensions`. For example:

```toml
extensions = "croparia:ritual"
```

or:

```toml
extensions = [
  "croparia:ritual",
  "minecraft:furnace"
]
```

<a id="template"></a>

### `template`

- Type: `Template`
- Required

The final file content to write, usually a JSON template.

Its placeholders are resolved at click time, then the resolved result is written to disk.

Example:

```toml
template = """
{
  "type": "croparia:soak",
  "element": "${soak_element}",
  "input": ${neighbor._qis},
  "output": ${below._qis},
  "probability": 1.0
}
"""
```

The template syntax itself matches the [Placeholder Parsers](../generator/placeholder.md).

<a id="default-placeholders"></a>

## Default Placeholders

Whether or not you list anything in `extensions`, the `default` placeholder group is always enabled.

These placeholders all come from the `UseOnContext` of the click event.

- `${datetime}`
  - current timestamp, formatted as `yyyy-MM-dd_HH.mm.ss`
- `${main_hand}`
  - main-hand item, with a type equivalent to `ItemOutput`
- `${off_hand}`
  - off-hand item, with a type equivalent to `ItemOutput`
- `${item}`
  - dropped item at the clicked position, with a type equivalent to `ItemOutput`
- `${block}`
  - block currently being clicked, with a type equivalent to `BlockOutput`
- `${neighbor}`
  - any non-air neighboring block, with a type equivalent to `BlockOutput`
- `${below}`
  - block below, with a type equivalent to `BlockOutput`

`block` also has several common subpaths:

- `${block.facing}`: the block in front of the clicked face
- `${block.opposite}`: the block behind the clicked face
- `${block.left}`: the block to the clockwise side of the clicked face
- `${block.right}`: the block to the counter-clockwise side of the clicked face
- `${block.offset(x,y,z)}`: a block offset relative to the clicked position

Most of these are structured types, so in practice they are usually used with `_qis`, just like the built-in templates:

```toml
${item._qis}
${block._qis}
${neighbor._qis}
```

If the required context is missing, such as no main-hand item or no dropped item at the target position, the source code immediately shows an overlay prompt and aborts generation.

<a id="extension-placeholders"></a>

## Extension Placeholders

`extensions` decides which extra domain-specific placeholders are enabled.

### `croparia:infusor`

- `${infusor_element}`

Requires the clicked target to be an infused [Infusor](../../general/blocks-and-items/workstations.md#croparia:infusor). If the element is empty, the player is prompted to infuse the Infusor first.

### `croparia:ritual`

- `${ritual_input}`

Requires the clicked target to be a [Ritual Stand](../../general/blocks-and-items/workstations.md#croparia:ritual_stand), and the current structure must correctly identify the input block positions. This placeholder returns the input block at the `$` positions of the ritual structure.

### `croparia:soak`

- `${soak_element}`

Requires the clicked target to be an Elemental Stone with an infused Infusor above it. The returned value is the name of the current soak element.

### `minecraft:furnace`

- `${furnace_input}`
- `${furnace_time}`

This group is meant for furnace-like blocks:

- `furnace_input` reads the input-slot item
- `furnace_time` reads the total burn time of the current fuel

If the target is not a furnace, or if the input or fuel slot is empty, the item will also show a prompt and abort generation.

<a id="builtin-examples"></a>

## Built-in Template Examples

The built-in `1.1.0a` templates include three files, and they also reflect the most typical writing patterns.

### Infusor Recipe

```toml
path = "croparia/infusor_${datetime}.json"
extensions = "croparia:infusor"
block = "croparia:infusor"
template = """
{
  "type": "croparia:infusor",
  "element": "${infusor_element}",
  "ingredient": ${item._qis},
  "result": ${off_hand._qis}
}
"""
```

### Ritual Recipe

```toml
path = "croparia/ritual_${datetime}.json"
extensions = "croparia:ritual"
block = "#croparia:ritual_stands"
template = """
{
  "type": "croparia:ritual",
  "ritual": ${block._qis},
  "ingredient": ${item._qis},
  "block": ${ritual_input._qis},
  "result": ${off_hand._qis}
}
"""
```

### Soak Recipe

```toml
path = "croparia/soak_${datetime}.json"
extensions = "croparia:soak"
block = "croparia:elemental_stone"
template = """
{
  "type": "croparia:soak",
  "element": "${soak_element}",
  "input": ${neighbor._qis},
  "output": ${below._qis},
  "probability": 1.0
}
"""
```

The two details most worth noticing here are:

- `block` decides “when to trigger”, not which input block should appear in the generated result
- when writing JSON, structured values such as `ItemOutput` and `BlockOutput` usually need `_qis` so they become text that can be embedded directly into JSON

<a id="tips"></a>

## Recommendations

- When customizing one for the first time, copying and editing a built-in template is more reliable than starting from scratch.
- It is best for `path` to include `${datetime}`, so repeated clicks do not overwrite older files.
- If a template depends on multiple special contexts, make sure every matching `extensions` group has been listed.
- Target block matching only depends on `block`, not on which placeholders appear inside the template.
- The generated content is usually still a JSON recipe file, so after generation you can continue validating fields against [Recipes and Structures](../recipe-structure.md).
