# Seed Appearance

Three types of resource file are involved to define a seed appearance:
- Item Model
- Item Texture

## Example: Modify `croparia:seed_crop_netherite`

### 1. Locate item model file

The crop name for `croparia:seed_crop_netherite` is `netherite`, which is the trailing string after `...seed_crop_`.
Thus, the block state definition path is `.../assets/croparia/models/item/seed_crop_netherite.json`.

### 2. Write item model content (Item Texture Usage)

The default item model for seed is like this:
```json
{
  "parent": "minecraft:item/generated",
  "textures": {
    "layer0": "croparia:item/seed_crop"
  }
}
```
The keys like `layer0` represent the layers of the textures.
If you want to use different texture for a specific layer, modify the value of `layer0`, which is `croparia:item/...` to your desired one.

There are no other presets for seeds.