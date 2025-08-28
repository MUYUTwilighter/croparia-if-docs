# Fruit Appearance

Three types of resource file are involved to define a fruit appearance:
- Item Model
- Item Texture

## Example: Modify `croparia:fruit_netherite`

### 1. Locate item model file

The crop name for `croparia:fruit_netherite` is `netherite`, which is the trailing string after `...fruit_`.
Thus, the block state definition path is `.../assets/croparia/models/item/fruit_netherite.json`.

### 2. Write item model content (Item Texture Usage)

The default item model for fruit is like this:
```json
{
  "parent": "minecraft:item/generated",
  "textures": {
    "layer0": "croparia:item/fruit_crop",
    "layer1": "croparia:item/fruit_crop_overlay"
  }
}
```
The keys like `layer0` represent the layers of the textures.
If you want to use different texture for a specific layer, modify the value of `layer0`, which is `croparia:item/...` to your desired one.

The available alternative textures are as follows:
- `croparia:fruit_animal`
- `croparia:fruit_animal_overlay`
- `croparia:fruit_crop`
- `croparia:fruit_crop_overlay`
- `croparia:fruit_elemental`: Note that elemental does not have corresponding overlay
- `croparia:fruit_food`
- `croparia:fruit_food_overlay`
- `croparia:fruit_monster`
- `croparia:fruit_monster_overlay`
- `croparia:fruit_nature`
- `croparia:fruit_nature_overlay`