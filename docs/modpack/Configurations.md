# Configurations

The config file is located at `.../{GameDir}/config/croparia.json`.

The properties are as follows:

- `cropPath`: Where the crop definition file is located, default `crops`
- `packPath`: Where the auto-generation folder is located, default `config/croparia`
- `dumpPath`: The path to export files, including crop definition, recipes, etc.
- `autoReload`: Auto-reload datapack on every world loaded. Default: `true`
- `override`: If true, Croparia IF will try to delete all the files under `packPath` before generating files. Default:
  `true`
- `fruitUse`: Enable fruit items to generate the material by use them on the block. Default: `true`
- `infusor`: Enable infusor functionality. Default: `true`
- `ritual`: Enable ritual stand functionality. Default: `true`
- `blacklist`: Blacklist for crop names, if a crop with name in the list, it will not be registered. You can use
  `@modid` to disable all crops derived from a specified mod. Default: `[]` (empty)

## Q&A

### Mod selector `@modid` in blacklist for crops isn't working

First, check if the entries are correctly set. It should start with `@` followed by the mod ID, not the mod name.

Then, you need to add every mod that deriving a crop you want to disable, as multiple mods might provide one material
with different items, while Croparia IF will try to add the compat-crop if only 1 mod is declared with the
compatibility.

For example, from the code given in [CompatCrops](../play/Compatible%20Materials.md), crop `aluminum` is defined by Tech Reborn, Modern Industrialization
and GregTech Modern. Then, Croparia IF will try add this crop as long as **ANY** mod mentioned above is present and not
in blacklist.

```java
@Nullable
public static final Crop ALUMINIUM = Crops.compat("aluminum", "#c:aluminum_ingots", 0xD9DCDC, 3, CropType.CROP, Map.of(
    "techreborn", "item.techreborn.aluminum_ingot",
    "modern_industrialization", "item.modern_industrialization.aluminum_ingot",
    "gtceu", "material.gtceu.aluminum"
));
```

In this case, to fully disable a crop, you may consider use the crop name directly, or use mod selector for all the mods
defined.

See also [Compatible Materials](../play/Compatible%20Materials.md).

### Limit the ability of Horn O' Plenty and Mida's Hand

If you want to configure blacklist for `croparia:horn_plenty` and `croparia:midas_hand`, use datapack to update the
corresponding tags:

- (item) `#croparia:horn_plenty_blacklist`: food that `croparia:horn_plenty` cannot summon
- (block) `#croparia:midas_hand_immune`: blocks that `croparia:midas_hand` cannot be make an effect
- (entity type) `#croparia:midas_hand_immune`: entity types that `croparia:midas_hand` cannot be make an effect