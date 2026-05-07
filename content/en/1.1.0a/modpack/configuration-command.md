---
title: Configuration and Commands
desc: Introduces the Croparia IF 1.1.0a configuration file, server-side configuration commands, and common crop and generator query and export commands.
keywords:
  - Croparia IF
  - 1.1.0a
  - modpack
  - configuration
  - commands
  - croparia.json
  - croparia
  - cropariaServer
  - autoReload
  - override
  - filePath
  - recipeWizard
  - generator
  - dumpBuiltin
  - clearBuiltin
navOrder: 10
---

# Configuration and Commands

Croparia IF stores its configuration file at `[game directory]/config/croparia.json`. Many of these settings directly affect crop loading, generated output directories, and runtime data generation behavior, so this page is best read together with the [Runtime Data Generation System](./generator/index.md).

The mod reads its configuration when the game starts and when you enter a world, then shuts down the related runtime resources when you leave that world.

<a id="config-file"></a>

## Configuration Entries

The entries below come from the `Config` implementation in the current `1.1.0a` source code.

| Name           | Default Value                    | Description |
|----------------|----------------------------------|-------------|
| `autoReload`   | 20                               | Delay before scheduling one extra datapack reload after entering a world; values below 0 disable it |
| `override`     | true                             | Whether generated temporary data should be cleared automatically |
| `filePath`     | "croparia"                       | **Root directory for mod data files**, including temporary data, crop definitions, generator directories, and more |
| `recipeWizard` | "croparia\\recipe_wizard\\dump"  | Export directory used by the Recipe Wizard |
| `fruitUse`     | true                             | Whether fruit crops can be right-clicked on the ground to convert them into materials |
| `infusor`      | true                             | Whether elemental infusion is enabled |
| `ritual`       | true                             | Whether elemental rituals are enabled |
| `soakAttempts` | 1                                | Number of soak attempts performed when Elemental Soak is triggered; set to 0 to disable it |
| `cropYield`    | 2                                | Material output count of built-in fruit crops |
| `melonYield`   | 2                                | Material output count of built-in melon crops |
| `blacklist`    | []                               | Crop blacklist; plain values mean crop IDs, while values starting with `@` are treated as regex rules for mod namespaces |

<a id="command-roots"></a>

## Commands

Commands are split into the client command `/croparia` and the server command `/cropariaServer`.

- `/croparia`: only provides `crop`, `melon`, and `generator` commands, and only affects local client data.
- `/cropariaServer`: provides server-side `crop`, `melon`, and `generator` commands, plus commands for editing configuration entries.

<a id="crop-melon-commands"></a>

### Crop and Melon Commands

- `/croparia|cropariaServer crop|melon query [crop ID]`: query crop information. If no crop ID is given, it shows the crop information for the item in hand or the block you are pointing at.
- `/croparia|cropariaServer crop|melon dump [crop ID]`: export crop definitions into `crops/` or `melons/` under the mod data root.
- `/croparia|cropariaServer crop|melon create [...arguments]`: create a new crop definition in `crops/` or `melons/` under the mod data root.

<a id="generator-commands"></a>

### Data Generator Commands

- `/croparia|cropariaServer generator query [pack handler ID] [generator name]`: query the current state of a data generator.
- `/croparia|cropariaServer generator dumpBuiltin [pack handler ID] [generator name]`: export built-in generators into the `generator/` folder of the corresponding cache directory. If no name is given, all built-in generators are exported.
- `/croparia|cropariaServer generator clearBuiltin [pack handler ID] [generator name]`: delete exported generator files that share the same names as built-in generators. If no name is given, all matching files are removed.

If you plan to keep editing those files by hand after exporting them, continue with:

- [Create a Data Generator](./generator/create-generator.md)
- [Placeholder Parsers](./generator/placeholder.md)

<a id="config-commands"></a>

### Server Configuration Commands

- `/cropariaServer <entry>`: query the current value of one configuration entry.
- `/cropariaServer <entry> [value]`: change the value of one configuration entry.
- `/cropariaServer reset`: show a reset confirmation prompt.
- `/cropariaServer reset confirm`: reset the configuration file to its default values.

The following entries currently have matching server commands:

- `filePath`
- `recipeWizard`
- `infusor`
- `ritual`
- `fruitUse`
- `autoReload`
- `override`
- `soakAttempts`

`cropYield`, `melonYield`, and `blacklist` currently have no matching server commands and can only be edited through the configuration file.

<a id="tips"></a>

## Recommendations

- If you are debugging missing generators, unloaded crops, or unexpected export directories, check `filePath`, `override`, and `autoReload` first.
- If you want to modify built-in generators, it is usually best to export them with `generator dumpBuiltin` first, then continue with the [Runtime Data Generation System](./generator/index.md) and [Create a Data Generator](./generator/create-generator.md).
- In `blacklist`, entries starting with `@` are treated as regex rules against mod namespaces, so a careless pattern may hide more content than you expected.
