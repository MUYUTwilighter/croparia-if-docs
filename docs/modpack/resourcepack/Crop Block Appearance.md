# Crop Block Appearance

Three types of resource file are involved to define a crop block appearance:
- Block State Definition: Map the block state properties to block model
- Block Model: The model of a block with textures, Croparia IF provides block models presets.
- Textures: The textures for layers, Croparia IF provide texture presets.

## Example: Modify `croparia:block_crop_netherite`

### 1. Locate block state definition path

The crop name for `croparia:block_crop_netherite` is `netherite`, which is the trailing string after `...block_crop_`.
Thus, the block state definition path is `.../assets/croparia/blockstates/block_crop_netherite.json`.

### 2. Write block state definition (make use of block model)

The default definition for crop block should be like this:
```json
{
  "variants": {
    "age=0": {
      "model": "croparia:block/crop_stage0"
    },
    "age=1": {
      "model": "croparia:block/crop_stage1"
    },
    "age=2": {
      "model": "croparia:block/crop_stage2"
    },
    "age=3": {
      "model": "croparia:block/crop_stage3"
    },
    "age=4": {
      "model": "croparia:block/crop_stage4"
    },
    "age=5": {
      "model": "croparia:block/crop_stage5"
    },
    "age=6": {
      "model": "croparia:block/crop_stage6"
    },
    "age=7": {
      "model": "croparia:block/crop_stage7"
    }
  }
}
```
The keys like `age=0` represent the age of the crop block.
If you want to use different model for a specific age, modify the value of `model`, which is `croparia:block/...` to your desired one.

The available alternative models are as follows:
- `croparia:block/crop_stage0`
- `croparia:block/crop_stage1`
- `croparia:block/crop_stage2`
- `croparia:block/crop_stage3`
- `croparia:block/crop_stage4`
- `croparia:block/crop_stage5`
- `croparia:block/crop_stage6`
- `croparia:block/crop_stage7`
- `croparia:block/animal_stage5`
- `croparia:block/animal_stage6`
- `croparia:block/animal_stage7`
- `croparia:block/elemental_stage5`
- `croparia:block/elemental_stage6`
- `croparia:block/elemental_stage7`
- `croparia:block/food_stage5`
- `croparia:block/food_stage6`
- `croparia:block/food_stage7`
- `croparia:block/monster_stage5`
- `croparia:block/monster_stage6`
- `croparia:block/monster_stage7`
- `croparia:block/nature_stage5`
- `croparia:block/nature_stage6`
- `croparia:block/nature_stage7`

### 3. [Optional] Customize block model

The way to create your own block model is the same way as Minecraft.
Here we introduce some textures presets that might be useful.
- `croparia:crop_stage_0`
- `croparia:crop_stage_1`
- `croparia:crop_stage_2`
- `croparia:crop_stage_3`
- `croparia:crop_stage_4`
- `croparia:crop_stage_5`
- `croparia:crop_stage_6`
- `croparia:crop_stage_7`
- `croparia:crop_stage_5_overlay`
- `croparia:crop_stage_6_overlay`
- `croparia:crop_stage_7_overlay`
- `croparia:animal_stage_5`
- `croparia:animal_stage_6`
- `croparia:animal_stage_7`
- `croparia:animal_stage_5_overlay`
- `croparia:animal_stage_6_overlay`
- `croparia:animal_stage_7_overlay`
- `croparia:elemental_stage_5`
- `croparia:elemental_stage_6`
- `croparia:elemental_stage_7`
- `croparia:elemental_stage_5_overlay`
- `croparia:elemental_stage_6_overlay`
- `croparia:elemental_stage_7_overlay`
- `croparia:food_stage_5`
- `croparia:food_stage_6`
- `croparia:food_stage_7`
- `croparia:food_stage_5_overlay`
- `croparia:food_stage_6_overlay`
- `croparia:food_stage_7_overlay`
- `croparia:monster_stage_5`
- `croparia:monster_stage_6`
- `croparia:monster_stage_7`
- `croparia:monster_stage_5_overlay`
- `croparia:monster_stage_6_overlay`
- `croparia:monster_stage_7_overlay`
- `croparia:nature_stage_5`
- `croparia:nature_stage_6`
- `croparia:nature_stage_7`
- `croparia:nature_stage_5_overlay`
- `croparia:nature_stage_6_overlay`
- `croparia:nature_stage_7_overlay`