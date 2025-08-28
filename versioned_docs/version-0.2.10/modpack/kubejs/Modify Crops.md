# KubeJS Support for modifying crops

Below is an example demonstrating how to modify existing crop properties at runtime.

Although you can use [`CropRegistry`](Add%20Crops.md) to override existing crops, such changes only apply during the initial game load because they're tied to registry operations.

**Recommended approach:**  
Create your modification script under the [`server_scripts/`](https://kubejs.com/wiki/folder-structure/server-scripts) directory to ensure your changes apply upon every reload.

### Example Script:

```js
// Load CropModifier (use java("...") in MC 1.18.2 or earlier)
const CropModifier = Java.loadClass("cool.muyucloud.croparia.kubejs.CropModifier");

// Modify existing crop properties
let success = CropModifier.modify(
  "iron",                        // Crop definition ID
  "minecraft:iron_ingot",        // Material ID (prefix with '#' for tags), or `null` to keep unchanged
  0x123456,                      // Crop color (hexadecimal), or `null` to keep unchanged
  3,                             // Crop tier, or `null` to keep unchanged
  "crop",                        // Crop type, or `null` to keep unchanged
  {},                            // Translations map, or `{}` to keep unchanged
  "item.minecraft.iron_ingot"    // Translation key, or `null` to keep unchanged
);

// Returns `true` if successful, otherwise `false`
```

---