---
title: Custom Crops
desc: Introduces the basic approach to custom fruit crops and melon crops in Croparia IF 1.1.0a, including command-based creation, handwritten JSON fields, and the KubeJS extension route.
keywords:
  - Croparia IF
  - 1.1.0a
  - modpack
  - custom crops
  - fruit crop
  - melon crop
  - crop
  - melon
  - JSON
  - KubeJS
  - commands
navOrder: 20
---

# Custom Crops

Croparia IF lets modpack authors define two extra kinds of crops:

- `Fruit crops`: mature into fruit items and correspond to `Crop`
- `Melon crops`: grow fruit blocks like pumpkins or melons and correspond to `Melon`

Both kinds of custom content are loaded from the configured custom data directories:

- Fruit crops: `<filePath>/crops`
- Melon crops: `<filePath>/melons`

Here, `filePath` is the custom file root configured in [Configuration and Commands](./configuration-command.md#config-file). Each JSON file is read as one crop definition.

Crops are only registered during game startup, so any change to a crop definition requires a full game restart before it takes effect.

If you only want a quick starting point, the easiest route is to export a template file with commands first. If you plan to maintain a pack long-term, writing JSON by hand is still the better option.

<a id="command-create"></a>

## Quick Creation with Commands

Command-based creation is best for generating an editable starting JSON quickly. In practice it writes a definition file to disk; it does not hot-load a new crop into the current instance immediately.

### Fruit Crops

Command format:

```text
/croparia|cropariaServer crop create <color> [type] [id] [force]
```

- If `id` is omitted, it defaults to the path of the main-hand item and is forced into a non-`minecraft` namespace
- If `type` is omitted, it defaults to `crop`
- If a definition with the same name already exists, it will not be overwritten unless you add `force`

The command reads two pieces of context when creating the file:

- Main-hand item: used as `material`
- Off-hand Croparia: its tier is used as `tier`

### Melon Crops

Command format:

```text
/croparia|cropariaServer melon create <color> [id] [force]
```

Compared with fruit crops:

- It does not need `type`
- The main-hand item must be a block item, because it is parsed as the block material of the melon crop

<a id="manual-files"></a>

## Writing Files by Hand

If you need finer control, you will want to write the crop definition files manually.

<a id="crop-json"></a>

## Fruit Crop Files

Full example:

```json
{
  "id": "kubejs:tin",
  "material": {
    "name": "#c:ingots/tin",
    "count": 2
  },
  "color": "#E3E3E0",
  "tier": 2,
  "type": "crop",
  "translations": {
    "en_us": "Tin",
    "zh_cn": "锡"
  },
  "dependencies": {
    "techreborn": "item.techreborn.tin_ingot",
    "modern_industrialization": "item.modern_industrialization.tin_ingot"
  }
}
```

<a id="crop-fields"></a>

### Full Field List

- `id`: `string`
  - Resource location of the crop, for example `kubejs:tin`
  - Determines the derived IDs of the seed, fruit, and crop block
- `material`: `ItemMaterial`
  - Material associated with this crop
  - Can be written as an item ID or a tag string beginning with `#`
  - The amount is optional and defaults to 2
- `color`: `Color`
  - Primary crop color
  - Supports `#RRGGBB`, `0xRRGGBB`, and decimal integers
- `tier`: `number`
  - Croparia tier
- `type`: `string`
  - Optional, defaults to `crop`
  - Mainly decides which fruit texture template is used
  - Common built-in values include `animal`, `crop`, `food`, `monster`, and `nature`
- `translations`: `Map<String, string>`
  - Optional multilingual display names
  - At minimum, adding `zh_cn` is strongly recommended
- `dependencies`: `string | Map<String, string>`
  - Optional dependency and translation-key mapping
  - Used to express that the crop should only load when a given mod exists, and which translation key should be used in that case

<a id="item-material"></a>

### Object Form of `material`: `ItemMaterial`

Besides a plain string, `material` can also be written as an object:

```json
{
  "name": "#c:ingots/tin",
  "count": 2
}
```

If all you need is a normal item or tag, a plain string is enough. You only need the object form when you want to customize the amount or add extra components.

<a id="melon-json"></a>

## Melon Crop Files

Full example:

```json
{
  "id": "kubejs:tin_block",
  "material": {
    "name": "#c:storage_blocks/tin",
    "count": 2
  },
  "color": "#E3E3E0",
  "tier": 2,
  "translations": {
    "en_us": "Tin Block",
    "zh_cn": "锡块"
  },
  "dependencies": {
    "modern_industrialization": "block.modern_industrialization.tin_block"
  }
}
```

<a id="melon-fields"></a>

### Full Field List

- `id`: `string`
  - Resource location of the melon crop
  - Derives objects such as `melon`, `melon_item`, `stem`, `attach`, and `seed`
- `material`: `BlockMaterial`
  - Block material associated with this melon crop
  - Can be written as a block ID or a block tag
  - The amount is optional and defaults to 2
- `color`: `Color`
  - Uses the same color formats as fruit crops
- `tier`: `number`
  - Croparia tier
- `translations`: `Map<String, string>`
  - Optional multilingual display names
- `dependencies`: `string | Map<String, string>`
  - Optional dependency and translation-key mapping

<a id="kubejs"></a>

## KubeJS Route

If you want to register fruit crops dynamically from scripts, you can also use the KubeJS extension entrypoint.

The source signature is roughly:

```java
CropUtil.create(
  rawId,
  material,
  color,
  tier,
  type,
  rawDependencies,
  translations
)
```

Its parameters almost map one-to-one to the handwritten JSON fields:

- `rawId` maps to `id`
- `material` maps to the fruit crop `material`
- `color` is an integer color value
- `tier` maps to the tier
- `type` maps to the crop type and may be `null`
- `rawDependencies` maps to `dependencies`
- `translations` maps to `translations`

<a id="tips"></a>

## Recommendations

- When creating your first custom crop, export a template with commands first, then turn it into the final JSON by hand.
- When you need compatibility across multiple mods, prefer tags or `dependencies` mappings instead of hardcoding a translation key from one specific mod.
- Fruit crops and melon crops have similar structures, but their `material` types differ, and only fruit crops have a `type` field.
