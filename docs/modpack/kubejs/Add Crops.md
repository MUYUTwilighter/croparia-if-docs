[< Back to KubeJS-support](KubeJS-support)

# KubeJS Support for adding crops

This page shows how you can add your custom crop via KubeJS.

As the crop registration is related to item & block registration, you have to do it in [`kubejs\startup_scripts`](https://kubejs.com/wiki/folder-structure/startup-scripts). And **DO NOT** reload the script after the registration!

```js
const CropRegistry = Java.loadClass("cool.muyucloud.croparia.kubejs.CropRegistry");
let crops = new CropRegistry("MyCropRegistry");  // The name param is optional
crops.simpleCrop(
    "example", "minecraft:enchanted_golden_apple", 0xABCDEF, 5, "CROP", "item.minecraft.enchanted_golden_apple",
    {
        "en_us": "My Custom Crop",
        "zh_cn": "我的自定义作物"
    }
);
crops.register();
```

You basically do the following steps:
1. Get `CropRegistry` class
2. Instanciate the `CropRegistry`
3. Add crop using method `simpleCrop`, the params are:
- Crop Name
- Material
- Color
- Tier
- Type
- TranslationKey
- Custom Translations
4. Fire registration by invoking `register()` method

For details about the parameters, see also [Add Crops](Add-Crops)